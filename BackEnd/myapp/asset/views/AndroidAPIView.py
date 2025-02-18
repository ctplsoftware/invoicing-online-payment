from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.db import transaction
from django.db.models import F
from asset.models import *
from asset.utils import *
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.models import User, Group, Permission
from rest_framework.response import Response
from django.contrib.auth import authenticate, login as auth_login
from ..serializers.UserSerializer import UserSerializer, UserRolePermissionSerializer, GroupSerializer, PermissionSerializer
from rest_framework import status
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from datetime import timedelta
from datetime import datetime
from django.conf import settings
from num2words import num2words



@api_view(['POST'])
def android_login(request):
    try:
        response_data = {}
        # Get username and password from the request body
        username = request.data.get('username')
        password = request.data.get('password')

        # Authenticate the user
        user = authenticate(username=username, password=password) 
        print(user)
        

        if user is not None:
            access_token_lifetime =timedelta(days=3650)
            refresh_token_lifetime =timedelta(days=3650)
            refresh = RefreshToken.for_user(user)
            refresh.set_exp(lifetime=refresh_token_lifetime)
            access_token = refresh.access_token
            access_token.set_exp(lifetime=access_token_lifetime)
            user = User.objects.filter(username = username).first()
            customerData = CustomerMaster.objects.filter(id=user.last_name).first()
            
            
            serializer = UserSerializer(user)        # Return the response
            
            response_data = {
                    'data': {
                        'user_id': user.id,
                        'user_name': user.username,
                        'customer_name':customerData.name,
                        'customer_id':customerData.id,
                        'access_token':str(refresh.access_token)
                    },
                    'message': 'Valid',
                    'success': True
                }

            return Response(response_data)
        
        else :
            response_data = {
            'data': None,
            'message': 'Invalid credentials',
            'success': False
        }
        
        return Response(response_data)  
    
    except Exception as e:
        print(e)
        response_data = {
            'data': None,
            'message': 'Invalid credentials',
            'success': False
        }
        
        return Response(response_data)       
        
@api_view(['POST'])
def logout(request):
    try:
        # Get the refresh token from the request body
        refresh_token = request.data.get("refresh")
        token = RefreshToken(refresh_token)
        token.blacklist()  # Blacklist the refresh token

        return Response({"message": "Logout successful"}, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({"error": "Invalid token or already blacklisted"}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_generate_order(request):
    try:
        with transaction.atomic():

            response_data = {}

            customer_id = request.query_params.get('customer_id')
            part_master = PartMaster.objects.values('id', 'part_name', 'uom', 'unit_price', 'stock', 'allocated_stock')
            total_addresses = list(CustomerMaster.objects.filter(id = customer_id).values_list('delivery_address', 'additional_address1', 'additional_address2').first())

            limits = CustomerMaster.objects.filter(id = customer_id).first()
            credit_limit = float(limits.credit_limit) - float(limits.used_limit)

            addresses = [address for address in total_addresses if address != '' and address is not None]
            part_details = [{'part_id': part['id'], 'part_name': part['part_name'], 'unit_price': part['unit_price'], 'stock': float(part['stock']) - float(part['allocated_stock']), 'uom': part['uom']} for part in part_master]


            response_data = {
                'data': {
                    'part_details': part_details,
                    'addresses': addresses,
                    'credit_limit': credit_limit
                },
                'message': 'Valid',
                'success': True
            }

            return Response(response_data)

    except Exception as e:
        response_data = {
            'data': None,
            'message': 'Error while fetching data',
            'success': False
        }
        print(e)
        return Response(response_data)



@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_order(request):
    response_data = {}

    try:
        with transaction.atomic():

            part_master = PartMaster.objects.filter(id = request.data.get('part_id')).first()
            customer_master = CustomerMaster.objects.filter(id = request.data.get('customer_id')).first()
            delivery_address = request.data.get('delivery_address')
            quantity = float(request.data.get('qty'))
            payment_type = request.data.get('payment_type')
            addresses_map = {customer_master.delivery_address : f"{customer_master.delivery_address_city}_{customer_master.delivery_address_state}_{customer_master.delivery_address_state_code}", customer_master.additional_address1 : f"{customer_master.additional_address1_city}_{customer_master.additional_address1_state}_{customer_master.additional_address1_state_code}", customer_master.additional_address2 : f"{customer_master.additional_address2_city}_{customer_master.additional_address2_state}_{customer_master.additional_address2_state_code}"}

            delivery_address_city = addresses_map[delivery_address].split('_')[0]
            delivery_address_state = addresses_map[delivery_address].split('_')[1]
            delivery_address_state_code = addresses_map[delivery_address].split('_')[2]

            available_stock = float(part_master.stock) - float(part_master.allocated_stock)

            if quantity > available_stock:
                response_data = {
                    'data': None,
                    'message': 'Stock for this part is not available.',
                    'success': False
                }
                return Response(response_data)
            
            else:
                amount_inr = round(part_master.unit_price * quantity, 2)
                amount_inr_tax = round(amount_inr + float(amount_inr * 0.18), 2)

                if delivery_address_state_code == 33:
                    igst_percentage = 0.0
                    sgst_percentage = 9.0
                    cgst_percentage = 9.0

                    igst_amount = 0.0
                    sgst_amount = round(float(amount_inr * 0.09), 2)
                    cgst_amount = round(float(amount_inr * 0.09), 2)
                    total_tax_amount = sgst_amount + cgst_amount
                    
                else:

                    igst_percentage = 18.0
                    sgst_percentage = 0.0
                    cgst_percentage = 0.0

                    igst_amount = round(float(amount_inr * 0.18), 2)
                    sgst_amount = 0.0
                    cgst_amount = 0.0
                    total_tax_amount = igst_amount
                    


                if payment_type == 'Credit':
                    
                    available_credit = customer_master.credit_limit - customer_master.used_limit

                    if amount_inr_tax > available_credit:
                        response_data = {
                            'data': None,
                            'message': 'Credit Limit Exceeded! - Please contact admin to increase credit limit.',
                            'success': False
                        }
                        return Response(response_data)
                    
                    else:
                        order_header = {}

                        last_order = get_count(OrderHeader)
                        julian_date = base33()
                        current_year = str(datetime.now().year)[-2:]
                        order_number = f"OR{julian_date}{current_year}{last_order+1:04}"
                        
                        order_header = {
                            'order_number': order_number,
                            'payment_type': 'credit',
                            'part_name': part_master.part_name,
                            'delivery_address': delivery_address,
                            'delivery_address_city': delivery_address_city,
                            'delivery_address_state': delivery_address_state,
                            'delivery_address_state_code': delivery_address_state_code,
                            'igst_percentage': igst_percentage,
                            'sgst_percentage': sgst_percentage,
                            'cgst_percentage': cgst_percentage,
                            'igst_amount': igst_amount,
                            'sgst_amount': sgst_amount,
                            'cgst_amount': cgst_amount,
                            'total_tax_amount': total_tax_amount,
                            'uom': part_master.uom,
                            'quantity': quantity,
                            'unit_price': part_master.unit_price,
                            'tax_percentage': 18.0,
                            'customer_name': customer_master.name,
                            'amount_for_quantity': amount_inr,
                            'total_amount': amount_inr_tax,
                            'paid_amount': 0.0,
                            'ordered_by': request.data.get('user_id'),
                            'part_master_id': part_master.id,
                            'customer_master_id': customer_master.id
                        }

                        OrderHeader.objects.create(**order_header)

                        part_master.allocated_stock = float(part_master.allocated_stock) + quantity
                        customer_master.used_limit = float(customer_master.used_limit) + amount_inr_tax

                        part_master.save()
                        customer_master.save()

                        response_data = {
                            'data': {
                                'order_no': order_number
                            },
                            'message': 'Order placed successfully.',
                            'success': True
                        }
                        return Response(response_data)

                elif payment_type == 'Advance':
                    order_header = {}

                    last_order = get_count(OrderHeader)
                    julian_date = base33()
                    current_year = str(datetime.now().year)[-2:]
                    order_number = f"OR{julian_date}{current_year}{last_order+1:04}"

                    order_header = {
                        'order_number': order_number,
                        'payment_type': 'advance',
                        'part_name': part_master.part_name,
                        'delivery_address': delivery_address,
                        'delivery_address_city': delivery_address_city,
                        'delivery_address_state': delivery_address_state,
                        'delivery_address_state_code': delivery_address_state_code,
                        'igst_percentage': igst_percentage,
                        'sgst_percentage': sgst_percentage,
                        'cgst_percentage': cgst_percentage,
                        'igst_amount': igst_amount,
                        'sgst_amount': sgst_amount,
                        'cgst_amount': cgst_amount,
                        'total_tax_amount': total_tax_amount,
                        'uom': part_master.uom,
                        'quantity': quantity,
                        'unit_price': part_master.unit_price,
                        'tax_percentage': 18.0,
                        'customer_name': customer_master.name,
                        'amount_for_quantity': amount_inr,
                        'total_amount': amount_inr_tax,
                        'paid_amount': 0.0,
                        'ordered_by': request.data.get('user_id'),
                        'part_master_id': part_master.id,
                        'customer_master_id': customer_master.id
                    }

                    OrderHeader.objects.create(**order_header)

                    part_master.allocated_stock = float(part_master.allocated_stock) + quantity
                    part_master.save()

                    response_data = {
                        'data': {
                            'order_no': order_number
                        },
                        'message': 'Order placed successfully.',
                        'success': True
                    }
                    return Response(response_data)

                else:
                    response_data = {
                        'data': None,
                        'message': 'Payment Type can be - Advanced/Credit',
                        'success': False
                    }
                    return Response(response_data)
    
    except Exception as e:
        print(e)
        response_data = {
            'data': None,
            'message': 'Error while placing order.',
            'success': False
        }
        return Response(response_data)



@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_order_list(request):
    response_data = {}

    try:
        with transaction.atomic():

            status = request.query_params.get('status')
            completed_status = 'no' if status == 'pending' else 'yes'
            customer_id = request.query_params.get('customer_id')
            order_list= list(OrderHeader.objects.filter(completed_status = completed_status, customer_master_id = customer_id).annotate(order_no = F('order_number')).values('order_no').order_by('-id'))

            
        

            response_data = {
                'data': order_list,
                'message': 'Valid',
                'success': True
            }

            return Response(response_data)

    except Exception as e:
        print(e)
        response_data = {
            'data': None,
            'message': 'Error while fetching data',
            'success': False
        }

        return Response(response_data)



@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_order(request):
    response_data = {}

    try:
        with transaction.atomic():

            order_number = request.query_params.get('order_no')
            order_details = OrderHeader.objects.filter(order_number = order_number).values('order_number', 'irn_invoice_number', 'delivery_address', 'payment_type', 'part_name', 'uom', 'quantity', 'unit_price', 'tax_percentage', 'amount_for_quantity', 'total_amount', 'paid_amount', 'attached_status', 'verified_status', 'invoice_generated_status', 'paid_status', 'dispatched_status', 'completed_status').first()

            if order_details:
                response_data = {
                    'data': order_details,
                    'message': 'Valid',
                    'success': True,
                }

                return Response(response_data)
            else:
                response_data = {
                    'data': None,
                    'message': 'Order not found.',
                    'success': False
                }

                return Response(response_data)

    except Exception as e:
        print(e)
        response_data = {
            'data': None,
            'message': 'Error while fetching data',
            'success': False
        }
        return Response(response_data)



@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_order_attachment(request):
    response_data = {}

    try:
        with transaction.atomic():
            file = request.FILES['file']
            order_header = OrderHeader.objects.filter(order_number = request.data.get('order_no')).first()
            attached_by = request.data.get('user_id')
            
            if order_header:
                if order_header.payment_type == 'credit':
                    if order_header.dispatched_status == 'yes':

                        order_attachment_transaction = {
                            'attached_image': file,
                            'order_header_id': order_header.id,
                            'attached_by': attached_by
                        }

                        OrderAttachmentTransaction.objects.create(**order_attachment_transaction)
                        OrderHeader.objects.filter(id = order_header.id).update(attached_status = 'partial')

                        response_data = {
                            'message': 'Proof attached successfully.',
                            'success': True
                        }

                        return Response(response_data)
                    
                    else:
                        response_data = {
                            'message': 'Not yet dispatched.',
                            'success': False
                        }

                else:
                    order_attachment_transaction = {
                            'attached_image': file,
                            'order_header_id': order_header.id,
                            'attached_by': attached_by
                        }
                    
                    OrderAttachmentTransaction.objects.create(**order_attachment_transaction)
                    OrderHeader.objects.filter(id = order_header.id).update(attached_status = 'partial')

                    response_data = {
                        'message': 'Proof attached successfully.',
                        'success': True
                    }

                    return Response(response_data)

            
            else:
                response_data = {
                    'message': 'Order Number not found.',
                    'success': True
                }
                return Response(response_data)

    except Exception as e:
        print(e)
        response_data = {
            'message': 'Error while creating data',
            'success': False,
        }

        return Response(response_data)



@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_card_details(request):
    try:
        customer_id = request.query_params.get('customer_id')
        
        if not customer_id:
            return Response({
                'message': 'Customer ID is required',
                'success': False
            }, status=400)
        
        with transaction.atomic():  
            customer = CustomerMaster.objects.filter(id=customer_id).first()
            
            if not customer:
                return Response({
                    'message': 'Customer not found',
                    'success': False
                }, status=404)
            
            response_data = {
                'data': {
                    'credit_limit': customer.credit_limit,
                    'used_limit': customer.used_limit
                },
                'message': 'Valid',
                'success': True
            }

        
        return Response(response_data, status=200)
        
    except Exception as e:
        return Response({
            'message': 'Error while fetching data',
            'error': str(e),
            'success': False
        }, status=500)



@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_order_count(request):
    try:
        customer_id = request.query_params.get('customer_id')
        
        if not customer_id:
            return Response({
                'message': 'Customer ID is required',
                'success': False
            }, status=400)
        
        with transaction.atomic():  
            orderheader = OrderHeader.objects.filter(customer_master_id =customer_id)
            completedOrders = orderheader.filter(completed_status = "yes").count()
            pendingOrders = orderheader.filter(completed_status = "no").count()
            
            response_data = {
                'data': {
                    'pending_orders': pendingOrders,
                    'completed_orders': completedOrders,
                    
                },
                'message': 'Valid',
                'success': True
            }
        
        return Response(response_data, status=200)
        
    except Exception as e:
        return Response({
            'message': 'Error while fetching data',
            'error': str(e),
            'success': False
        }, status=500)            


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_einvoice_details(request):
    response_data = {}

    try:
        with transaction.atomic():
            order_header = OrderHeader.objects.filter(order_number = request.query_params.get('order_no')).first()
            
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
                    'description_of_goods': order_header.part_name,
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

                response_data = {
                    'data': data,
                    'message': 'Valid',
                    'success': True
                }

                return Response(response_data)


    
    except Exception as e:
        print(e)

        response_data = {
            'message': 'Invalid',
            'success': False
        }

        return Response(response_data)