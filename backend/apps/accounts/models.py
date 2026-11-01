from django.db import models
from django.db.models.functions import Lower
from django.conf import settings

def get_ordinal(n):
    if not isinstance(n, int):
        try:
            n = int(n)
        except (ValueError, TypeError):
            return f"{n}th"
    if 11 <= (n % 100) <= 13:
        suffix = 'th'
    else:
        suffix = {1: 'st', 2: 'nd', 3: 'rd'}.get(n % 10, 'th')
    return f"{n}{suffix}"

class StudentProfile(models.Model):
    """
    StudentProfile Extension Model
    Stores student identity, academic metadata, and canonical unique email.
    """
    EDUCATION_LEVEL_CHOICES = [
        ('ug', 'Undergraduate (B.Tech / B.E / B.Sc)'),
        ('pg', 'Postgraduate (M.Tech / M.S / MCA)'),
        ('hs', 'Senior Secondary / High School (STEM)'),
        ('other', 'Self-taught / Bootcamp Student'),
    ]

    DEGREE_CHOICES = [
        ('B.Tech', 'Bachelor of Technology (B.Tech)'),
        ('B.E.', 'Bachelor of Engineering (B.E.)'),
        ('B.Sc.', 'Bachelor of Science (B.Sc.)'),
        ('BCA', 'Bachelor of Computer Applications (BCA)'),
        ('M.Tech', 'Master of Technology (M.Tech)'),
        ('M.E.', 'Master of Engineering (M.E.)'),
        ('M.Sc.', 'Master of Science (M.Sc.)'),
        ('MCA', 'Master of Computer Applications (MCA)'),
        ('Other', 'Other Degree / Diploma Program'),
    ]

    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='student_profile'
    )
    email = models.EmailField(
        max_length=254,
        help_text="Canonical student email address"
    )
    full_name = models.CharField(
        max_length=150,
        help_text="Canonical Full Name of the student"
    )
    institution = models.CharField(
        max_length=255,
        help_text="College, University or Institution name"
    )
    education_level = models.CharField(
        max_length=20,
        choices=EDUCATION_LEVEL_CHOICES,
        default='ug'
    )
    honor_code_accepted = models.BooleanField(
        default=False,
        help_text="Confirmation of Terms of Service, Privacy Policy & Academic Honor Code"
    )

    # Personal contact & profile additions
    personal_email = models.EmailField(
        max_length=254,
        blank=True,
        default='',
        help_text="Alternate or personal email"
    )
    phone_number = models.CharField(
        max_length=30,
        blank=True,
        default='',
        help_text="Contact phone number"
    )
    timezone = models.CharField(
        max_length=100,
        blank=True,
        default='Asia/Kolkata (IST)',
        help_text="Preferred timezone"
    )
    city = models.CharField(
        max_length=100,
        blank=True,
        default='Bengaluru, India',
        help_text="City and country of residence"
    )
    bio = models.TextField(
        blank=True,
        default='',
        help_text="Professional bio / academic summary"
    )
    target_domain = models.CharField(
        max_length=100,
        blank=True,
        default='Distributed Systems',
        help_text="Primary target career domain"
    )

    # Dynamic educational details
    degree = models.CharField(
        max_length=50,
        blank=True,
        default='B.Tech',
        help_text="Current degree program"
    )
    branch = models.CharField(
        max_length=150,
        blank=True,
        default='Computer Science & Engineering',
        help_text="Major or academic branch"
    )
    degree_duration_years = models.PositiveSmallIntegerField(
        default=4,
        help_text="Total duration of the degree in years"
    )
    current_year = models.PositiveSmallIntegerField(
        default=3,
        help_text="Current academic year"
    )
    current_semester = models.PositiveSmallIntegerField(
        default=5,
        help_text="Current enrolled semester"
    )
    expected_graduation = models.CharField(
        max_length=50,
        blank=True,
        default='May 2026',
        help_text="Expected graduation month & year"
    )
    roll_number = models.CharField(
        max_length=50,
        blank=True,
        default='',
        help_text="University registration or roll number"
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'accounts_student_profile'
        verbose_name = 'Student Profile'
        verbose_name_plural = 'Student Profiles'
        ordering = ['-created_at']
        constraints = [
            models.UniqueConstraint(
                Lower('email'),
                name='accounts_student_profile_email_lower_uniq'
            )
        ]

    @property
    def academic_standing(self):
        return f"{get_ordinal(self.current_year)} Year • Semester {self.current_semester}"

    def __str__(self):
        return f"{self.full_name} ({self.email})"


class SemesterAcademicRecord(models.Model):
    """
    SemesterAcademicRecord Model
    Stores completed semester GPA, scale, and credits for a student.
    """
    profile = models.ForeignKey(
        StudentProfile,
        on_delete=models.CASCADE,
        related_name='semester_records'
    )
    semester_number = models.PositiveSmallIntegerField(
        help_text="Semester number (e.g. 1, 2, 3, ...)"
    )
    sgpa = models.DecimalField(
        max_digits=4,
        decimal_places=2,
        help_text="Semester Grade Point Average (SGPA)"
    )
    max_scale = models.DecimalField(
        max_digits=4,
        decimal_places=2,
        default=10.00,
        help_text="Maximum grading scale (e.g. 10.0 or 4.0)"
    )
    credits_earned = models.PositiveSmallIntegerField(
        null=True,
        blank=True,
        help_text="Credits earned in this semester"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'accounts_semester_academic_record'
        verbose_name = 'Semester Academic Record'
        verbose_name_plural = 'Semester Academic Records'
        ordering = ['semester_number']
        constraints = [
            models.UniqueConstraint(
                fields=['profile', 'semester_number'],
                name='accounts_sem_record_profile_sem_uniq'
            )
        ]

    def __str__(self):
        return f"{self.profile.full_name} - Sem {self.semester_number}: {self.sgpa}/{self.max_scale}"
