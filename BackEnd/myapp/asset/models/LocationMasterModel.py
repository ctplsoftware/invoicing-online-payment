from django.db import models

class LoactionMaster(models.Model):
    name = models.CharField(max_length=255, null=True, blank=True)
    status = models.CharField(max_length=200)
    location_address = models.CharField(max_length=200)
    created_at = models.DateTimeField(auto_now_add=True)  
    updated_at = models.DateTimeField(null=True, blank=True)
    created_by = models.IntegerField()
    updated_by = models.IntegerField()

    class Meta:
        db_table = 'location_master'
        ordering = ['id']

