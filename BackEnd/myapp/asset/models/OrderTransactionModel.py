from django.db import models
from asset.models.PartMasterModel import PartMaster


class OrderTransaction(models.Model):
    order_no = models.CharField(max_length=255,null=True, blank=True)
    status = models.CharField(max_length=255,null=True, blank=True)
    customer_name = models.CharField(max_length=255,null=True, blank=True)
    payment_type = models.CharField(max_length=255,null=True, blank=True)
    part = models.ForeignKey(PartMaster, on_delete=models.CASCADE,null=True, blank=True)  # Updated `part_id` to `part` for better readability
    quantity = models.IntegerField(null=True, blank=True)
    unit_price = models.DecimalField(max_digits=10, decimal_places=2,null=True, blank=True)  # Increased max_digits for larger prices
    amount_for_qty = models.DecimalField(max_digits=12, decimal_places=2 ,null=True, blank=True)  # Increased max_digits for larger values
    tax_percentage = models.DecimalField(max_digits=5, decimal_places=2,null=True, blank=True)  # Reduced to a more reasonable range (e.g., 100.00%)
    total_amount = models.DecimalField(max_digits=12, decimal_places=2,null=True, blank=True)  # Increased max_digits for larger values
    transaction_id = models.CharField(max_length=255,null=True, blank=True)  # Increased length to allow longer transaction IDs
    invoice_no = models.CharField(max_length=255,null=True, blank=True)
    delivery_address = models.CharField(max_length=255,null=True, blank=True)
    uom = models.CharField(max_length=255,null=True, blank=True)



    created_at = models.DateTimeField(auto_now_add=True)  
    updated_at = models.DateTimeField(null=True, blank=True)
    created_by = models.IntegerField()
    updated_by = models.IntegerField(null=True, blank=True)  # Allow null/blank for updated_by initially

    class Meta:
        db_table = 'order_transaction'  # Set custom table name if needed
        verbose_name = 'Order Transaction'
        verbose_name_plural = 'Order Transactions'

    def __str__(self):
        return f"OrderTransaction({self.order_no})"
