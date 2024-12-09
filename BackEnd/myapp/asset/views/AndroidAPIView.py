from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from ..models.PartMasterModel import PartMaster
from ..serializers.PartMasterSerializer import PartMasterSerializer
from django.utils import timezone
from ..models.CustomerMasterModel import CustomerMaster
from ..serializers.CustomerSerializer import CustomerSerializer
from ..models.InwardTransactionModel import InwardTransaction
from ..serializers.InwardTransactionSerializer import InwardTransactionSerializer
from django.db.models import Sum
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from ..models.OrderTransactionModel import OrderTransaction
from ..serializers.OrderTransactionSerializer import OrderTransactionSerializer
from django.utils import timezone
from ..models.PartMasterModel import PartMaster
from ..models.OrderPlacedTransactionModel import OrderPlacedTransaction
from ..models.AttachmentsModel import Attachment
from ..serializers.AttachmentsSerializer import AttachmentsSerializer
from ..serializers.OrderPlacedTransactionSerializer import OrderPlacedTransactionSerializer
from django.utils.timezone import now
import os
from decimal import Decimal
from django.contrib.auth.models import User








@api_view(['GET'])
def get_part_master(request):
    # Filter the PartMaster data where status is 'active'
    active_parts = PartMaster.objects.filter(status="active")
    
    # Extract only the part_name
    part_names = [part.part_name for part in active_parts]

    # Construct the response in the desired format
    return Response({
        'success': True,
        'message': "Valid",
        'data': part_names
    })


@api_view(['GET'])
def get_partmaster_usermaster(request):
    userid = request.GET.get('user_id')
    part_desc = request.GET.get('part_desc')
    
    try:

        customers = CustomerMaster.objects.filter(status='active', id=userid)
        
        parts = PartMaster.objects.filter(status='active', part_name__icontains=part_desc)
        
        if not customers.exists() or not parts.exists():
            return Response({
                'success': False,
                'message': "No active records found in CustomerMaster or PartMaster",
                'data': None
            })

        addresses = []
        credit_limit = None
        if customers.exists():
            customer = customers.first()  
            addresses = [
                addr for addr in [
                    customer.delivery_address,
                    customer.additional_address1,
                    customer.additional_address2
                ] if addr
            ]
            
        credit_limit = customer.credit_limit  # e.g., "1,234.56"
        credit_limit_float = float(credit_limit.replace(",", ""))
        credit_limit_double = round(credit_limit_float, 2)  # Ensure 2 decimal places

        # Extract PartMaster and InwardTransaction data
        unit_price = None
        uom = None
        if parts.exists():
            part = parts.first()  # Assuming one part per description
            unit_price = part.unit_price
            uom = part.uom

        # Calculate stock (total_quantity) from InwardTransaction
        total_quantity = (
            InwardTransaction.objects.filter(part_name__icontains=part_desc)
            .aggregate(total_quantity=Sum('inward_quantity'))
            .get('total_quantity', 0)
        )

        return Response({
            'success': True,
            'message': "Valid",
            'data': {
                "address": addresses,
                "credit_prices": credit_limit_double,
                "unit_prices": unit_price,
                "stock": total_quantity,
                "uom": uom
            }
        })
    except Exception as e:
        return Response({
            'success': False,
            'message': f"An error occurred: {str(e)}",
            'data': None
        })

@api_view(['POST'])
def create_ordertransaction(request):
    try:
        # Generate a unique 6-digit order number
        last_order = OrderTransaction.objects.all().order_by('id').last()
        if last_order:
            last_order_no = int(last_order.order_no)
            new_order_no = str(last_order_no + 1).zfill(6)  # Increment and pad with zeros
        else:
            new_order_no = "000001"  # Start with "000001" if no orders exist

        # Fetch part details based on part_desc
        part_desc = request.data.get('part_desc')
        if not part_desc:
            raise ValueError("part_desc is required")

        part = PartMaster.objects.filter(part_name=part_desc).first()
        if not part:
            raise ValueError("Part not found")

        # Calculate tax and total amount
        quantity = request.data.get("qty")
        if not quantity or int(quantity) <= 0:
            raise ValueError("quantity must be a positive number")
        
        quantity = int(quantity)
        unit_price = Decimal(part.unit_price)  # Ensure Decimal type
        amount_for_qty = Decimal(quantity) * unit_price
        tax_percentage = Decimal(18)  # Hardcoded tax percentage as Decimal
        tax_amount = (amount_for_qty * tax_percentage) / Decimal(100)
        total_amount = amount_for_qty + tax_amount
        
        payment_type = request.data.get("payment_type")
        user_id = request.data.get("user_id")
        status = "pending"
        user_table = User.objects.get(id=user_id)
        print("heloooooooooooooooo")
        customer_table =CustomerMaster.objects.get(id=user_table.last_name)
        if payment_type == 'credit':
            try:
                # Fetch the customer record
                customer = CustomerMaster.objects.get(id=user_id)
                
                # Ensure credit_limit is Decimal
                credit_limit = customer.credit_limit
                
                # Calculate the new credit limit
                actual_creditlimit = credit_limit - total_amount

                # Ensure the new credit limit is not negative
                if actual_creditlimit < Decimal(0):
                    raise ValueError("Insufficient credit limit for this transaction.")

                # Update the credit limit in the database
                customer.credit_limit = actual_creditlimit
                customer.save()

                # Change status to verified for credit payment
                status = "attached"
        
            except CustomerMaster.DoesNotExist:
                return Response({
                    'success': False,
                    'message': "Customer not found."
                }, status=400)
            except Exception as e:
                return Response({
                    'success': False,
                    'message': f"An error occurred: {str(e)}"
                }, status=400)
                
            
            
            
        
                

        # Populate fields for the order transaction
        data = {
            "order_no": new_order_no,
            "part": part.id,
            "uom": part.uom,
            "quantity": quantity,
            "unit_price": unit_price,
            "amount_for_qty": amount_for_qty,
            "tax_percentage": tax_percentage,
            "total_amount": total_amount,
            "transaction_id": 1,
            "invoice_no": 1,
            "delivery_address": request.data.get("delivery_address"),
            "created_by": request.data.get("user_id"),
            "payment_type": request.data.get("payment_type"),
            "status": status,
             'customer_name': customer_table.name
        }

        serializer = OrderTransactionSerializer(data=data)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        # Return only the order number
        return Response({
            'success': True,
            'message': "Valid",
            'data': {
                'order_no': new_order_no
            }
        })

    except ValueError as ve:
        return Response({
            'success': False,
            'message': str(ve),
            'data': None
        }, status=400)
    except Exception as e:
        return Response({
            'success': False,
            'message': f"An error occurred: {str(e)}",
            'data': None
        }, status=500)

    

@api_view(['GET'])
def getOrderTransactionsForOrderNumber(request):
    try:
        order_no = request.GET.get('order_no')
        order = OrderTransaction.objects.get(order_no=order_no)
        part = PartMaster.objects.get(id=order.part_id)
        return Response({
            'success': True,
            'message': "Valid",
            'data': {
                "order_no": order.order_no,
                "qty": order.quantity,
                "unit_price": order.unit_price,
                'amount_qty':order.amount_for_qty,
                'gst_percent':order.tax_percentage,
                "total_amount": order.total_amount,
                "uom": order.uom,
                'part_desc': part.part_name
            }
        })
    except Exception as e:
        return Response({
            'success': False,
            'message': f"An error occurred: {str(e)}",
            'data': None
        })  
        
    
@api_view(['POST'])
def create_orderplace_transaction(request):
    try:
        # Retrieve and validate the required fields
        order_no = request.data.get('order_no')
        transaction_id = request.data.get('transaction_id')
        user_id = request.data.get('user_id')
        
        if not order_no or not transaction_id:
            return Response(
                {
                    'success': False,
                    'message': "order_no and transaction_id are required fields."
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        data = {
            "order_no": order_no,
            "transaction_id": transaction_id,
            "user_id": user_id,
            "created_at": now(),
            "updated_at": None,
            "created_by": user_id,
            "updated_by": None,
        }

        # Serialize and save the data
        serializer = OrderPlacedTransactionSerializer(data=data)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        # Return a success response
        return Response({
            'success': True,
            'message': "Valid",
        }, status=status.HTTP_201_CREATED)

    except Exception as e:
        # Return an error response
        return Response({
            'success': False,
            'message': f"An error occurred: {str(e)}",
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)    
    
    
@api_view(['GET'])
def getOrderTransactions(request):
    try:
        # Fetch all order records
        orders = OrderTransaction.objects.all()

        # Serialize the order data into a list of dictionaries
        order_data = [
            {
                "unit_price": order.unit_price,
                "qty": order.quantity,
                "total_amount": order.total_amount,
                "uom": order.uom,
            }
            for order in orders
        ]

        return Response({
            'success': True,
            'message': "Valid",
            'data': order_data
        })
    except Exception as e:
        return Response({
            'success': False,
            'message': f"An error occurred: {str(e)}",
            'data': None
        })    
        
        
@api_view(['GET'])
def getPendingOrderTransactions(request):
    try:
        # Get the user_id from the request data
        user_id = request.GET.get('user_id')  # Use GET if the user_id is passed as a query parameter

        if not user_id:
            return Response({
                'success': False,
                'message': "user_id is required",
                'data': None
            }, status=400)

        # Exclude records with statuses 'verified' and 'dispatched' and filter by user_id
        orders = OrderTransaction.objects.exclude(status__in=['verified', 'dispatched']).filter(created_by=user_id)

        # Serialize the filtered order data
        order_data = [
            {
                "order_no": order.order_no,
                "status": order.status,
            }
            for order in orders
        ]

        return Response({
            'success': True,
            'message': "Valid",
            'data': order_data
        })
    except Exception as e:
        return Response({
            'success': False,
            'message': f"An error occurred: {str(e)}",
            'data': None
        }, status=500)  
           
    
@api_view(['POST'])
def upload_attachment(request):
    if 'file' not in request.FILES:
        return Response({"error": "No file provided."}, status=status.HTTP_400_BAD_REQUEST)
    
    file = request.FILES['file']  
    order_no = request.data.get('order_no')  
    
    if not order_no:
        return Response({"error": "Order number is required."}, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        order_transaction = OrderTransaction.objects.get(order_no=order_no)
    except OrderTransaction.DoesNotExist:
        return Response({"error": "Order not found."}, status=status.HTTP_404_NOT_FOUND)
    
    attachment = Attachment.objects.create(file=file, uploaded_by=order_no) 
    serializer = AttachmentsSerializer(attachment)
    
    if order_transaction.payment_type == 'Advance':
        order_transaction.status = 'Attached'  
        order_transaction.save()  
    
    return Response({
        'success': True,
        'message': "File uploaded successfully.",
        'attachment': serializer.data
    })
    


@api_view(['GET'])
def fetch_pending_attachments(request):
    try:
        # Query orders with "Paid" status
        paid_orders = OrderTransaction.objects.filter(status="paid")
        
        # Find orders with no attachments
        orders_without_attachments = paid_orders.exclude(
            order_no__in=Attachment.objects.values_list('uploaded_by', flat=True)
        )
        
        # Serialize or prepare response data
        response_data = [
            {
                "order_no": order.order_no,
                "total_amount": order.total_amount,
                "payment_type": order.payment_type,
                "status": order.status,
            }
            for order in paid_orders
        ]
        
        return Response({
            "success": True,
            "orders": response_data
        }, status=status.HTTP_200_OK)
    
    except Exception as e:
        return Response({
            "success": False,
            "error": str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
