from django.urls import path
from .views import notifications_index

urlpatterns = [
    path('', notifications_index, name='notifications-index'),
]

