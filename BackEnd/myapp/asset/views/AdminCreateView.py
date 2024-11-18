from rest_framework.decorators import api_view
from django.contrib.auth import authenticate, login as auth_login
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.models import User, Group, Permission 
from asset.models.UserModel import UserRolePermission, SampleForm
from ..serializers.UserSerializer import UserSerializer, UserRolePermissionSerializer, GroupSerializer, PermissionSerializer, SampleFormSerializer


@api_view(['POST'])
def admincreates(request):

    # Get the data from the request
    data = request.data
    print('backend check',data)
    
    # Extract fields from the request
    id_fetch =data.get('id')
    username = data.get('username')
    password = data.get('password')
    email = data.get('mail')
    customer_id = data.get('customer_id')  # You can add logic to process this field
    status = data.get('status')  # You can add logic to process this field
    role_id = data.get('role_id')  # Role corresponds to Group
    is_active = 1 if status == 'Active' else 0
    
    # Create the user
    user = User.objects.create_user(username=username, password=password, email=email,first_name=role_id,last_name=customer_id,is_active=is_active)

    if role_id:
        try:
            group = Group.objects.get(id=role_id)
            user.groups.add(group)
        except Group.DoesNotExist:
            return Response({'error': 'Invalid role_id specified'})


    
    user_data = UserSerializer(user).data
    
    return Response({'message': 'User created successfully', 'user': user_data}) # type: ignore

@api_view(['GET'])
def rolesget(request):
    # Query all groups in the Group model
    groups = Group.objects.all()

    # Serialize the group data (just name and id)
    group_data = [{"id": group.id, "name": group.name} for group in groups]

    return Response(group_data, status=status.HTTP_200_OK)

