from django.db import models
from asset.models.OrderHeaderModel import OrderHeader


class OrderTransaction(models.Model):
    order_header = models.ForeignKey(OrderHeader, on_delete = models.CASCADE)
    payment_amount = models.FloatField()
    payment_date = models.CharField(max_length = 200, null = True)
    payment_comments = models.CharField(max_length = 200, null = True)
    created_by = models.IntegerField()
    updated_by = models.IntegerField()
    created_at = models.DateTimeField(auto_now_add = True, null = True)
    updated_at = models.DateTimeField(auto_now = True, null = True)

    class Meta:
        db_table = 'order_transaction'
        ordering = ['id']

