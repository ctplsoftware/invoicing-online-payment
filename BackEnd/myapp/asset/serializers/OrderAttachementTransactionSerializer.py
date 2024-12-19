from rest_framework import serializers
from ..models.OrderAttachmentTransactionModel import OrderAttachmentTransaction

class OrderAttachmentTransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderAttachmentTransaction
        fields = '__all__' 

    