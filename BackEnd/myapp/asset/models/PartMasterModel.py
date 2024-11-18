from django.db import models

class PartMaster(models.Model):
    part_description = models.CharField(max_length=255)
    status = models.CharField(max_length=50)
    unit_price = models.FloatField()
    uom = models.CharField(max_length=100,null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)  
    updated_at = models.DateTimeField(null=True, blank=True)
    created_by = models.IntegerField()
    updated_by = models.IntegerField()

    class Meta:
        db_table = 'part_master'
        ordering = ['id']
