from rest_framework.decorators import api_view
from rest_framework.response import Response


from asset.models import *
from django.db import transaction



@api_view(['GET'])
def get_order_details(request):
    response_data = {}
    try:
        with transaction.atomic():

            order_header_id = request.query_params.get('order_header_id')

            order_header = OrderHeader.objects.filter(id = order_header_id).prefetch_related('attachments', 'transaction').first()

            if order_header:
                order_attachment_images = order_header.attachments.all()
                order_transaction = order_header.transaction.all()


                response_data = {
                    'order_header': order_header,
                    'order_attachment_images': order_attachment_images,
                    'order_transaction': order_transaction
                }

                return Response(response_data)

            else:
                return Response('Order not found.')
            
    
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

                else:
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

            if order_header:
                order_transaction = {
                    'order_header_id': order_header.id,
                    'payment_amount': request.data.get('payment_amount'),
                    'payment_date': request.data.get('payment_date'),
                    'payment_comments': request.data.get('payment_comments'),
                    'created_by': 1,
                    'updated_by': 1 
                }

                OrderTransaction.objects.create(**order_transaction)

                order_header.paid_amount = float(order_header.paid_amount) + float(request.data.get('payment_amount'))
                
                order_header.verified_status = 'yes' if float(order_header.paid_amount) == float(order_header.total_amount) else 'no'
                order_header.attached_status = 'yes' if order_header.verified_status == 'yes' else 'partial'

                status = 'yes' if order_header.verified_status == 'yes' and order_header.dispatched_status == 'yes' else 'no'
                completed_status = 'yes' if status == 'yes' and order_header.invoice_generated_status == 'yes' else 'no'

                order_header.completed_status = completed_status

                

                order_header.save() 



            else:
                return Response('Order not found.')
    

    except Exception as e:
        print(e)
        return Response('error')


