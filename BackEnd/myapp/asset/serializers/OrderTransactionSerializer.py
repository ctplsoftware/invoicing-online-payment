from rest_framework import serializers
from ..models.OrderTransactionModel import OrderTransaction

class OrderTransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderTransaction
        fields = '__all__' 

    