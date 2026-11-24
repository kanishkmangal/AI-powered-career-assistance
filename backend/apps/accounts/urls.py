from django.urls import path
from .views import (
    accounts_index,
    RegisterView,
    LoginView,
    VerifyTokenView,
    LogoutView,
    MeView,
    StudentProfileView,
    ChangePasswordView,
)

urlpatterns = [
    path('', accounts_index, name='accounts-index'),
    path('register/', RegisterView.as_view(), name='accounts-register'),
    path('login/', LoginView.as_view(), name='accounts-login'),
    path('verify/', VerifyTokenView.as_view(), name='accounts-verify'),
    path('logout/', LogoutView.as_view(), name='accounts-logout'),
    path('me/', MeView.as_view(), name='accounts-me'),
    path('profile/', StudentProfileView.as_view(), name='accounts-profile'),
    path('change-password/', ChangePasswordView.as_view(), name='accounts-change-password'),
]
