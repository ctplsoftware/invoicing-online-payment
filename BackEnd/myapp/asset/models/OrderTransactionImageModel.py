from django.db import models

class OrderTransactionImage(models.Model):
    id = models.AutoField(primary_key=True)
    order_transaction = models.ForeignKey('OrderTransaction', on_delete=models.CASCADE, related_name='images')
    image = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    created_by = models.IntegerField()
    updated_by = models.IntegerField()

    class Meta:
        db_table = 'order_transaction_image'
        ordering = ['id']
