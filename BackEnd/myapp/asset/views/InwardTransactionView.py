from rest_framework import status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from ..models.InwardTransactionModel import InwardTransaction
from ..serializers.InwardTransactionSerializer import InwardTransactionSerializer
from django.utils import timezone
from ..models.PartMasterModel import PartMaster
from django.db.models import Sum
from django.db import transaction

from asset.models import *

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_inwardTransaction(request):
    try:
        with transaction.atomic():

            inward_header = InwardHeader.objects.filter(location_master_id = request.data.get('location_id')).first()
            part_master = PartMaster.objects.filter(part_name = request.data.get('part_name')).first()

            part_master.stock += round(float(request.data.get('inward_quantity')), 2)

            part_master.save()

            if inward_header:
                inward_transaction = {
                    'part_name': request.data.get('part_name'),
                    'inward_quantity': round(float(request.data.get('inward_quantity')), 2),
                    'comments': request.data.get('comments'),
                    'uom': 'tons',
                    'locationmaster_id': request.data.get('location_id'),
                    'created_by': 1,
                    'updated_by': 1
                }

                inward_header.total_quantity += round(float(request.data.get('inward_quantity')), 2)

                inward_header.save()
                InwardTransaction.objects.create(**inward_transaction)

            else:
                part_master_id = PartMaster.objects.filter(part_name = request.data.get('part_name')).first().id

                inward_header = {
                    'part_name': request.data.get('part_name'),
                    'total_quantity': round(float(request.data.get('inward_quantity')), 2),
                    'part_master_id': part_master_id,
                    'location_master_id': request.data.get('location_id')
                }

                inward_transaction = {
                    'part_name': request.data.get('part_name'),
                    'inward_quantity': round(float(request.data.get('inward_quantity')), 2),
                    'comments': request.data.get('comments'),
                    'uom': 'tons',
                    'locationmaster_id': request.data.get('location_id'),
                    'created_by': 1,
                    'updated_by': 1
                }

                InwardHeader.objects.create(**inward_header)
                InwardTransaction.objects.create(**inward_transaction)
            
            return Response('success')

    except Exception as e:
        print(e)
        return Response('error')


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
        
        inward_header = InwardHeader.objects.values('part_name', 'location_master_id__name', 'location_master_id', 'total_quantity')
        print(inward_header)
        return Response(inward_header)


@api_view(['GET'])
def get_inward_transaction(request):
    try:
        with transaction.atomic():
            inwardtransaction_data = InwardTransaction.objects.all().order_by('-id')
            serializer = InwardTransactionSerializer(inwardtransaction_data, many = True)

            return Response(serializer.data)
            
    
    except Exception as e:
        print(e)
        return Response('error')

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_inward_part_location_details(request):
    try:
        with transaction.atomic():
            location_master_id = request.query_params.get('location_master_id')
            part_name = request.query_params.get('part_name')
            response_data = InwardTransaction.objects.filter(locationmaster_id = location_master_id, part_name = part_name).values('locationmaster_id__name', 'part_name', 'uom', 'comments', 'inward_quantity', 'inward_by', 'inward_date').order_by('-inward_date')

            return Response(response_data)

            
    
    except Exception as e:
        print(e)
        return Response('error')


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