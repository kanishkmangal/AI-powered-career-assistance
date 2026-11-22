from rest_framework import serializers
from .models import StudentResume

class StudentResumeSerializer(serializers.ModelSerializer):
    file_size_formatted = serializers.SerializerMethodField()

    class Meta:
        model = StudentResume
        fields = [
            'id', 'student', 'file', 'file_name', 'file_size',
            'file_size_formatted', 'file_type', 'target_role',
            'parsed_data', 'uploaded_at', 'updated_at'
        ]
        read_only_fields = ['id', 'student', 'uploaded_at', 'updated_at', 'file_size_formatted']

    def get_file_size_formatted(self, obj):
        if not obj.file_size:
            return "0 KB"
        kb = obj.file_size / 1024
        if kb < 1024:
            return f"{kb:.1f} KB"
        mb = kb / 1024
        return f"{mb:.1f} MB"
