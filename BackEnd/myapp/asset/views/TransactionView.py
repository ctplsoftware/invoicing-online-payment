from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.contrib.auth import authenticate

from asset.models import *
from asset.utils import *


from django.db import transaction
from django.conf import settings

from asset.serializers.OrderheaderSerializer import OrderheaderSerializer
from asset.serializers.OrderAttachementTransactionSerializer import OrderAttachmentTransactionSerializer
from asset.serializers.OrderTransactionSerializer import OrderTransactionSerializer
from asset.serializers.CustomerSerializer import CustomerSerializer

from django.contrib.auth.models import User
import requests
from decimal import Decimal



@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_order_details_all(request):
        orderheader_data = OrderHeader.objects.all().order_by('-id')
        serializer = OrderheaderSerializer(orderheader_data, many=True)
        return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_order_details(request):
    response_data = {}
    try:
        with transaction.atomic():

            order_header_id = request.query_params.get('order_header_id')

            order_header = OrderHeader.objects.filter(id = order_header_id).prefetch_related('attachments', 'transaction').first()
            customer_data = CustomerMaster.objects.filter(id = order_header.customer_master_id).first()


            if order_header:
                # Serialize the order header
                order_header_data = OrderheaderSerializer(order_header).data

                # Serialize the related attachments
                order_attachment_images_data = OrderAttachmentTransactionSerializer(order_header.attachments.all(), many=True).data

                # Serialize the related transactions
                order_transaction_data = OrderTransactionSerializer(order_header.transaction.all(), many=True).data
                location_master = LoactionMaster.objects.filter(status = 'active').values('id', 'name', 'location_address', 'status')

                customer_data_serial = CustomerSerializer(customer_data).data
                response_data = {
                    'order_header': order_header_data,
                    'order_attachment_images': order_attachment_images_data,
                    'order_transaction': order_transaction_data,
                    'customer_data': customer_data_serial,
                    'location_master': location_master
                }


                return Response(response_data)

            else:
                return Response('Order not found.')
            
    
    except Exception as e:
        print(e)
        return Response('error')


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_dispatch_location(request):
    try:
        with transaction.atomic():

            order_header = OrderHeader.objects.filter(id = request.data.get('order_header_id')).first()

            if order_header:
                location_master = LoactionMaster.objects.filter(id = request.data.get('location_master_id')).first()
                if location_master:

                    order_header.location_master_id = location_master.id
                    order_header.location_name = location_master.name
                    order_header.location_address = location_master.location_address

                    order_header.save()

                    return Response('success')

                else:
                    return Response('No location found.')

            else:
                return Response('No order found.')
    
    except Exception as e:
        print(e)
        return Response('error')


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_dispatched_completed(request):
    try:
        with transaction.atomic():

            order_header = OrderHeader.objects.filter(id = request.data.get('order_header_id')).first()

            if order_header:
                
                inward_header = InwardHeader.objects.filter(location_master_id = order_header.location_master_id, part_master_id = order_header.part_master_id).first()
                inward_header.total_quantity -= round(float(order_header.quantity), 2)
                inward_header.save()
                
                part_master = PartMaster.objects.filter(id = order_header.part_master_id).first()

                part_master.allocated_stock -= round(float(order_header.quantity), 2)
                part_master.stock -= round(float(order_header.quantity), 2)


                part_master.save()

                if order_header.payment_type == 'credit':
                    order_header.dispatched_status = 'yes'
                    status = 'yes' if order_header.verified_status == 'yes' and order_header.paid_status == 'yes' else 'no'
                    final_status = 'yes' if status == 'yes' and order_header.invoice_generated_status == 'yes' else 'no'

                    order_header.completed_status = final_status
                    order_header.save()

                elif order_header.payment_type == "advance":
                    if order_header.verified_status == 'yes':
                        final_status = 'yes'  if order_header.invoice_generated_status == 'yes' else 'no'

                        order_header.dispatched_status = 'yes'
                        order_header.completed_status = final_status
                        order_header.save()
                    
                    else:
                        return Response('Please complete the payment for this order!')

            
                return Response('success')
                

            else:
                return Response('Order not found.')
            
    except Exception as e:
        print(e)
        return Response('error')
    pass


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_verified_completed(request):
    try:
        with transaction.atomic():
            order_header = OrderHeader.objects.filter(id = request.data.get('order_header_id')).first()
            customer_master = CustomerMaster.objects.filter(id = order_header.customer_master_id).first()

            if order_header:
                order_transaction = {
                    'order_header_id': order_header.id,
                    'payment_amount': round(float(request.data.get('payment_amount')), 2),
                    'payment_date': request.data.get('payment_date'),
                    'payment_comments': request.data.get('payment_comments'),
                    'created_by': 1,
                    'updated_by': request.data.get('updated_by')
                }   

                OrderTransaction.objects.create(**order_transaction)

                order_header.paid_amount = round(float(order_header.paid_amount), 2) + round(float(request.data.get('payment_amount')), 2)
                
                order_header.verified_status = 'yes' if float(order_header.paid_amount) >= float(order_header.total_amount) else 'no'
                order_header.attached_status = 'yes' if order_header.verified_status == 'yes' else 'partial'

                status = 'yes' if order_header.verified_status == 'yes' and order_header.dispatched_status == 'yes' else 'no'
                completed_status = 'yes' if status == 'yes' and order_header.invoice_generated_status == 'yes' else 'no'

                order_header.completed_status = completed_status

                if order_header.payment_type == 'credit':
                    customer_master.used_limit = round(float(customer_master.used_limit), 2) - round(float(request.data.get('payment_amount')), 2)
                    customer_master.save()

                order_header.save()

                response_data = {
                    'verified_status': order_header.verified_status
                }
                
                return Response(response_data)



            else:
                return Response('Order not found.')
    

    except Exception as e:
        print(e)
        return Response('error')


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_e_invoice(request):

    julian_date = base33()
    current_year = str(datetime.datetime.now().year)[-2:]
    today_count = get_count_requestid(RequestHeader)


    requestid = f"REQUESTID{julian_date}{current_year}{today_count+1:04}"
    document_number = f"DOCNO{julian_date}{today_count+1:04}"

    request_header = {
        'request_id': requestid,
        'purpose': 'generate-irn',
        'order_header_id': request.data.get('order_header_id')
    }
    
    RequestHeader.objects.create(**request_header)

    try:
        with transaction.atomic():

            username = request.data.get('username')
            password = request.data.get('password')

            user = authenticate(username=username, password=password)

            if not user:
                return Response('Invalid Credentials')
            
            else:

                order_header_id = request.data.get('data')['order_header_id']
                order_header = OrderHeader.objects.filter(id = order_header_id).first()


                if order_header.invoice_generated_status == 'yes':
                    return Response('Invoice already generated.')
                
                if order_header.payment_type == 'advance' and order_header.verified_status == 'no':
                    return Response('Please complete payment for this order.')
                
                customer_master = CustomerMaster.objects.filter(id = order_header.customer_master_id).first()
                part_master = PartMaster.objects.filter(id = order_header.part_master_id).first()

                today_date = datetime.datetime.today().strftime("%d/%m/%Y")
                
                order_header.delivery_note = request.data.get('data')['delivery_note']
                order_header.other_references = request.data.get('data')['other_references']
                order_header.buyer_order_number = request.data.get('data')['buyer_order_number']
                order_header.buyer_order_date = request.data.get('data')['buyer_order_date']

                order_header.delivery_note_date = request.data.get('data')['delivery_note_date']
                order_header.dispatch_document_number = request.data.get('data')['dispatch_document_number']
                order_header.dispatched_through = request.data.get('data')['dispatched_through']
                order_header.terms_of_delivery = request.data.get('data')['terms_of_delivery']
                order_header.delivery_note_date = request.data.get('data')['delivery_note_date']

                order_header.save()

                

                client_id = settings.CLIENT_ID
                client_secret = settings.CLIENT_SECRET

                user_name = settings.USERNAME
                password = settings.PASSWORD
                gstin = settings.GSTIN
                legal_name = settings.LEGAL_NAME
                trade_name = settings.TRADE_NAME
                address = settings.COMPANY_ADDRESS
                location = settings.LOCATION
                pin_code = settings.PIN_CODE
                state_code = settings.STATE_CODE
                phone_number = settings.PHONE_NUMBER
                email_id = settings.EMAIL_ID

                


                # Generate access_token

                authentication_url = settings.AUTHENTICATION_URL
                authentication_headers = {
                    'Content-Type': 'application/json',
                    'gspappid': client_id,
                    'gspappsecret': client_secret
                }

                authentication_response_object = requests.post(authentication_url, headers = authentication_headers)
                authentication_response = authentication_response_object.json()



                access_token = authentication_response['access_token']


                # Generate IRN

                generate_irn_url = settings.GENERATE_IRN_URL

                generate_irn_headers = {
                    'Content-Type': 'application/json',
                    'Authorization': f"Bearer {str(access_token)}",
                    'user_name': user_name,
                    'password': password,
                    'gstin': gstin,
                    'requestid': requestid
                }

                # Inter state supplu will be available.
                # Only B2B supply.
                # GST is only 18% SGST - 9% and CGST - 9%.
                # 


                # Mandatory
                
                TranDtls = {
                    "TaxSch": "GST",
                    "SupTyp": "B2B",
                    "RegRev": "Y",
                    "EcmGstin": None,
                    "IgstOnIntra": "N"
                }

                # Mandatory
                DocDtls = {
                    "Typ": "INV",
                    "No": str(document_number),
                    "Dt": today_date
                }

                # Mandatory
                SellerDtls = {
                    "Gstin": str(gstin),
                    "LglNm": str(legal_name),
                    "TrdNm": str(trade_name),
                    "Addr1": str(address),
                    "Addr2": str(address),
                    "Loc": str(location),
                    "Pin": '172001',
                    "Stcd": f"{str(gstin)[0]}{str(gstin)[1]}",
                    "Ph": str(phone_number),
                    "Em": str(email_id)
                }

                # Mandatory
                BuyerDtls = {
                    "Gstin": customer_master.gstin_number,
                    # Legal Name
                    "LglNm": customer_master.LegalName,
                    "TrdNm": customer_master.TradeName,
                    # Point of sales (state code) company's state code. (seller)
                    "Pos": "12",
                    "Addr1": customer_master.billing_address,
                    "Addr2": customer_master.billing_address,
                    # Location (city)
                    "Loc": order_header.delivery_address_city,
                    "Pin": 500055,
                    # State code -- first two digits of the gstin
                    "Stcd": f"{str(customer_master.gstin_number)[0]}{str(customer_master.gstin_number[1])}",
                }

                # Mandatory
                ItemList = [

                    {

                        "SlNo": "1", 
                        "PrdDesc": part_master.part_description,
                        "IsServc": "N",
                        "HsnCd": part_master.hsn_code,
                        "Qty": str(order_header.quantity),
                        "Unit": part_master.uom,
                        "UnitPrice": part_master.unit_price,
                        "TotAmt": order_header.amount_for_quantity,
                        "AssAmt": order_header.amount_for_quantity,
                        "Discount": 0,
                        "GstRt": 18,
                        "IgstAmt": order_header.igst_amount,
                        "CgstAmt": order_header.cgst_amount,
                        "SgstAmt": order_header.sgst_amount,
                        "TotItemVal": order_header.total_amount,
                    }
                ]

                # Mandatory
                ValDtls = {
                    # Bill value - subtotal without gst
                    "AssVal": order_header.amount_for_quantity,
                    "CgstVal": order_header.cgst_amount,
                    "SgstVal": order_header.sgst_amount,
                    # IGST is required for inter state supply.
                    "IgstVal": order_header.igst_amount,
                    "Discount": 0,
                    # Not needed
                    "TotInvVal": order_header.total_amount
                }
                
                generate_irn_request_body = {
                    "Version": "1.1",
                    "TranDtls": TranDtls,
                    "DocDtls": DocDtls,
                    "SellerDtls": SellerDtls,
                    "BuyerDtls": BuyerDtls,
                    "ItemList": ItemList,
                    "ValDtls": ValDtls,
                }



                
                generate_irn_response_object = requests.post(generate_irn_url, json = generate_irn_request_body, headers = generate_irn_headers)

                generate_irn_response = generate_irn_response_object.json()['result']



                e_invoice_header = {
                    'request_id': requestid,
                    'AckNo': generate_irn_response['AckNo'],
                    'AckDt': generate_irn_response['AckDt'],
                    'Irn': generate_irn_response['Irn'],
                    'SignedInvoice': generate_irn_response['SignedInvoice'],
                    'SignedQRCode': generate_irn_response['SignedQRCode'],
                    'Status': generate_irn_response['Status'],
                    'EwbNo': generate_irn_response['EwbNo'],
                    'EwbDt': generate_irn_response['EwbDt'],
                    'EwbValidTill': generate_irn_response['EwbValidTill'],
                    'Remarks': generate_irn_response['Remarks'],
                    'order_header_id': order_header_id
                }


                header = EInvoiceHeader.objects.create(**e_invoice_header)

                ItemList_dict = {item['SlNo']: item for item in ItemList}

                

                e_invoice_transaction = {
                    "e_invoice_header_id": header.id,
                    "Version": "1.1",
                    "TranDtls": TranDtls,
                    "DocDtls": DocDtls,
                    "SellerDtls": SellerDtls,
                    "BuyerDtls": BuyerDtls,
                    "ItemList": ItemList_dict,
                    "ValDtls": ValDtls
                }

                EInvoiceTransaction.objects.create(**e_invoice_transaction)

                order_header.invoice_generated_status = 'yes'
                order_header.irn_invoice_number = header.Irn
                order_header.save()

                return Response('success')

    

    except Exception as e:
        print(e)
        return Response('error')


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def cancel_e_invoice(request):

    julian_date = base33()
    current_year = str(datetime.datetime.now().year)[-2:]
    today_count = get_count_requestid(RequestHeader)

    requestid = f"REQUESTID{julian_date}{current_year}{today_count+1:04}"
    request_header = {
            'request_id': requestid,
            'purpose': 'cancel-irn'
    }

    RequestHeader.objects.create(**request_header)


    try:
        with transaction.atomic():

            username = request.data.get('username')
            password = request.data.get('password')

            user = authenticate(username=username, password=password)

            if not user:
                return Response('Invalid Credentials')

            else:
                # Generate Access Token

                irn = request.data.get('irn')
                order_header = OrderHeader.objects.filter(id = request.data.get('order_header_id')).first()

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


                # Cancel E-Invoice

                cancel_irn_url = settings.CANCEL_IRN_URL
                cancel_irn_headers = {
                    'Content-Type': 'application/json',
                    'Authorization': f"Bearer {str(access_token)}",
                    'user_name': user_name,
                    'password': password,
                    'gstin': gstin,
                    'requestid': requestid
                }

                cancel_irn_request_body = {
                    'irn': irn,
                    'cnlrsn': '1',
                    'cnlrem': 'Wrong Entry'
                }



                cancel_irn_response_object = requests.post(cancel_irn_url, json = cancel_irn_request_body, headers = cancel_irn_headers)
                cancel_irn_response = cancel_irn_response_object.json()['message']


                if cancel_irn_response == 'E-Invoice is cancelled successfully':
                    

                    order_header.status = 'invalid'
                    order_header.completed_status = 'invalid'

                    part_master = PartMaster.objects.filter(id = order_header.part_master_id).first()
                    customer_master = CustomerMaster.objects.filter(id = order_header.customer_master_id).first()

                    part_master.allocated_stock = float(part_master.allocated_stock) - float(order_header.quantity)

                    if order_header.verified_status == 'no':
                        remaining_used_limit = float(order_header.total_amount) - float(order_header.paid_amount)
                        customer_master.used_limit = customer_master.used_limit - Decimal(remaining_used_limit)
                        customer_master.save()

                    part_master.save()
                    order_header.save()

                    e_invoice_header = EInvoiceHeader.objects.filter(Irn = irn).first()
                    e_invoice_header.einvoice_status = 'invalid'
                    e_invoice_header.save()

                


                    OrderTransaction.objects.filter(order_header_id = order_header.id).update(status = 'invalid')
                    OrderAttachmentTransaction.objects.filter(order_header_id = order_header.id).update(status = 'invalid')
                    EInvoiceTransaction.objects.filter(e_invoice_header_id = e_invoice_header.id).update(status = 'invalid')

                    return Response('success')
                
                else:
                    return Response('error')


    except Exception as e:
        print(e)
        return Response('error')
    

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def cancel_order(request):
    julian_date = base33()
    current_year = str(datetime.datetime.now().year)[-2:]
    today_count = get_count_requestid(RequestHeader)

    requestid = f"REQUESTID{julian_date}{current_year}{today_count+1:04}"
    request_header = {
            'request_id': requestid,
            'purpose': 'cancel-irn'
    }

    RequestHeader.objects.create(**request_header)



    try:
        with transaction.atomic():

            username = request.data.get('username')
            password = request.data.get('password')

            user = authenticate(username=username, password=password)

            if not user:
                return Response('Invalid Credentials')

            order_header = OrderHeader.objects.filter(id = request.data.get('order_header_id')).first()
            
            if order_header:

                customer_master = CustomerMaster.objects.filter(id = order_header.customer_master_id).first()
                part_master = PartMaster.objects.filter(id = order_header.part_master_id).first()

                order_header.completed_status = 'cancelled'
                irn = order_header.irn_invoice_number

                e_invoice_header = EInvoiceHeader.objects.filter(order_header_id = order_header.id).first()


                if e_invoice_header:

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


                    # Cancel E-Invoice

                    cancel_irn_url = settings.CANCEL_IRN_URL
                    cancel_irn_headers = {
                        'Content-Type': 'application/json',
                        'Authorization': f"Bearer {str(access_token)}",
                        'user_name': user_name,
                        'password': password,
                        'gstin': gstin,
                        'requestid': requestid
                    }

                    cancel_irn_request_body = {
                        'irn': irn,
                        'cnlrsn': '1',
                        'cnlrem': 'Wrong Entry'
                    }



                    cancel_irn_response_object = requests.post(cancel_irn_url, json = cancel_irn_request_body, headers = cancel_irn_headers)
                    cancel_irn_response = cancel_irn_response_object.json()['message']

                    print(cancel_irn_response)


                    e_invoice_header.einvoice_status = 'cancelled'
                    e_invoice_transaction = EInvoiceTransaction.objects.filter(e_invoice_header_id = e_invoice_header.id).first()
                    e_invoice_transaction.status = 'cancelled'

                    e_invoice_header.save()
                    e_invoice_transaction.save()
                
                
                if order_header.dispatched_status == 'yes':
                    
                    inward_header = InwardHeader.objects.filter(location_master_id = order_header.location_master_id).first()
                    part_master.stock += round(float(order_header.quantity), 2)
                    inward_header.total_quantity += round(float(order_header.quantity), 2)
                    inward_header.save()

                
                else:
                    part_master.allocated_stock -= round(float(order_header.quantity), 2)

                if order_header.payment_type == 'credit':
                    customer_master.used_limit -= round(float(order_header.total_amount), 2)



                
                order_header.save()
                customer_master.save()
                part_master.save()

                return Response('success')


            else:
                return Response('No order found.')
    
    except Exception as e:
        print(e)
        return Response('error')
    

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_einvoice_list(request):
    try:
        with transaction.atomic():
            order_header = OrderHeader.objects.filter(invoice_generated_status = 'no', completed_status = 'no').values('id', 'order_number', 'customer_name', 'payment_type', 'part_name', 'unit_price', 'quantity', 'total_amount', 'attached_status', 'verified_status', 'invoice_generated_status', 'dispatched_status', 'completed_status', 'ordered_at', 'ordered_by').order_by('-id')

            for order in order_header:
                order['ordered_by'] = User.objects.filter(id = order['ordered_by']).values_list('username', flat = True)

            return Response(order_header)
    
    except Exception as e:
        print(e)
        return Response('error')