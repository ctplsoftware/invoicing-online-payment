from rest_framework.decorators import api_view
from django.contrib.auth import authenticate, login as auth_login
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.models import User, Group, Permission
from .models import UserRolePermission, SampleForm
from .serializers import UserSerializer, UserRolePermissionSerializer, GroupSerializer, PermissionSerializer, SampleFormSerializer

@api_view(['POST'])
def signup(request):
    username = request.data.get('username')
    password = request.data.get('password')

    if User.objects.filter(username=username).exists():
        return Response({"error": "Username already exists"}, status=status.HTTP_400_BAD_REQUEST)

    user = User.objects.create_user(username=username, password=password)  # Handles password hashing
    serializer = UserSerializer(user)
    return Response(serializer.data, status=status.HTTP_201_CREATED)

@api_view(['POST'])
def login(request):
    username = request.data.get('username')
    password = request.data.get('password')

    user = authenticate(username=username, password=password)  # Authenticate using Django's built-in method

    if user is not None:
        auth_login(request._request, user)  # Log in the user
        serializer = UserSerializer(user)
        
        # Fetch role-based permissions for the user
        user_role_permissions = UserRolePermission.objects.filter(user=user)
        permission_data = UserRolePermissionSerializer(user_role_permissions, many=True).data
        
        return Response({
            'user': serializer.data,
            'permissions': permission_data
        }, status=status.HTTP_200_OK)
    else:
        return Response({"error": "Invalid credentials"}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def assign_permissions(request):
    role_name = request.data.get('role')
    user_id = request.data.get('user')
    can_create = request.data.get('can_create', False)
    can_read = request.data.get('can_read', False)
    can_update = request.data.get('can_update', False)

    # Find or create the role (group)
    role, created = Group.objects.get_or_create(name=role_name)

    # Find user
    user = User.objects.get(id=user_id)

    # Add user to the role (group)
    user.groups.add(role)

    # Find or create permissions
    permissions = Permission.objects.all()  # Adjust this based on your needs

    # Assign permissions
    for perm in permissions:
        UserRolePermission.objects.update_or_create(
            user=user,
            role=role,
            permission=perm,
            defaults={
                'can_create': can_create,
                'can_read': can_read,
                'can_update': can_update,
            }
        )

    return Response({'status': 'Permissions assigned'}, status=status.HTTP_200_OK)

@api_view(['GET'])
def get_user_roles_and_permissions(request, user_id):
    try:
        user = User.objects.get(id=user_id)
    except User.DoesNotExist:
        return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

    # Fetch user's groups (roles)
    user_groups = user.groups.all()

    # Serialize roles (groups)
    group_serializer = GroupSerializer(user_groups, many=True)

    # Fetch all permissions associated with the user's roles
    user_role_permissions = UserRolePermission.objects.filter(user=user)
    permission_serializer = UserRolePermissionSerializer(user_role_permissions, many=True)

    return Response({
        'roles': group_serializer.data,
        'permissions': permission_serializer.data
    }, status=status.HTTP_200_OK)


@api_view(['POST'])
def sample_form_create(request):
    """Create a new SampleForm entry."""
    serializer = SampleFormSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def sample_form_list(request):
    """Retrieve a list of all SampleForm entries."""
    sample_forms = SampleForm.objects.all()
    serializer = SampleFormSerializer(sample_forms, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def sample_form_detail(request, pk):
    """Retrieve a specific SampleForm entry by its ID."""
    try:
        sample_form = SampleForm.objects.get(pk=pk)
    except SampleForm.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    serializer = SampleFormSerializer(sample_form)
    return Response(serializer.data)

@api_view(['PUT'])
def sample_form_update(request, pk):
    """Update a specific SampleForm entry by its ID."""
    try:
        sample_form = SampleForm.objects.get(pk=pk)
    except SampleForm.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    serializer = SampleFormSerializer(sample_form, data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
