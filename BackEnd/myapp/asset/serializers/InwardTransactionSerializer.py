from rest_framework import serializers
from ..models.InwardTransactionModel import InwardTransaction

class InwardTransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = InwardTransaction
        fields = '__all__' 

