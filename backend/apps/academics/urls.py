from django.urls import path
from .views import (
    academics_index,
    AIChatSessionListView,
    AIChatSessionDetailView,
    AIChatSessionClearView,
    AIChatMessageCreateView,
    AIChatMessageFeedbackView,
    AIChatGenerateMCQsView,
)

urlpatterns = [
    path('', academics_index, name='academics-index'),
    # AI Assistant endpoints
    path('ai/sessions/', AIChatSessionListView.as_view(), name='ai-sessions-list'),
    path('ai/sessions/<int:session_id>/', AIChatSessionDetailView.as_view(), name='ai-sessions-detail'),
    path('ai/sessions/<int:session_id>/clear/', AIChatSessionClearView.as_view(), name='ai-sessions-clear'),
    path('ai/sessions/<int:session_id>/messages/', AIChatMessageCreateView.as_view(), name='ai-messages-create'),
    path('ai/sessions/<int:session_id>/generate-mcqs/', AIChatGenerateMCQsView.as_view(), name='ai-generate-mcqs'),
    path('ai/messages/<int:message_id>/feedback/', AIChatMessageFeedbackView.as_view(), name='ai-messages-feedback'),
]
