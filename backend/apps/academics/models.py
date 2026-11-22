from django.db import models
from django.conf import settings

class AIChatSession(models.Model):
    """
    AIChatSession Model
    Stores chat conversation sessions for students using EduMitra Socratic AI Tutor.
    """
    MODE_CHOICES = [
        ('socratic', 'Socratic Tutor'),
        ('summary', 'Quick Exam Summary'),
        ('drills', 'Code & Proof Drills'),
    ]

    TONE_CHOICES = [
        ('concise_academic', 'Concise Academic'),
        ('socratic', 'In-Depth Socratic'),
        ('eli5', 'Simplified ELI5'),
        ('exam', 'Exam Oriented'),
    ]

    student = models.ForeignKey(
        'accounts.StudentProfile',
        on_delete=models.CASCADE,
        related_name='ai_chat_sessions'
    )
    title = models.CharField(max_length=255, default='New Chat Session')
    subject = models.CharField(max_length=100, default='DBMS (CS-304)', blank=True)
    semester = models.CharField(max_length=50, default='Semester 6', blank=True)
    mode = models.CharField(max_length=50, choices=MODE_CHOICES, default='socratic')
    tone = models.CharField(max_length=50, choices=TONE_CHOICES, default='concise_academic')
    is_pinned = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-updated_at']

    def __str__(self):
        return f"{self.title} ({self.student.email})"


class AIChatMessage(models.Model):
    """
    AIChatMessage Model
    Stores individual dialogue turns between student and EduMitra Socratic AI.
    """
    SENDER_CHOICES = [
        ('user', 'Student'),
        ('assistant', 'EduMitra AI'),
    ]

    session = models.ForeignKey(
        AIChatSession,
        on_delete=models.CASCADE,
        related_name='messages'
    )
    sender = models.CharField(max_length=20, choices=SENDER_CHOICES)
    content = models.TextField()
    metadata = models.JSONField(default=dict, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['created_at']

    def __str__(self):
        return f"{self.sender}: {self.content[:30]}..."
