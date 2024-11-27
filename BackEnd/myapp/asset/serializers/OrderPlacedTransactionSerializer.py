from rest_framework import serializers
from ..models.OrderPlacedTransactionModel import OrderPlacedTransaction

class OrderPlacedTransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderPlacedTransaction
        fields = '__all__' 

