from django.db import models

class PartMaster(models.Model):
    part_name = models.CharField(max_length=255, null=True, blank=True)
    part_description = models.CharField(max_length = 200, null = True)
    status = models.CharField(max_length=50)
    unit_price = models.FloatField()
    stock = models.FloatField(null=True, blank=True,default=0)
    hsn_code = models.CharField(max_length = 100, null = True)
    allocated_stock = models.FloatField(null=True, blank=True)
    uom = models.CharField(max_length=100,null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)  
    updated_at = models.DateTimeField(null=True, blank=True)
    created_by = models.IntegerField(null=True, blank=True)
    updated_by = models.IntegerField(null=True, blank=True)

    class Meta:
        db_table = 'part_master'
        ordering = ['id']
