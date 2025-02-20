from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes

from asset.models import *

from django.db import transaction
from django.contrib.auth.models import User
from django.db.models import Q
from django.conf import settings
from num2words import num2words


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
    

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_einvoice_details(request):
    response_data = {}

    try:
        with transaction.atomic():
            order_header = OrderHeader.objects.filter(id = request.query_params.get('order_header_id')).first()
            
            if order_header.irn_invoice_number == None or order_header.irn_invoice_number == '' or order_header.completed_status == 'cancelled':
                response_data = {
                    'data': None,
                    'message': 'E-Invoice not yet generated/cancelled for this order.',
                    'success': False
                }
                return Response(response_data)

            else:
                e_invoice_header = EInvoiceHeader.objects.filter(order_header_id = order_header.id).first()
                customer_master = CustomerMaster.objects.filter(id = order_header.customer_master_id).first()


                formatted_date = e_invoice_header.AckDt.strftime("%d-%b-%Y")
                words = num2words(order_header.total_amount, lang='en')

                data = {
                    'ack_no': e_invoice_header.AckNo,
                    'irn_no': e_invoice_header.Irn,
                    'ack_date': formatted_date,

                    'vendor_company_name': settings.COMPANY_NAME,
                    'vendor_company_address': settings.COMPANY_ADDRESS,
                    'vendor_company_phone_number': settings.PHONE_NUMBER,
                    'vendor_company_pan': settings.PAN,
                    'vendor_company_gstin': settings.GSTIN,
                    'vendor_state_name': settings.STATE_NAME,
                    'vendor_state_code': settings.STATE_CODE,
                    'vendor_company_email': settings.EMAIL_ID,
                    'vendor_company_bank_name': settings.BANK_NAME,
                    'vendor_company_bank_account': settings.BANK_ACCOUNT_NUMBER,
                    'vendor_company_bank_branch': f"{settings.BRANCH_NAME} & {settings.IFSC_CODE}",

                    'buyer_company_name': customer_master.name,
                    'buyer_company_address': order_header.delivery_address,
                    'buyer_company_gstin': customer_master.gstin_number,
                    'buyer_state_name': order_header.delivery_address_state,
                    'buyer_state_code': order_header.customer_master.StateCode,

                    'invoice_no': order_header.order_number,
                    'delivery_note': order_header.delivery_note,
                    'mode_of_payment': order_header.payment_type,
                    'reference_number': f"{order_header.order_number} dt. {formatted_date}",
                    'other_references': order_header.other_references,
                    'buyer_order_number': order_header.buyer_order_number,
                    'buyer_order_date': order_header.buyer_order_date,
                    'dispatch_doc_no': order_header.dispatch_document_number,
                    'delivery_note_date': order_header.delivery_note_date,
                    'dispatched_through': order_header.dispatched_through,
                    'terms_of_delivery': order_header.terms_of_delivery,
                    'description_of_goods': order_header.part_master.part_description,
                    'hsn_code': order_header.part_master.hsn_code,
                    'quantity': f"{order_header.quantity} {order_header.part_master.uom}",
                    'rate': order_header.part_master.unit_price,
                    'per': order_header.part_master.uom,
                    'amount_for_quantity': order_header.amount_for_quantity,

                    'sgst_per': order_header.sgst_percentage,
                    'sgst_amount': order_header.sgst_amount,
                    'cgst_per': order_header.cgst_percentage,
                    'cgst_amount': order_header.cgst_amount,
                    'igst_per': order_header.igst_percentage,
                    'igst_amount': order_header.igst_amount,

                    'total_amount': order_header.total_amount,
                    'amount_in_words': words.title(),
                    'total_tax_amount': order_header.total_tax_amount,

                    'qr_code_data': e_invoice_header.SignedQRCode,

                }


                return Response(data)


    
    except Exception as e:
        print(e)
        return Response('error')
    

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_customer_list(request):
    try:
        with transaction.atomic():
            
            customer_master = CustomerMaster.objects.values('id', 'name', 'gstin_number', 'credit_limit', 'used_limit', 'credit_days', 'contact_person', 'contact_number')
            return Response(customer_master)
    
    except Exception as e:
        print(e)
        return Response('error')
    
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_customer(request):
    try:
        with transaction.atomic():
            
            customer_master = OrderHeader.objects.filter(customer_master_id = request.query_params.get('customer_master_id'), payment_type = 'credit').values('id', 'order_number', 'payment_type', 'part_name', 'quantity', 'unit_price', 'total_amount')

            return Response(customer_master)




    
    except Exception as e:
        print(e)
        return Response('error')