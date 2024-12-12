from django.db import models
from asset.models.OrderHeaderModel import OrderHeader

class OrderAttachmentTransaction(models.Model):
    order_header = models.ForeignKey(OrderHeader, on_delete = models.CASCADE)
    attached_image = models.FileField(upload_to='attachments/')
    attached_at = models.DateTimeField(auto_now_add = True, null = True)
    attached_by = models.IntegerField()
    verified_at = models.DateTimeField(null = True)
    verified_by = models.IntegerField()

    class Meta:
        db_table = 'order_attachment_transaction'  # Set custom table name if needed
        ordering = ['id']
        