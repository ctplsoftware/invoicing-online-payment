from django.db import models

class InwardTransaction(models.Model):
    id = models.AutoField(primary_key=True)
    part_master_id = models.ForeignKey('PartMaster', on_delete=models.CASCADE, related_name='inward_transactions')
    quantity = models.FloatField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    created_by = models.IntegerField()
    updated_by = models.IntegerField()

    class Meta:
        db_table = 'inward_transaction'
        ordering = ['id']
