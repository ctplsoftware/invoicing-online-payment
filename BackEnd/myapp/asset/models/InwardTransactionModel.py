from functools import partial
from django.db import models
from asset.models.LocationMasterModel import LoactionMaster

class InwardTransaction(models.Model):
    part_name = models.CharField(max_length=255, null=True, blank=True)
    inward_quantity = models.FloatField()
    uom=models.CharField(max_length=255, null=True, blank=True)
    comments  = models.CharField(max_length=255, null=True, blank=True)
    inward_date = models.DateTimeField(auto_now_add=True) 
    inward_by = models.CharField(max_length=255, null=True, blank=True)
    locationmaster = models.ForeignKey(LoactionMaster, on_delete=models.CASCADE,null=True, blank=True)  
    created_at = models.DateTimeField(auto_now_add=True)  
    updated_at = models.DateTimeField(null=True, blank=True)
    created_by = models.IntegerField()
    updated_by = models.IntegerField()
    class Meta:
        db_table = 'inward_transaction'
        ordering = ['id']
