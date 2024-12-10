from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from ..models.OrderTransactionModel import OrderTransaction
from ..serializers.OrderTransactionSerializer import OrderTransactionSerializer
from django.utils import timezone


@api_view(['GET'])
def get_order_transaction(request):
        order_data = OrderTransaction.objects.all()
        serializer = OrderTransactionSerializer(order_data, many=True)
        return Response(serializer.data)  
