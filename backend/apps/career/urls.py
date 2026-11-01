from django.urls import path
from .views import career_index

urlpatterns = [
    path('', career_index, name='career-index'),
]

