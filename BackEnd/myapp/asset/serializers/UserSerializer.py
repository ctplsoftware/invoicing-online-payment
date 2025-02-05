from rest_framework import serializers
from asset.models.UserModel import UserRolePermission
from django.contrib.auth.models import User, Group, Permission

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username']  # Exclude password for security

class GroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = Group
        fields = ['id', 'name']

class PermissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Permission
        fields = ['id', 'name']

class UserRolePermissionSerializer(serializers.ModelSerializer):
    role = GroupSerializer()
    permission = PermissionSerializer()

    class Meta:
        model = UserRolePermission
        fields = ['id', 'role', 'permission', 'can_create', 'can_read', 'can_update']


