import re
import uuid
import unicodedata
import logging
from decimal import Decimal
from rest_framework import serializers
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError as DjangoValidationError
from django.db import transaction, IntegrityError
from .models import StudentProfile, SemesterAcademicRecord

logger = logging.getLogger(__name__)

def generate_unique_username(email_prefix):
    """
    Generates a unique, collision-resistant username <= 150 characters.
    Format: 'student_{clean_prefix[:30]}_{uuid4_hex[:16]}' (<= 55 characters).
    """
    clean_prefix = re.sub(r'[^a-zA-Z0-9_]', '_', email_prefix.strip())[:30].strip('_') or 'student'
    candidate = f"student_{clean_prefix}_{uuid.uuid4().hex[:16]}"
    while User.objects.filter(username=candidate).exists():
        candidate = f"student_{clean_prefix}_{uuid.uuid4().hex[:16]}"
    return candidate


class StudentProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = StudentProfile
        fields = ['id', 'email', 'full_name', 'institution', 'education_level', 'honor_code_accepted', 'created_at']
        read_only_fields = ['id', 'created_at']


class RegisterSerializer(serializers.Serializer):
    fullName = serializers.CharField(
        max_length=150,
        required=True,
        error_messages={'blank': 'Full Name is required.'}
    )
    institution = serializers.CharField(
        max_length=255,
        required=True,
        error_messages={'blank': 'College / Institution is required.'}
    )
    email = serializers.EmailField(
        max_length=254,
        required=True,
        error_messages={
            'blank': 'Email Address is required.',
            'invalid': 'Please enter a valid email address.'
        }
    )
    eduLevel = serializers.ChoiceField(
        choices=StudentProfile.EDUCATION_LEVEL_CHOICES,
        required=True,
        error_messages={
            'blank': 'Please select your current education level.',
            'invalid_choice': 'Invalid education level selected.'
        }
    )
    password = serializers.CharField(
        write_only=True,
        required=True,
        style={'input_type': 'password'},
        error_messages={'blank': 'Password is required.'}
    )
    confirmPassword = serializers.CharField(
        write_only=True,
        required=True,
        style={'input_type': 'password'},
        error_messages={'blank': 'Confirm Password is required.'}
    )
    agreeHonorCode = serializers.BooleanField(
        required=True,
        error_messages={'required': 'You must accept the terms and honor code.'}
    )

    def validate_fullName(self, value):
        cleaned = value.strip()
        if len(cleaned) < 2:
            raise serializers.ValidationError("Full Name must be at least 2 characters.")
        if len(cleaned) > 150:
            raise serializers.ValidationError("Full Name cannot exceed 150 characters.")
        
        allowed_punctuation = {" ", "'", "-", "."}
        for char in cleaned:
            cat = unicodedata.category(char)
            if not (cat.startswith('L') or cat.startswith('M') or char in allowed_punctuation):
                raise serializers.ValidationError(
                    "Full Name contains invalid characters. Only letters, spaces, hyphens, periods, and apostrophes are allowed."
                )
        if not any(unicodedata.category(c).startswith('L') for c in cleaned):
            raise serializers.ValidationError("Full Name must contain at least one letter.")
        return cleaned

    def validate_institution(self, value):
        cleaned = value.strip()
        if len(cleaned) < 2:
            raise serializers.ValidationError("College / Institution must be at least 2 characters.")
        if len(cleaned) > 255:
            raise serializers.ValidationError("College / Institution cannot exceed 255 characters.")
        return cleaned

    def validate_email(self, value):
        cleaned = value.strip().lower()
        if StudentProfile.objects.filter(email__iexact=cleaned).exists() or User.objects.filter(email__iexact=cleaned).exists():
            raise serializers.ValidationError("A student account with this email address already exists.")
        return cleaned

    def validate_agreeHonorCode(self, value):
        if not value:
            raise serializers.ValidationError("You must agree to the Terms of Service, Privacy Policy, and Honor Code.")
        return value

    def validate(self, attrs):
        password = attrs.get('password')
        confirm_password = attrs.get('confirmPassword')

        if password != confirm_password:
            raise serializers.ValidationError({'confirmPassword': 'Passwords do not match.'})

        errors = []
        if len(password) < 8:
            errors.append("Password must be at least 8 characters long.")
        if not re.search(r'[a-z]', password):
            errors.append("Password must contain at least one lowercase letter (a-z).")
        if not re.search(r'[A-Z]', password):
            errors.append("Password must contain at least one uppercase letter (A-Z).")
        if not re.search(r'[0-9]', password):
            errors.append("Password must contain at least one number (0-9).")
        if not re.search(r'[^A-Za-z0-9]', password):
            errors.append("Password must contain at least one special character (!@#$).")

        if errors:
            raise serializers.ValidationError({'password': errors})

        try:
            validate_password(password)
        except DjangoValidationError as exc:
            raise serializers.ValidationError({'password': list(exc.messages)})

        return attrs

    def create(self, validated_data):
        email = validated_data['email'].strip().lower()
        password = validated_data['password']
        full_name = validated_data['fullName'].strip()
        institution = validated_data['institution'].strip()
        edu_level = validated_data['eduLevel']
        agree_honor_code = validated_data['agreeHonorCode']

        email_prefix = email.split('@')[0] if '@' in email else 'student'
        username = generate_unique_username(email_prefix)

        try:
            with transaction.atomic():
                user = User.objects.create_user(
                    username=username,
                    email=email,
                    password=password,
                    first_name='',
                    last_name=''
                )
                StudentProfile.objects.create(
                    user=user,
                    email=email,
                    full_name=full_name,
                    institution=institution,
                    education_level=edu_level,
                    honor_code_accepted=agree_honor_code
                )
                return user
        except IntegrityError as exc:
            underlying = getattr(exc, '__cause__', None)
            diag = getattr(underlying, 'diag', None)
            constraint_name = getattr(diag, 'constraint_name', None) if diag else None

            if constraint_name == 'accounts_student_profile_email_lower_uniq':
                raise serializers.ValidationError({
                    'email': ['A student account with this email address already exists.']
                })
            if constraint_name == 'auth_user_username_key':
                raise serializers.ValidationError({
                    'non_field_errors': ['A temporary registration collision occurred. Please submit again.']
                })

            logger.error("Unexpected IntegrityError during registration: %s", exc, exc_info=True)
            raise serializers.ValidationError({
                'non_field_errors': ['A database error occurred while creating your account. Please try again later.']
            })


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField(required=True)
    password = serializers.CharField(required=True, write_only=True)

    def validate(self, attrs):
        email = attrs.get('email', '').strip().lower()
        password = attrs.get('password', '')

        # Look up by email case-insensitively
        user = User.objects.filter(email__iexact=email).first()
        if not user:
            raise serializers.ValidationError({'detail': 'Invalid email or password.'})

        # Authenticate with username and password
        auth_user = authenticate(username=user.username, password=password)
        if not auth_user:
            raise serializers.ValidationError({'detail': 'Invalid email or password.'})

        if not auth_user.is_active:
            raise serializers.ValidationError({'detail': 'This account has been deactivated.'})

        attrs['user'] = auth_user
        return attrs


class SemesterAcademicRecordSerializer(serializers.ModelSerializer):
    semester_number = serializers.IntegerField(min_value=1, max_value=12)
    sgpa = serializers.DecimalField(max_digits=4, decimal_places=2, min_value=Decimal('0.00'))
    max_scale = serializers.DecimalField(max_digits=4, decimal_places=2, default=Decimal('10.00'), min_value=Decimal('1.00'))
    credits_earned = serializers.IntegerField(required=False, allow_null=True, min_value=0, max_value=60)

    class Meta:
        model = SemesterAcademicRecord
        fields = ['id', 'semester_number', 'sgpa', 'max_scale', 'credits_earned']
        read_only_fields = ['id']

    def validate(self, attrs):
        sgpa = attrs.get('sgpa')
        max_scale = attrs.get('max_scale', Decimal('10.00'))
        if sgpa is not None and max_scale is not None and sgpa > max_scale:
            raise serializers.ValidationError({
                'sgpa': f'SGPA ({sgpa}) cannot exceed maximum scale ({max_scale}).'
            })
        return attrs


def compute_gpa_metrics(profile):
    """
    Computes CGPA, weighting mode, min/peak GPA, and trajectory metrics from saved records.
    """
    records = list(profile.semester_records.filter(semester_number__lte=profile.current_semester).order_by('semester_number'))
    if not records:
        return {
            'cgpa': None,
            'is_credit_weighted': False,
            'total_credits': 0,
            'min_gpa': None,
            'peak_gpa': None,
            'peak_semester': None,
            'gpa_delta_since_sem1': None
        }

    has_credits = all(r.credits_earned is not None and r.credits_earned > 0 for r in records)
    if has_credits:
        total_credits = sum(r.credits_earned for r in records)
        weighted_sum = sum(float(r.sgpa) * r.credits_earned for r in records)
        cgpa = round(weighted_sum / total_credits, 2) if total_credits > 0 else 0.0
        is_credit_weighted = True
    else:
        total_credits = sum(r.credits_earned or 0 for r in records)
        cgpa = round(sum(float(r.sgpa) for r in records) / len(records), 2)
        is_credit_weighted = False

    sgpas = [float(r.sgpa) for r in records]
    min_gpa = min(sgpas)
    peak_record = max(records, key=lambda r: float(r.sgpa))
    peak_gpa = float(peak_record.sgpa)
    peak_semester = peak_record.semester_number
    first_sgpa = float(records[0].sgpa)
    last_sgpa = float(records[-1].sgpa)
    delta = round(last_sgpa - first_sgpa, 2)

    return {
        'cgpa': cgpa,
        'is_credit_weighted': is_credit_weighted,
        'total_credits': total_credits,
        'min_gpa': min_gpa,
        'peak_gpa': peak_gpa,
        'peak_semester': peak_semester,
        'gpa_delta_since_sem1': delta
    }


class StudentProfileDetailSerializer(serializers.ModelSerializer):
    first_name = serializers.SerializerMethodField()
    last_name = serializers.SerializerMethodField()
    academic_standing = serializers.ReadOnlyField()
    semester_records = SemesterAcademicRecordSerializer(many=True, read_only=True)
    metrics = serializers.SerializerMethodField()

    class Meta:
        model = StudentProfile
        fields = [
            'id', 'email', 'full_name', 'first_name', 'last_name',
            'institution', 'education_level', 'personal_email', 'phone_number',
            'timezone', 'city', 'bio', 'target_domain',
            'degree', 'branch', 'degree_duration_years',
            'current_year', 'current_semester', 'academic_standing',
            'expected_graduation', 'roll_number', 'honor_code_accepted',
            'semester_records', 'metrics', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'email', 'created_at', 'updated_at']

    def get_first_name(self, obj):
        if obj.user.first_name:
            return obj.user.first_name
        parts = obj.full_name.split(' ', 1)
        return parts[0] if parts else ''

    def get_last_name(self, obj):
        if obj.user.last_name:
            return obj.user.last_name
        parts = obj.full_name.split(' ', 1)
        return parts[1] if len(parts) > 1 else ''

    def get_metrics(self, obj):
        return compute_gpa_metrics(obj)


class StudentProfileUpdateSerializer(serializers.ModelSerializer):
    first_name = serializers.CharField(max_length=150, required=False, allow_blank=True)
    last_name = serializers.CharField(max_length=150, required=False, allow_blank=True)
    semester_records = SemesterAcademicRecordSerializer(many=True, required=False)

    class Meta:
        model = StudentProfile
        fields = [
            'full_name', 'first_name', 'last_name', 'institution', 'education_level',
            'personal_email', 'phone_number', 'timezone', 'city', 'bio', 'target_domain',
            'degree', 'branch', 'degree_duration_years', 'current_year', 'current_semester',
            'expected_graduation', 'roll_number', 'semester_records'
        ]

    def validate(self, attrs):
        duration = attrs.get('degree_duration_years') or getattr(self.instance, 'degree_duration_years', 4)
        current_year = attrs.get('current_year') or getattr(self.instance, 'current_year', 1)
        current_semester = attrs.get('current_semester') or getattr(self.instance, 'current_semester', 1)

        if current_year > duration:
            raise serializers.ValidationError({
                'current_year': f'Current year ({current_year}) cannot exceed degree duration ({duration} years).'
            })

        max_semesters = duration * 2
        if current_semester > max_semesters:
            raise serializers.ValidationError({
                'current_semester': f'Current semester ({current_semester}) cannot exceed max semester for degree ({max_semesters}).'
            })

        sem_records = attrs.get('semester_records')
        if sem_records is not None:
            seen_sems = set()
            for record_data in sem_records:
                sem_num = record_data.get('semester_number')
                if sem_num in seen_sems:
                    raise serializers.ValidationError({
                        'semester_records': f'Duplicate entry for Semester {sem_num}.'
                    })
                seen_sems.add(sem_num)
                if sem_num > current_semester:
                    raise serializers.ValidationError({
                        'semester_records': f'Cannot enter GPA for future Semester {sem_num}. Current semester is {current_semester}.'
                    })

        return attrs

    def update(self, instance, validated_data):
        first_name = validated_data.pop('first_name', None)
        last_name = validated_data.pop('last_name', None)
        semester_records_data = validated_data.pop('semester_records', None)

        with transaction.atomic():
            # Update user names
            user = instance.user
            user_dirty = False
            if first_name is not None:
                user.first_name = first_name.strip()
                user_dirty = True
            if last_name is not None:
                user.last_name = last_name.strip()
                user_dirty = True
            if user_dirty:
                user.save(update_fields=['first_name', 'last_name'])
                combined = f"{user.first_name} {user.last_name}".strip()
                if combined:
                    instance.full_name = combined

            # Update profile fields
            for attr, val in validated_data.items():
                setattr(instance, attr, val)
            instance.save()

            # Sync semester records if provided
            if semester_records_data is not None:
                current_sem = instance.current_semester
                # Delete any record exceeding current semester
                instance.semester_records.filter(semester_number__gt=current_sem).delete()

                for rec in semester_records_data:
                    sem_num = rec['semester_number']
                    if sem_num <= current_sem:
                        SemesterAcademicRecord.objects.update_or_create(
                            profile=instance,
                            semester_number=sem_num,
                            defaults={
                                'sgpa': rec['sgpa'],
                                'max_scale': rec.get('max_scale', Decimal('10.00')),
                                'credits_earned': rec.get('credits_earned')
                            }
                        )

        return instance

