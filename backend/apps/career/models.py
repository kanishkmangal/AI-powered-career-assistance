from django.db import models
from django.conf import settings

class StudentResume(models.Model):
    """
    StudentResume Model
    Stores uploaded resume documents and associated telemetry for students
    in EduMitra AI Career & Resume Builder module.
    """
    student = models.ForeignKey(
        'accounts.StudentProfile',
        on_delete=models.CASCADE,
        related_name='resumes'
    )
    file = models.FileField(upload_to='resumes/%Y/%m/', blank=True, null=True)
    file_name = models.CharField(max_length=255)
    file_size = models.IntegerField(default=0, help_text="File size in bytes")
    file_type = models.CharField(max_length=50, default='application/pdf')
    target_role = models.CharField(
        max_length=255,
        default='Cloud & Distributed Systems Engineer (L3/Associate)',
        blank=True
    )
    parsed_data = models.JSONField(default=dict, blank=True)
    uploaded_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-uploaded_at']

    def __str__(self):
        return f"{self.file_name} ({self.student.email})"
