from django.urls import path
from .views import accounts_index, RegisterView, LoginView, MeView, StudentProfileView

urlpatterns = [
    path('', accounts_index, name='accounts-index'),
    path('register/', RegisterView.as_view(), name='accounts-register'),
    path('login/', LoginView.as_view(), name='accounts-login'),
    path('me/', MeView.as_view(), name='accounts-me'),
    path('profile/', StudentProfileView.as_view(), name='accounts-profile'),
]
