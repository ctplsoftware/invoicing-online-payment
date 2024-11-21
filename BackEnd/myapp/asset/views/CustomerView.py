from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from ..models.CustomerMasterModel import CustomerMaster
from ..serializers.CustomerSerializer import CustomerSerializer
from django.utils import timezone


@api_view(['POST'])
def create_customer(request):

    additional_addresses = request.data.get('additional_addresses', [])
    additional_address1 = additional_addresses[0].strip() if len(additional_addresses) > 0 else ''
    additional_address2 = additional_addresses[1].strip() if len(additional_addresses) > 1 else ''


    validated_data = {
        key: value for key, value in {
            'name': request.data.get('name', '').strip(),
            'delivery_address': request.data.get('delivery_address', '').strip(),
            'additional_address1':additional_address1,
            'additional_address2':additional_address2,
            'billing_address': request.data.get('billing_address', '').strip(),
            'gstin_number': request.data.get('gstin_number', '').strip(),
            'credit_limit': request.data.get('credit_limit', '').strip(),
            'credit_days': request.data.get('credit_days', '').strip(),
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
    

@api_view(['GET'])
def get_customer_data(request, id=None):
    if id is not None:
        try:
            customer = CustomerMaster.objects.get(id=id)
            serializer = CustomerSerializer(customer)
            return Response(serializer.data)
        except CustomerMaster.DoesNotExist:
            return Response({"error": "Customer not found"}, status=404)
    else:
        customerMaster_data = CustomerMaster.objects.all()
        serializer = CustomerSerializer(customerMaster_data, many=True)
        return Response(serializer.data)
    

@api_view(['GET'])
def get_customer_editdata(request, id):
    try:
        customer = CustomerMaster.objects.get(id=id)
        serializer = CustomerSerializer(customer)
        return Response(serializer.data)
    except CustomerMaster.DoesNotExist:
        return Response({"error": "Customer not found"}, status=404)


@api_view(['PUT'])  
def update_customer(request, id):
    try:
        customer = CustomerMaster.objects.get(id=id)
    except CustomerMaster.DoesNotExist:
        return Response({"error": "Customer not found"}, status=status.HTTP_404_NOT_FOUND)
    
    additional_addresses = request.data.get('additional_addresses', [])
    additional_address1 = additional_addresses[0].strip() if len(additional_addresses) > 0 else None
    additional_address2 = additional_addresses[1].strip() if len(additional_addresses) > 1 else None

    validated_data = {
        'name': request.data.get('name', customer.name).strip(),
        'delivery_address': request.data.get('delivery_address', customer.delivery_address).strip(),
        'additional_address1': additional_address1,
        'additional_address2': additional_address2,
        'billing_address': request.data.get('billing_address', customer.billing_address).strip(),
        'gstin_number': request.data.get('gstin_number', customer.gstin_number).strip(),
        'credit_limit': request.data.get('credit_limit', customer.credit_limit).strip(),
        'credit_days': request.data.get('credit_days', customer.credit_days).strip(),
        'contact_person': request.data.get('contact_person', customer.contact_person).strip(),
        'contact_number': request.data.get('contact_number', customer.contact_number).strip(),
        'updated_by': '1',  
        'updated_at':timezone.now()

    }

    


    serializer = CustomerSerializer(customer, data=validated_data, partial=True) 

    if serializer.is_valid():
        serializer.save()  
        return Response(serializer.data, status=status.HTTP_200_OK)
    else:
        print(serializer.errors)  
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
