from rest_framework import serializers
from ..models.LocationMasterModel import LoactionMaster

class LocationMasterSerializer(serializers.ModelSerializer):
    class Meta:
        model = LoactionMaster
        fields = '__all__' 
