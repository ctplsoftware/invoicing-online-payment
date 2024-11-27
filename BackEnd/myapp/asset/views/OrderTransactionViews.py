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
        part_desc = request.data.get('part_desc')  # Assume `part_desc` is sent in the request body
        if not part_desc:
            return Response({"error": "part_desc is required"}, status=status.HTTP_400_BAD_REQUEST)
        
        part = PartMaster.objects.filter(part_name=part_desc).first()
        if not part:
            return Response({"error": "Part not found"}, status=status.HTTP_404_NOT_FOUND)
        
        # Calculate tax and total amount
        quantity = request.data.get("quantity")
        if not quantity or int(quantity) <= 0:
            return Response({"error": "quantity must be a positive number"}, status=status.HTTP_400_BAD_REQUEST)
        
        quantity = int(quantity)
        unit_price = part.unit_price
        amount_for_qty = quantity * unit_price
        tax_percentage = 18  # Hardcoded tax percentage
        tax_amount = (amount_for_qty * tax_percentage) / 100
        total_amount = amount_for_qty + tax_amount

        # Populate fields for the order transaction
        data = {
            "order_no": new_order_no,
            "part": part.id,  # Use the part ID
            "quantity": quantity,
            "unit_price": unit_price,
            "amount_for_qty": amount_for_qty,
            "tax_percentage": tax_percentage,
            "total_amount": total_amount,
            "transaction_id": 1,
            "invoice_no": 1,
            "delivery_address": request.data.get("delivery_address"),
            'created_by' : request.data.get("user_id"),
        }

        serializer = OrderTransactionSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    

@api_view(['GET'])
def getOrderTransactionsForOrderNumber(request, order_no):
    try:
        order = OrderTransaction.objects.get(order_no=order_no)
        part = PartMaster.objects.get(id=order.part_id)
        return Response({
            'success': True,
            'message': "Valid",
            'data': {
                "order_no": order.order_no,
                "qty": order.quantity,
                "unit_price": create_orderplace_transactionorder.unit_price,
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
        user_id = request.user.id  
        
        if not order_no or not transaction_id:
            return Response(
                {"error": "order_no and transaction_id are required fields."},
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

        # Serialize the data
        serializer = OrderPlacedTransactionSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
           
    
@api_view(['POST'])
def upload_attachment(request):
    if 'file' not in request.FILES:
        return Response({"error": "No file provided."}, status=status.HTTP_400_BAD_REQUEST)
    
    file = request.FILES['file']  # Get the uploaded file    
    attachment = Attachment.objects.create(file=file)
    serializer = AttachmentsSerializer(attachment)
    
    return Response(serializer.data, status=status.HTTP_201_CREATED)    


    
        
