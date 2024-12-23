from rest_framework import status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from ..models.InwardTransactionModel import InwardTransaction
from ..serializers.InwardTransactionSerializer import InwardTransactionSerializer
from django.utils import timezone
from ..models.PartMasterModel import PartMaster

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_inwardTransaction(request):
    data = request.data.copy()
    data['created_by'] = 1  # Defaulting created_by
    data['updated_by'] = 1  # Defaulting updated_by
     
    location_id = data.get('location_id')
    part_name = data.get('part_name')
    quantity = data.get('inward_quantity', 0)  # Get the inward_quantity from the request

    try:
        # Get the PartMaster object for the given part_name
        part = PartMaster.objects.get(part_name=part_name)
    except PartMaster.DoesNotExist:
        return Response({'error': 'Part not found'}, status=status.HTTP_404_NOT_FOUND)

    # Update locationmaster for the transaction
    data['locationmaster'] = location_id

    # Serialize the InwardTransaction data
    serializer = InwardTransactionSerializer(data=data)

    if serializer.is_valid():
        serializer.save()

        # Update the stock in PartMaster
        try:
            quantity_to_add = float(quantity)  # Convert quantity to float
        except ValueError:
            return Response({'error': 'Invalid quantity'}, status=status.HTTP_400_BAD_REQUEST)

        if part.stock is None:  # Handle case where stock is None
            part.stock = 0.0

        part.stock += quantity_to_add  # Add the quantity to existing stock (float addition)
        part.save()

        return Response(serializer.data, status=status.HTTP_201_CREATED)
    else:
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    
    
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def edit_inward_transaction(request, id):
    try:
        inwardtransaction = InwardTransaction.objects.get(id=id)
    except InwardTransaction.DoesNotExist:
        return Response({'error': 'PartMaster not found'}, status=status.HTTP_404_NOT_FOUND)
    
    serializer = InwardTransactionSerializer(inwardtransaction)
    return Response(serializer.data, status=status.HTTP_200_OK)   

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def fetch_inward_transaction(request):
        
        inwardtransaction_data = InwardTransaction.objects.all()
        serializer = InwardTransactionSerializer(inwardtransaction_data, many=True)
        return Response(serializer.data)

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_inwardtransaction(request, id):
    try:
        inwardupdate = InwardTransaction.objects.get(id=id)
    except InwardTransaction.DoesNotExist:
        return Response({'error': 'Inwardtransaction not found'}, status=status.HTTP_404_NOT_FOUND)
    
    serializer = InwardTransactionSerializer(inwardupdate, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save(updated_at=timezone.now())
        return Response(serializer.data, status=status.HTTP_200_OK)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)