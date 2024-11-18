from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework import permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from django.contrib.auth.models import User

# This view allows the user to get an access token (JWT) and refresh token
class CustomTokenObtainPairView(TokenObtainPairView):
    permission_classes = [permissions.AllowAny]

# Refresh token view
class CustomTokenRefreshView(TokenRefreshView):
    permission_classes = [permissions.AllowAny]

