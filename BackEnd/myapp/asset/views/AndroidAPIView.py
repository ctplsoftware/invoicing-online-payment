from rest_framework.decorators import api_view
from rest_framework.response import Response


from django.db import transaction

from asset.models import *
from asset.utils import *



@api_view(['GET'])
def get_generate_order(request):
    try:
        response_data = {}

        customer_id = 2
        # customer_id = request.query_paramas.get('customer_id')
        part_master = PartMaster.objects.values('id', 'part_name', 'uom', 'unit_price', 'stock', 'allocated_stock')
        total_addresses = list(CustomerMaster.objects.filter(id = customer_id).values_list('delivery_address', 'additional_address1', 'additional_address2').first())
        addresses = [address for address in total_addresses if address != '' and address is not None]
        part_details = [{'part_id': part['id'], 'part_name': part['part_name'], 'unit_price': part['unit_price'], 'stock': float(part['stock']) - float(part['allocated_stock']), 'uom': part['uom']} for part in part_master]


        response_data = {
            'data': {
                'part_details': part_details,
                'addresses': addresses
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
def create_order(request):
    response_data = {}

    try:
        with transaction.atomic():

            part_master = PartMaster.objects.filter(id = request.data.get('part_id')).first()
            customer_master = CustomerMaster.objects.filter(id = request.data.get('customer_id')).first()
            quantity = float(request.data.get('qty'))
            payment_type = request.data.get('payment_type')

            available_stock = float(part_master.stock) - float(part_master.allocated_stock)

            if quantity > available_stock:
                response_data = {
                    'data': None,
                    'message': 'Stock for this part is not available.',
                    'success': False
                }
                return Response(response_data)
            
            else:
                amount_inr = part_master.unit_price * quantity
                amount_inr_tax = amount_inr + float(amount_inr * 0.18)

                if payment_type == 'credit':
                    
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
                        order_number = f"{customer_master.name}{last_order + 1}"

                        order_header = {
                            'order_number': order_number,
                            'payment_type': payment_type,
                            'part_name': part_master.part_name,
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
                            'data': order_number,
                            'message': 'Order placed successfully.',
                            'success': True
                        }
                        return Response(response_data)

                elif payment_type == 'advanced':
                    order_header = {}

                    last_order = get_count(OrderHeader)
                    order_number = f"{customer_master.name}{last_order + 1}"

                    order_header = {
                        'order_number': order_number,
                        'payment_type': payment_type,
                        'part_name': part_master.part_name,
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
                        'data': order_number,
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
def get_order_list(request):
    response_data = {}

    try:
        with transaction.atomic():

            status = request.query_params.get('status')
            completed_status = 'no' if status == 'pending' else 'yes'
            customer_id = request.query_params.get('customer_id')
            order_list = list(OrderHeader.objects.filter(completed_status = completed_status, customer_master_id = customer_id).values())

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
def get_order(request):
    response_data = {}

    try:
        with transaction.atomic():

            order_number = request.query_params.get('order_no')
            order_details = list(OrderHeader.objects.filter(order_number = order_number).values())

            if order_details:
                response_data = {
                    'data': order_details,
                    'message': 'Valid',
                    'success': False,
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
def create_order_attachment(request):
    response_data = {}

    try:
        with transaction.atomic():
            file = request.FILES['file']
            order_header_id = OrderHeader.objects.filter(order_number = request.data.get('order_no')).first().id
            attached_by = request.data.get('user_id')
            
            if order_header_id:
                order_attachment_transaction = {
                    'attached_image': file,
                    'order_header_id': order_header_id,
                    'attached_by': attached_by
                }

                OrderAttachmentTransaction.objects.create(**order_attachment_transaction)

                response_data = {
                    'data': None,
                    'message': 'Proof attached successfully.',
                    'success': True
                }

                return Response(response_data)
            
            else:
                response_data = {
                    'data': None,
                    'message': 'Order Number not found.',
                    'success': True
                }
                return Response(response_data)

    except Exception as e:
        print(e)
        response_data = {
            'data': None,
            'message': 'Error while creating data',
            'success': False,
        }

        return Response(response_data)
