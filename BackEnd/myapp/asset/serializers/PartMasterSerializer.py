from rest_framework import serializers
from ..models.PartMasterModel import PartMaster

class PartMasterSerializer(serializers.ModelSerializer):
    class Meta:
        model = PartMaster
        fields = '__all__' 
