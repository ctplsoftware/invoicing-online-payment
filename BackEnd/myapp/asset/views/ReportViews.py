from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes

from asset.models import *

from django.db import transaction
from django.contrib.auth.models import User
from django.db.models import Q


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_order_list(request):
    try:
        with transaction.atomic():
            response_data = OrderHeader.objects.values('id', 'order_number', 'payment_type', 'customer_name', 'part_name', 'unit_price', 'quantity', 'total_amount', 'location_name', 'delivery_address', 'ordered_by', 'ordered_at', 'completed_status').filter(Q(completed_status="no") | Q(completed_status="yes")).order_by('-id')
            for data in response_data:
                data['ordered_by'] = User.objects.filter(id = data['ordered_by']).values_list('username', flat = True)
            
            return Response(response_data)
    except Exception as e:
        print(e)
        return Response('error')
    

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_einvoice_order_list(request):
    try:
        with transaction.atomic():
            response_data = EInvoiceHeader.objects.values('order_header_id', 'order_header_id__order_number', 'Irn', 'AckDt', 'order_header_id__customer_master_id__gstin_number', 'order_header_id__customer_name', 'order_header_id__amount_for_quantity', 'order_header_id__cgst_amount', 'order_header_id__sgst_amount', 'order_header_id__igst_amount', 'order_header_id__total_amount', 'order_header_id__delivery_address', 'einvoice_status', 'order_header_id__completed_status').order_by('-id')
            return Response(response_data)
    
    except Exception as e:
        print(e)
        return Response('error')

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_order_list_filtered(request):
    try:
        with transaction.atomic():
            start_date = request.query_params.get('start_date')
            end_date = request.query_params.get('end_date')

            print(start_date, end_date)


    
    except Exception as e:
        print(e)
        return Response('error')