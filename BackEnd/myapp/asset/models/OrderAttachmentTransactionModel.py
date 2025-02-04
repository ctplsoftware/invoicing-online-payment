from django.db import models
from asset.models.OrderHeaderModel import OrderHeader

class OrderAttachmentTransaction(models.Model):
    order_header = models.ForeignKey(OrderHeader, on_delete = models.CASCADE, related_name = 'attachments')
    attached_image = models.FileField(upload_to='attachments/')
    attached_at = models.DateTimeField(auto_now_add = True, null = True)
    attached_by = models.IntegerField()
    status = models.CharField(max_length = 50, null = True)
    verified_at = models.DateTimeField(null = True)
    verified_by = models.IntegerField(null = True)

    class Meta:
        db_table = 'order_attachment_transaction'  # Set custom table name if needed
        ordering = ['id']
        