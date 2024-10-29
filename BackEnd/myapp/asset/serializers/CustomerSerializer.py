from rest_framework import serializers
from ..models.CustomerMasterModel import CustomerMaster

class CustomerSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomerMaster
        fields = '__all__' 
