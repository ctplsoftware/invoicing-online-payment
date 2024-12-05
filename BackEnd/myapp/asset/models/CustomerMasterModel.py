from django.db import models

class CustomerMaster(models.Model):
    STATUS_CHOICES = [
        ('active', 'Active'),
        ('inactive', 'Inactive'),
    ]

    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255)
    gstin_number = models.CharField(max_length=250, default="")
    delivery_address = models.CharField(max_length=255, null=True, blank=True)
    additional_address1 = models.CharField(max_length=255, null=True, blank=True)
    additional_address2 = models.CharField(max_length=255, null=True, blank=True)
    billing_address = models.CharField(max_length=255, null=True, blank=True)
    credit_limit = models.DecimalField(max_digits=10, decimal_places=2,null=True, blank=True)
    credit_days = models.CharField(max_length=50, blank=True, null=True)
    contact_person = models.CharField(max_length=255)
    contact_number = models.CharField(max_length=50)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES)
    created_at = models.DateTimeField(auto_now_add=True)  
    updated_at = models.DateTimeField(null=True, blank=True)
    created_by = models.IntegerField()
    updated_by = models.IntegerField()

    class Meta:
        db_table = 'customer_master'
        ordering = ['id']
