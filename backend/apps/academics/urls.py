from django.urls import path
from .views import academics_index

urlpatterns = [
    path('', academics_index, name='academics-index'),
]

