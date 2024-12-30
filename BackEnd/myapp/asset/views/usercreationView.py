from rest_framework.decorators import api_view
from django.contrib.auth import authenticate, login as auth_login
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.models import User, Group, Permission 
from asset.models.UserModel import UserRolePermission
from ..serializers.UserSerializer import UserSerializer, UserRolePermissionSerializer, GroupSerializer, PermissionSerializer
from django.shortcuts import get_object_or_404
from ..models.CustomerMasterModel import CustomerMaster
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes





@api_view(['POST'])
@permission_classes([IsAuthenticated])
def admincreates(request):

    data = request.data
    
    id_fetch =data.get('id')
    username = data.get('username')
    password = data.get('password')
    email = data.get('email')
    customer_id = data.get('customer_id')  
    status = data.get('status')  
    role_id = data.get('role_id') 
    is_active = 1 if status == 'Active' else 0
    
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
    groups = Group.objects.all()

    group_data = [{"id": group.id, "name": group.name} for group in groups]

    return Response(group_data, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def usermaster_get(request):   
    users = User.objects.all()

    user_data = []
    for user in users:
        groups = user.groups.all()
        group_names = [group.name for group in groups]  

        user_data.append({
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'is_active': user.is_active,
            'groups': group_names,  
        })

    return Response(user_data, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([IsAuthenticated])    
def edit_usermaster_fetch(request,id):
    user = get_object_or_404(User, id=id)
    
    all_groups = Group.objects.all()
    
    user_groups = user.groups.all()
    group_data = [{"id": group.id, "name": group.name} for group in user_groups]  
 
    
    customer_id = user.last_name
    customer_data = None
    if customer_id:
        try:
            customer = CustomerMaster.objects.get(id=customer_id)
            customer_data = {"id": customer.id, "name": customer.name} 
        except CustomerMaster.DoesNotExist:
            customer_data = "Unknown"  

    user_data = {
        "id": user.id,
        "username": user.username,
        "email": user.email,
        "is_active": user.is_active,
        "groups": group_data,  
        "customer": customer_data,
    }

    return Response(user_data, status=status.HTTP_200_OK)   



@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def create_update_user(request, id=None):
    try:
        data = request.data
        username = data.get('username')
        password = data.get('password')
        email = data.get('email')
        customer_id = data.get('customer_id')
        status_value = data.get('status')
        role_id = data.get('role_id')

        is_active = 1 if status_value == 'Active' else 0

        if id:
            try:
                user = User.objects.get(id=id)
            except User.DoesNotExist:
                return Response(
                    {"success": False, "message": "User not found"},
                    status=status.HTTP_404_NOT_FOUND
                )

            user.username = username
            user.email = email
            user.is_active = is_active
            user.last_name = str(customer_id)

            if password:
                user.set_password(password)

            user.save()

            if role_id:
                try:
                    group = Group.objects.get(id=role_id)
                except Group.DoesNotExist:
                    return Response(
                        {"success": False, "message": "Group not found"},
                        status=status.HTTP_404_NOT_FOUND
                    )

                user.groups.through.objects.filter(user_id=user.id).update(group_id=role_id)

            return Response(
                {
                    "success": True,
                    "message": "User updated successfully",
                    "user": UserSerializer(user).data,
                },
                status=status.HTTP_200_OK,
            )

        else:
            if User.objects.filter(username=username).exists():
                return Response(
                    {"success": False, "message": "Username already exists"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            user = User.objects.create_user(
                username=username,
                email=email,
                password=password,
                is_active=is_active,
                last_name=str(customer_id) if customer_id else '',
            )

            if role_id:
                try:
                    group = Group.objects.get(id=role_id)
                except Group.DoesNotExist:
                    return Response(
                        {"success": False, "message": "Group not found"},
                        status=status.HTTP_404_NOT_FOUND,
                    )

                user.groups.add(group)

            user.save()

            return Response(
                {
                    "success": True,
                    "message": "User created successfully",
                    "user": UserSerializer(user).data,
                },
                status=status.HTTP_201_CREATED,
            )

    except Exception as e:
        return Response(
            {"success": False, "message": "An error occurred", "error": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )