from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from ..models.PartMasterModel import PartMaster
from ..serializers.PartMasterSerializer import PartMasterSerializer
from django.utils import timezone


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_part_master(request):
    data = request.data.copy()
    print(data)
    data['created_by'] = request.data.get("user_id")
    serializer = PartMasterSerializer(data=data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def editGet_part_master(request, id):
    try:
        part_master = PartMaster.objects.get(id=id)
    except PartMaster.DoesNotExist:
        return Response({'error': 'PartMaster not found'}, status=status.HTTP_404_NOT_FOUND)
    
    serializer = PartMasterSerializer(part_master)
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_part_master(request):
        
        customerMaster_data = PartMaster.objects.all()
        serializer = PartMasterSerializer(customerMaster_data, many=True)
        return Response(serializer.data)

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_part_master(request, id):
    try:
        part_master = PartMaster.objects.get(id=id)
    except PartMaster.DoesNotExist:
        return Response({'error': 'PartMaster not found'}, status=status.HTTP_404_NOT_FOUND)
    
    part_master.updated_by =request.data.get("user_id")
    
    serializer = PartMasterSerializer(part_master, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save(updated_at=timezone.now())
        return Response(serializer.data, status=status.HTTP_200_OK)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
