from functools import partial
from django.db import models

class InwardTransaction(models.Model):
    part_description = models.CharField(max_length=255, null=True, blank=True)
    quantity = models.FloatField()
    remarks = models.CharField(max_length=255, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)  
    updated_at = models.DateTimeField(null=True, blank=True)
    created_by = models.IntegerField()
    updated_by = models.IntegerField()
    class Meta:
        db_table = 'inward_transaction'
        ordering = ['id']
