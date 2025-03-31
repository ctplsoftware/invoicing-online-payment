from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from ..models.CustomerMasterModel import CustomerMaster
from ..serializers.CustomerSerializer import CustomerSerializer
from django.utils import timezone
from django.conf import settings

from asset.models import *

from asset.utils import *
import requests



@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_customer(request):

    julian_date = base33()
    current_year = str(datetime.datetime.now().year)[-2:]
    today_count = get_count_requestid(RequestHeader)

    requestid = f"REQUESTID{julian_date}{current_year}{today_count+1:04}"

    request_header = {
        'request_id': requestid,
        'purpose': 'get-taxpayer-details'
    }

    RequestHeader.objects.create(**request_header)


    client_id = settings.CLIENT_ID
    client_secret = settings.CLIENT_SECRET

    user_name = settings.USERNAME
    password = settings.PASSWORD
    gstin = settings.GSTIN

    authentication_url = settings.AUTHENTICATION_URL
    authentication_headers = {
        'Content-Type': 'application/json',
        'gspappid': client_id,
        'gspappsecret': client_secret
    }

    authentication_response_object = requests.post(authentication_url, headers = authentication_headers)
    authentication_response = authentication_response_object.json()



    access_token = authentication_response['access_token']


    get_taxpayer_details_url = settings.TAXPAYER_DETAILS_URL
    get_taxpayer_details_headers = {
        'Content-Type': 'application/json',
        'Authorization': f"Bearer {str(access_token)}",
        'user_name': user_name,
        'password': password,
        'gstin': gstin,
        'requestid': requestid
    }

    get_taxpayer_details_params = {
        'gstin': request.data.get('gstin_number')
    }

    

    get_taxpayer_details_response_object = requests.get(get_taxpayer_details_url, headers = get_taxpayer_details_headers, params = get_taxpayer_details_params)
    get_taxpayer_details_response = get_taxpayer_details_response_object.json()['result']


    validated_data = {
        key: value for key, value in {
            'name': request.data.get('name', '').strip(),
            'gstin_number': request.data.get('gstin_number', '').strip(),

            'credit_limit': request.data.get('credit_limit', '').strip(),
            'credit_days': request.data.get('credit_days', '').strip(),

            'contact_person': request.data.get('contact_person', '').strip(),
            'contact_number': request.data.get('contact_number', '').strip(),

            'billing_address': request.data.get('billing_address', '').strip(),
            'billing_address_city': request.data.get('billing_address_city', '').strip(),
            'billing_address_state': request.data.get('billing_address_state', '').strip(),
            'billing_address_state_code': request.data.get('billing_address_state_code', '').strip(),
            
            'delivery_address': request.data.get('delivery_address', '').strip(),
            'delivery_address_city': request.data.get('delivery_address_city', '').strip(),
            'delivery_address_state': request.data.get('delivery_address_state', '').strip(),
            'delivery_address_state_code': request.data.get('delivery_address_state_code', '').strip(),
            
            'additional_address1': request.data.get('additional_address1', '').strip(),
            'additional_address1_city': request.data.get('additional_address1_city', '').strip(),
            'additional_address1_state': request.data.get('additional_address1_state', '').strip(),
            'additional_address1_state_code': request.data.get('additional_address1_state_code', '').strip(),

            'additional_address2': request.data.get('additional_address2', '').strip(),
            'additional_address2_city': request.data.get('additional_address2_city', '').strip(),
            'additional_address2_state': request.data.get('additional_address2_state', '').strip(),
            'additional_address2_state_code': request.data.get('additional_address2_pin_code', '').strip(),
            'TradeName': get_taxpayer_details_response['TradeName'],
            'LegalName': get_taxpayer_details_response['LegalName'],
            'AddrBnm': get_taxpayer_details_response['AddrBnm'],
            'AddrFlno': get_taxpayer_details_response['AddrFlno'],
            'AddrSt': get_taxpayer_details_response['AddrSt'],
            'AddrBno': get_taxpayer_details_response['AddrBno'],
            'AddrLoc': get_taxpayer_details_response['AddrLoc'],
            'StateCode': get_taxpayer_details_response['StateCode'],
            'AddrPncd': get_taxpayer_details_response['AddrPncd'],
            'TaxType': get_taxpayer_details_response['TxpType'],
            'CustomerStatus': get_taxpayer_details_response['Status'],
            'BlkStatus': get_taxpayer_details_response['BlkStatus'],
             
            'status': 'active',  
            'created_by': request.data.get('user_id'),
        }.items() if value  
    }

    serializer = CustomerSerializer(data=validated_data)
    
    if serializer.is_valid():
        serializer.save()  # Save the validated data
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    else:
        print(serializer.errors)  # Log errors for debugging
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

@api_view(['GET'])
@permission_classes([IsAuthenticated])
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
@permission_classes([IsAuthenticated])
def get_customer_editdata(request, id):
    try:
        customer = CustomerMaster.objects.get(id=id)
        serializer = CustomerSerializer(customer)
        return Response(serializer.data)
    except CustomerMaster.DoesNotExist:
        return Response({"error": "Customer not found"}, status=404)


@api_view(['PUT'])  
@permission_classes([IsAuthenticated])
def update_customer(request, id):
    try:
        customer = CustomerMaster.objects.get(id=id)
    except CustomerMaster.DoesNotExist:
        return Response({"error": "Customer not found"}, status=status.HTTP_404_NOT_FOUND)
    
    
    
    validated_data = {
        key: value for key, value in {
            'name': request.data.get('name', '').strip(),
            'gstin_number': request.data.get('gstin_number', '').strip(),

            'credit_limit': request.data.get('credit_limit', '') if request.data.get('credit_limit', '') else 0,
            'credit_days': request.data.get('credit_days', '').strip(),

            'contact_person': request.data.get('contact_person', '').strip(),
            'contact_number': request.data.get('contact_number', '').strip(),

            'billing_address': request.data.get('billing_address', '').strip(),
            'billing_address_city': request.data.get('billing_address_city', '').strip(),
            'billing_address_state': request.data.get('billing_address_state', '').strip(),
            'billing_address_state_code': request.data.get('billing_address_state_code', '').strip(),
            
            'delivery_address': request.data.get('delivery_address', '').strip(),
            'delivery_address_city': request.data.get('delivery_address_city', '').strip(),
            'delivery_address_state': request.data.get('delivery_address_state', '').strip(),
            'delivery_address_state_code': request.data.get('delivery_address_state_code', '').strip(),
            
            
            'additional_address1': request.data.get('additional_address1', '').strip() if request.data.get('additional_address1') != None  else None,
            'additional_address1_city': request.data.get('additional_address1_city', '').strip() if request.data.get('additional_address1_city') != None  else None,
            'additional_address1_state': request.data.get('additional_address1_state', '').strip() if request.data.get('additional_address1_state') != None  else None,
            'additional_address1_state_code': request.data.get('additional_address1_state_code', '').strip() if request.data.get('additional_address1_state_code') != None  else None,

            'additional_address2': request.data.get('additional_address2', '').strip() if request.data.get('additional_address2') != None  else None,
            'additional_address2_city': request.data.get('additional_address2_city', '').strip() if request.data.get('additional_address2_city') != None  else None,
            'additional_address2_state': request.data.get('additional_address2_state', '').strip() if request.data.get('additional_address2_state') != None  else None,
            'additional_address2_state_code': request.data.get('additional_address2_state_code', '').strip() if request.data.get('additional_address2_state_code') != None  else None,
            
            
            'status': 'active',  
            'created_by': request.data.get('user_id'),
        }.items() if value  
    }




    serializer = CustomerSerializer(customer, data=validated_data, partial=True) 

    if serializer.is_valid():
        serializer.save()  
        return Response(serializer.data, status=status.HTTP_200_OK)
    else:
        print(serializer.errors)  
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
