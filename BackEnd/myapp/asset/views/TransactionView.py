from rest_framework.decorators import api_view
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
def get_order_details_all(request):
        orderheader_data = OrderHeader.objects.all().order_by('-id')
        serializer = OrderheaderSerializer(orderheader_data, many=True)
        return Response(serializer.data)


@api_view(['GET'])
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

                print(response_data)

                return Response(response_data)

            else:
                return Response('Order not found.')
            
    
    except Exception as e:
        print(e)
        return Response('error')


@api_view(['PUT'])
def update_dispatch_location(request):
    try:
        with transaction.atomic():

            order_header = OrderHeader.objects.filter(id = request.data.get('order_header_id')).first()

            if order_header:
                order_header.location_master_id = request.data.get('location_master_id')
                order_header.location_name = request.data.get('location_name')
                order_header.location_address = request.data.get('location_address')

                order_header.save()

            else:
                return Response('No order found.')
    
    except Exception as e:
        print(e)
        return Response('error')


@api_view(['PUT'])
def update_dispatched_completed(request):
    try:
        with transaction.atomic():

            order_header = OrderHeader.objects.filter(id = request.data.get('order_header_id')).first()

            if order_header:
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
                
                return Response('success')



            else:
                return Response('Order not found.')
    

    except Exception as e:
        print(e)
        return Response('error')


@api_view(['POST'])
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


                order_header_id = request.data.get('order_header_id')

                order_header = OrderHeader.objects.filter(id = order_header_id).first()


                order_header.delivery_note = request.data.get('delivery_note')
                order_header.other_references = request.data.get('other_references')
                order_header.buyer_order_number = request.data.get('buyer_order_number')
                order_header.buyer_order_date = request.data.get('buyer_order_date')

                order_header.delivery_note_date = request.data.get('delivery_note_date')
                order_header.dispatch_document_number = request.data.get('dispatch_document_number')
                order_header.dispatched_through = request.data.get('dispatched_through')
                order_header.terms_of_delivery = request.data.get('terms_of_delivery')
                order_header.delivery_note_date = request.data.get('delivery_note_date')

                order_header.save()

                

                client_id = settings.CLIENT_ID
                client_secret = settings.CLIENT_SECRET

                user_name = settings.USERNAME
                password = settings.PASSWORD
                gstin = settings.GSTIN

                


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
                    "Dt": "18/03/2023"
                }

                # Mandatory
                SellerDtls = {
                    "Gstin": str(gstin),
                    "LglNm": "NIC company pvt ltd",
                    "TrdNm": "NIC Industries",
                    "Addr1": "5th block, kuvempu layout",
                    "Addr2": "kuvempu layout",
                    "Loc": "GANDHINAGAR",
                    "Pin": 172001,
                    "Stcd": "02",
                    "Ph": "9000000000",
                    "Em": "abc@gmail.com"
                }

                # Mandatory
                BuyerDtls = {
                    "Gstin": "36AAGCT1587Q1ZJ",
                    # Legal Name
                    "LglNm": "XYZ company pvt ltd",
                    "TrdNm": "XYZ Industries",
                    # Point of sales (state code) company's state code.
                    "Pos": "12",
                    "Addr1": "7th block, kuvempu layout",
                    "Addr2": "kuvempu layout",
                    # Location (city)
                    "Loc": "GANDHINAGAR",
                    "Pin": 500055,
                    # State code -- first two digits of the gstin
                    "Stcd": "36",
                    "Ph": "91111111111",
                    "Em": "xyz@yahoo.com"
                }

                # Mandatory
                ItemList = [

                    {

                        "SlNo": "1", 
                        "PrdDesc": "Rice",
                        "IsServc": "N",
                        "HsnCd": "30049099",
                        "Barcde": "123456",
                        "Qty": 100.345,
                        "FreeQty": 10,
                        "Unit": "BAG",
                        "UnitPrice": 99.545,
                        "TotAmt": 9988.84,
                        "Discount": 10,
                        "PreTaxVal": 1,
                        "AssAmt": 9978.84,
                        "GstRt": 12,
                        "IgstAmt": 1197.46,
                        "CgstAmt": 0,
                        "SgstAmt": 0,
                        "CesRt": 5,
                        "CesAmt": 498.94,
                        "CesNonAdvlAmt": 10,
                        "StateCesRt": 12,
                        "StateCesAmt": 1197.46,
                        "StateCesNonAdvlAmt": 5,
                        "OthChrg": 10,
                        "TotItemVal": 12897.7,
                        "OrdLineRef": "3256",
                        "OrgCntry": "AG",
                        "PrdSlNo": "12345",

                        # Conditionally Mandatory

                        "BchDtls": {
                            "Nm": "123456",
                            "Expdt": "01/08/2020",
                            "wrDt": "01/09/2020"
                        },

                        # Optional

                        "AttribDtls": [
                            {
                            "Nm": "Rice",
                            "Val": "10000"
                            }
                        ]
                    }
                ]

                # Mandatory
                ValDtls = {
                    # Bill value - subtotal without gst
                    "AssVal": 9978.84,
                    "CgstVal": 0,
                    "SgstVal": 0,
                    # IGST is required for inter state supply.
                    "IgstVal": 1197.46,
                    # Not needed
                    "CesVal": 508.94,
                    "StCesVal": 1202.46,
                    "Discount": 10,
                    "OthChrg": 20,
                    "RndOffAmt": 0.3,
                    "TotInvVal": 12908
                }

                # Optional
                PayDtls = {
                    "Nm": "ABCDE",
                    "Accdet": "5697389713210",
                    "Mode": "Cash",
                    "Fininsbr": "SBIN11000",
                    "Payterm": "100",
                    "Payinstr": "Gift",
                    "Crtrn": "test",
                    "Dirdr": "test",
                    "Crday": 100,
                    "Paidamt": 10000,
                    "Paymtdue": 5000
                }

                # Conditionally Mandatory
                RefDtls = {
                    "InvRm": "TEST",

                    "DocPerdDtls": {
                    "InvStDt": "01/08/2020",
                    "InvEndDt": "01/09/2020"
                    },

                    "PrecDocDtls": [
                        {
                            "InvNo": "DOC/002",
                            "InvDt": "01/08/2020",
                            "OthRefNo": "123456"
                        }

                    ],

                    "ContrDtls": [
                        {

                            "RecAdvRefr": "Doc/003",
                            "RecAdvDt": "01/08/2020",
                            "Tendrefr": "Abc001",
                            "Contrrefr": "Co123",
                            "Extrefr": "Yo456",
                            "Projrefr": "Doc-456",
                            "Porefr": "Doc-789",
                            "PoRefDt": "01/08/2020"

                        }
                    ]

                }

                # Optional
                AddlDocDtls = [
                    {
                        "Url": "https://einv-apisandbox.nic.in",
                        "Docs": "Test Doc",
                        "Info": "Document Test"
                    }
                ]
                
                # Optional
                ExpDtls = {

                    "ShipBNo": "A-248",
                    "ShipBDt": "01/08/2020",
                    "Port": "INABG1",
                    "RefClm": "N",
                    "ForCur": "AED",
                    "CntCode": "AE",
                    "ExpDuty": None
                }

                # Above 50K amount e way bill details to be generated compulsory.
                # Conditionally Mandatory
                EwbDtls = {

                    "Transid": "37AMBPG7773M002",
                    "Transname": "XYZ EXPORTS",
                    "Distance": 2502,
                    "Transdocno": None,
                    "TransdocDt": None,
                    "Vehno": "ka123456",
                    "Vehtype": "R",
                    "TransMode": "1"
                }
                
                
                generate_irn_request_body = {
                    "Version": "1.1",
                    "TranDtls": TranDtls,
                    "DocDtls": DocDtls,
                    "SellerDtls": SellerDtls,
                    "BuyerDtls": BuyerDtls,
                    "ItemList": ItemList,
                    "ValDtls": ValDtls,
                    "PayDtls": PayDtls,
                    "RefDtls": RefDtls,
                    "AddlDocDtls": AddlDocDtls,
                    "ExpDtls": ExpDtls,
                    "EwbDtls": EwbDtls,
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
                AddlDocDtls_dict = {item['Info']: item for item in AddlDocDtls}

                

                e_invoice_transaction = {
                    "e_invoice_header_id": header.id,
                    "Version": "1.1",
                    "TranDtls": TranDtls,
                    "DocDtls": DocDtls,
                    "SellerDtls": SellerDtls,
                    "BuyerDtls": BuyerDtls,
                    "ItemList": ItemList_dict,
                    "ValDtls": ValDtls,
                    "PayDtls": PayDtls,
                    "RefDtls": RefDtls,
                    "AddlDocDtls": AddlDocDtls_dict,
                    "ExpDtls": ExpDtls,
                    "EwbDtls": EwbDtls,
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
def cancel_order(request):

    try:
        with transaction.atomic():
            order_header = OrderHeader.objects.filter(id = request.data.get('order_header_id')).first()
            


            if order_header:

                inward_transaction = InwardTransaction.objects.filter(locationmaster_id = order_header.location_master_id).first()
                customer_master = CustomerMaster.objects.filter(id = order_header.customer_master_id).first()
                part_master = PartMaster.objects.filter(id = order_header.part_master_id).first()

                order_header.completed_status = 'cancelled'

                e_invoice_header = EInvoiceHeader.objects.filter(order_header_id = order_header.id).first()

                if e_invoice_header:

                    e_invoice_header.einvoice_status = 'cancelled'
                    e_invoice_transaction = EInvoiceTransaction.objects.filter(e_invoice_header_id = e_invoice_header.id).first()
                    e_invoice_transaction.status = 'cancelled'

                    e_invoice_header.save()
                    e_invoice_transaction.save()

                    response = cancel_e_invoice(request)

                    if response == 'success':
                        print('done')

                

                part_master.allocated_stock = round(float(part_master.allocated_stock), 2) - round(float(order_header.quantity), 2)
                customer_master.used_limit = round(float(customer_master.used_limit), 2) -  round(float(order_header.total_amount), 2) 
                inward_transaction.inward_quantity = round(float(inward_transaction.inward_quantity), 2) + round(float(order_header.quantity), 2)


                
                order_header.save()
                inward_transaction.save()
                customer_master.save()
                part_master.save()


            else:
                return Response('No order found.')
    
    except Exception as e:
        print(e)
        return Response('error')
    

@api_view(['GET'])
def get_einvoice_list(request):
    try:
        with transaction.atomic():
            order_header = OrderHeader.objects.filter(invoice_generated_status = 'no', completed_status = 'no').values('id', 'order_number', 'customer_name', 'payment_type', 'part_name', 'unit_price', 'quantity', 'total_amount', 'attached_status', 'verified_status', 'invoice_generated_status', 'dispatched_status', 'completed_status', 'ordered_at', 'ordered_by')

            for order in order_header:
                order['ordered_by'] = User.objects.filter(id = order['ordered_by']).values_list('username', flat = True)

            return Response(order_header)
    
    except Exception as e:
        print(e)
        return Response('error')