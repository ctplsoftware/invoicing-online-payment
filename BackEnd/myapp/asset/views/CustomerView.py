from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from ..models.CustomerMasterModel import CustomerMaster
from ..serializers.CustomerSerializer import CustomerSerializer

@api_view(['POST'])
def create_customer(request):
    validated_data = {
        'name': request.data.get('name'),
        'primary_address': request.data.get('primary_address'),
        'secondary_address': request.data.get('secondary_address'),
        'credit_limit': request.data.get('credit_limit'),
        'expiration_date': request.data.get('expiration_date'),
        'contact_person': request.data.get('contact_person'),
        'contact_number': request.data.get('contact_number'),
        'status': 'active',  # Specify the status explicitly
        'created_by': '1',  # Set created_by from the logged-in user
        'updated_by': '1',  # Set updated_by from the logged-in user
    }

    serializer = CustomerSerializer(data=validated_data)
    
    if serializer.is_valid():
        serializer.save()  # Save the validated data
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    else:
        print(serializer.errors)  # Log errors for debugging
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)