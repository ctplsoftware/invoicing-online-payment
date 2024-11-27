from django.db import models

class OrderPlacedTransaction(models.Model):
        order_no = models.CharField(max_length=255,null=True, blank=True)
        transaction_id = models.IntegerField(null=True, blank=True) 
        user_id = models.IntegerField(null=True, blank=True) 
        created_at = models.DateTimeField(auto_now_add=True,null=True, blank=True)  
        updated_at = models.DateTimeField(null=True, blank=True)
        created_by = models.IntegerField(null=True, blank=True)
        updated_by = models.IntegerField(null=True, blank=True)



    
