from rest_framework import serializers
from ..models.OrderHeaderModel import OrderHeader

class OrderheaderSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderHeader
        fields = '__all__' 

    