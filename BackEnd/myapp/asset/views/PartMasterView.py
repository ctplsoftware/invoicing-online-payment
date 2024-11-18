from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from ..models.PartMasterModel import PartMaster
from ..serializers.PartMasterSerializer import PartMasterSerializer
from django.utils import timezone


@api_view(['POST'])
def create_part_master(request):
    data = request.data.copy() 
    data['created_by'] = 1
    data['updated_by'] = 1
    serializer = PartMasterSerializer(data=data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def editGet_part_master(request, id):
    try:
        part_master = PartMaster.objects.get(id=id)
    except PartMaster.DoesNotExist:
        return Response({'error': 'PartMaster not found'}, status=status.HTTP_404_NOT_FOUND)
    
    serializer = PartMasterSerializer(part_master)
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['GET'])
def get_part_master(request):
        
        customerMaster_data = PartMaster.objects.all()
        serializer = PartMasterSerializer(customerMaster_data, many=True)
        return Response(serializer.data)

@api_view(['PUT'])
def update_part_master(request, id):
    try:
        part_master = PartMaster.objects.get(id=id)
    except PartMaster.DoesNotExist:
        return Response({'error': 'PartMaster not found'}, status=status.HTTP_404_NOT_FOUND)
    
    serializer = PartMasterSerializer(part_master, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save(updated_at=timezone.now())
        return Response(serializer.data, status=status.HTTP_200_OK)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
