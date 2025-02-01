from django.db import models
from asset.models.OrderHeaderModel import OrderHeader


class RequestHeader(models.Model):
    order_header = models.ForeignKey(OrderHeader, on_delete = models.CASCADE, null = True)
    request_id = models.CharField(max_length = 200, null = True)
    purpose = models.CharField(max_length = 200, null = True)
    created_by = models.IntegerField(null = True)
    updated_by = models.IntegerField(null = True)
    created_at = models.DateTimeField(auto_now_add = True, null = True)
    updated_at = models.DateTimeField(auto_now = True, null = True)

    class Meta:
        db_table = 'request_header'
        ordering = ['-id']