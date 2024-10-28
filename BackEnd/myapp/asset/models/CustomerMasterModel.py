from django.db import models

class CustomerMaster(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255)
    primary_address = models.CharField(max_length=255)
    secondary_address = models.CharField(max_length=255, blank=True, null=True)
    expiration_date = models.CharField(max_length=50, blank=True, null=True)
    contact_person = models.CharField(max_length=255)
    contact_number = models.CharField(max_length=50)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    created_by = models.IntegerField()
    updated_by = models.IntegerField()

    class Meta:
        db_table = 'customer_master'
        ordering = ['id']
