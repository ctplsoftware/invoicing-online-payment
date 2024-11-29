from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from ..models.LocationMasterModel import LoactionMaster
from ..serializers.LocationMasterSerializer import LocationMasterSerializer
from django.utils import timezone


@api_view(['POST'])
def create_locationmaster(request):
    data = request.data.copy() 
    data['created_by'] = 1
    data['updated_by'] = 1
    serializer = LocationMasterSerializer(data=data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def get_locationmaster(request):
        
        locationMaster_data = LoactionMaster.objects.all()
        serializer = LocationMasterSerializer(locationMaster_data, many=True)
        return Response(serializer.data)
    
@api_view(['GET'])
def editGet_locationmaster(request, id):
    try:
        LocationMaster = LoactionMaster.objects.get(id=id)
    except LoactionMaster.DoesNotExist:
        return Response({'error': 'LocationMaster not found'}, status=status.HTTP_404_NOT_FOUND)
    
    serializer = LocationMasterSerializer(LocationMaster)
    return Response(serializer.data, status=status.HTTP_200_OK)    

@api_view(['PUT'])
def update_locationmaster(request, id):
    try:
        LocationMaster = LoactionMaster.objects.get(id=id)
    except LoactionMaster.DoesNotExist:
        return Response({'error': 'LocationMaster not found'}, status=status.HTTP_404_NOT_FOUND)
    
    serializer = LocationMasterSerializer(LocationMaster, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save(updated_at=timezone.now())
        return Response(serializer.data, status=status.HTTP_200_OK)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)