from django.db import models

class PartMaster(models.Model):
    id = models.AutoField(primary_key=True)
    part_number = models.CharField(max_length=255)
    part_description = models.CharField(max_length=255)
    status = models.CharField(max_length=50)
    unit_price = models.FloatField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    created_by = models.IntegerField()
    updated_by = models.IntegerField()

    class Meta:
        db_table = 'part_master'
        ordering = ['id']
