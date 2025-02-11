from django.db import models
from asset.models.PartMasterModel import PartMaster
from asset.models.LocationMasterModel import LoactionMaster


class InwardHeader(models.Model):
    part_master = models.ForeignKey(PartMaster, on_delete = models.CASCADE, null = True)
    location_master = models.ForeignKey(LoactionMaster, on_delete = models.CASCADE, null = True)
    part_name = models.CharField(max_length = 200, null = True)
    total_quantity = models.FloatField(null = True)
    created_at = models.DateTimeField(auto_now_add=True)  
    updated_at = models.DateTimeField(null=True, blank=True)
    created_by = models.IntegerField(null = True)
    updated_by = models.IntegerField(null = True)
    
    class Meta:
        db_table = 'inward_header'
        ordering = ['id']
