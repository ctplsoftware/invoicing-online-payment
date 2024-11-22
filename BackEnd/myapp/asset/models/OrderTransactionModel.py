from django.db import models

class OrderTransaction(models.Model):
    ORDER_MODE_CHOICES = [
        ('credit', 'Credit'),
        ('advanced', 'Advanced'),
    ]
    STATUS_CHOICES = [
        ('yes', 'Yes'),
        ('no', 'No'),
    ]

    id = models.AutoField(primary_key=True)
    part_number = models.CharField(max_length=255)
    part_name = models.CharField(max_length=255)
    order_quantity = models.CharField(max_length=50)
    order_mode = models.CharField(max_length=10, choices=ORDER_MODE_CHOICES)
    order_value = models.FloatField()
    customer_name = models.CharField(max_length=255)
    customer_address = models.CharField(max_length=255)
    verified_status = models.CharField(max_length=3, choices=STATUS_CHOICES)
    dispatch_status = models.CharField(max_length=3, choices=STATUS_CHOICES)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    created_by = models.IntegerField()
    updated_by = models.IntegerField()

    class Meta:
        db_table = 'order_transaction'
        ordering = ['id']