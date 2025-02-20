from rest_framework.decorators import api_view
from django.contrib.auth import authenticate, login as auth_login
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.models import User, Group, Permission
from asset.models.UserModel import UserRolePermission
from ..serializers.UserSerializer import UserSerializer, UserRolePermissionSerializer, GroupSerializer, PermissionSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes




@api_view(['POST'])
def login(request):
    username = request.data.get('username')
    password = request.data.get('password')

    user = authenticate(username=username, password=password) 

    if user is not None:
        
        # Generate the JWT tokens
        refresh = RefreshToken.for_user(user)
        
        # Serialize user data and user permissions
        serializer = UserSerializer(user)
        user_role_permissions = UserRolePermission.objects.filter(user=user)
        permission_data = UserRolePermissionSerializer(user_role_permissions, many=True).data
        
        return Response({
            'user': serializer.data,
            'permissions': permission_data,
            'refresh': str(refresh),
            'access': str(refresh.access_token), # type: ignore
        }, status=status.HTTP_200_OK)
    
    return Response({"error": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)

    
@api_view(['POST'])
def forgot_password(request):
    username = request.data.get('username')
    new_password = request.data.get('new_password')

    try:
        user = User.objects.get(username=username)
        user.set_password(new_password)
        user.save()
        return Response({"message": "Password updated successfully"}, status=status.HTTP_200_OK)
    except User.DoesNotExist:
        return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)


@api_view(['GET'])
@permission_classes([IsAuthenticated])  # Only authenticated users can access this route
def user_data(request):
    # Retrieve the user from the authenticated request
    user = request.user
    serializer = UserSerializer(user)
    return Response(serializer.data)