from django.urls import path
from .views import (
    career_index,
    ResumeUploadView,
    LatestResumeView,
    ResumeDeleteView,
    ResumeAnalysisView,
    ResumeAnalysisApplyView,
)

urlpatterns = [
    path('', career_index, name='career-index'),
    # Resume Builder & Upload APIs
    path('resumes/upload/', ResumeUploadView.as_view(), name='career-resume-upload'),
    path('resumes/latest/', LatestResumeView.as_view(), name='career-resume-latest'),
    path('resumes/<int:resume_id>/', ResumeDeleteView.as_view(), name='career-resume-delete'),
    # Resume ATS Analysis APIs (After Upload)
    path('resumes/analysis/', ResumeAnalysisView.as_view(), name='career-resume-analysis'),
    path('resumes/analysis/apply/', ResumeAnalysisApplyView.as_view(), name='career-resume-analysis-apply'),
]
