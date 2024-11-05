from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from ..models.CustomerMasterModel import CustomerMaster
from ..serializers.CustomerSerializer import CustomerSerializer

@api_view(['POST'])
def create_customer(request):

    additional_addresses = request.data.get('additional_addresses', [])
    additional_address1 = additional_addresses[0].strip() if len(additional_addresses) > 0 else ''
    additional_address2 = additional_addresses[1].strip() if len(additional_addresses) > 1 else ''


    validated_data = {
        key: value for key, value in {
            'name': request.data.get('name', '').strip(),
            'billing_address': request.data.get('billing_address', '').strip(),
            'additional_address1':additional_address1,
            'additional_address2':additional_address2,
            'company_address': request.data.get('company_address', '').strip(),
            'gstin_number': request.data.get('gstin_number', '').strip(),
            'credit_limit': request.data.get('credit_limit', '').strip(),
            'expiration_date': request.data.get('expiration_date', '').strip(),
            'contact_person': request.data.get('contact_person', '').strip(),
            'contact_number': request.data.get('contact_number', '').strip(),
            'status': 'active',  # Set default status to 'active'
            'created_by': '1',
            'updated_by': '1',
        }.items() if value  # Only include fields with non-empty values
    }

    serializer = CustomerSerializer(data=validated_data)
    
    if serializer.is_valid():
        serializer.save()  # Save the validated data
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    else:
        print(serializer.errors)  # Log errors for debugging
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
