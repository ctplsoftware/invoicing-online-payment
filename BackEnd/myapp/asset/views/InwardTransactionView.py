from rest_framework import status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from ..models.InwardTransactionModel import InwardTransaction
from ..serializers.InwardTransactionSerializer import InwardTransactionSerializer
from django.utils import timezone

@api_view(['POST'])
def create_inwardTransaction(request):
    data = request.data.copy() 
    data['created_by'] = 1
    data['updated_by'] = 1
    location_id = data.get('location_id')
    data['locationmaster'] = location_id
    serializer = InwardTransactionSerializer(data=data )

    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    else:
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)    
    
@api_view(['GET'])
def edit_inward_transaction(request, id):
    try:
        inwardtransaction = InwardTransaction.objects.get(id=id)
    except InwardTransaction.DoesNotExist:
        return Response({'error': 'PartMaster not found'}, status=status.HTTP_404_NOT_FOUND)
    
    serializer = InwardTransactionSerializer(inwardtransaction)
    return Response(serializer.data, status=status.HTTP_200_OK)   

@api_view(['GET'])
def fetch_inward_transaction(request):
        
        inwardtransaction_data = InwardTransaction.objects.all()
        serializer = InwardTransactionSerializer(inwardtransaction_data, many=True)
        return Response(serializer.data)

@api_view(['PUT'])
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