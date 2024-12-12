from django.db import models
from asset.models.PartMasterModel import PartMaster
from asset.models.CustomerMasterModel import CustomerMaster


class OrderHeader(models.Model):
    part_master = models.ForeignKey(PartMaster, on_delete = models.CASCADE)
    customer_master = models.ForeignKey(CustomerMaster, on_delete = models.CASCADE)
    order_number = models.CharField(max_length = 100, null = True, blank = True)
    payment_type = models.CharField(max_length = 20, null = True, blank = True)
    part_name = models.CharField(max_length = 200, null = True, blank = True)
    delivery_address = models.CharField(max_length = 200, null = True, blank = True)
    uom = models.CharField(max_length = 200, null = True, blank = True)
    quantity = models.FloatField()
    unit_price = models.FloatField()
    tax_percentage = models.FloatField()
    customer_name = models.CharField(max_length = 200, null = True, blank = True)
    amount_for_quantity = models.FloatField()
    total_amount = models.FloatField()
    paid_amount = models.FloatField()
    irn_invoice_number = models.CharField(max_length = 255, null = True, blank = True)
    attached_status = models.CharField(max_length = 10, default = 'no')
    verified_status = models.CharField(max_length = 10, default = 'no')
    invoice_generated_status = models.CharField(max_length = 10, default = 'no')
    dispatched_status = models.CharField(max_length = 10, default = 'no')
    paid_status = models.CharField(max_length = 10, default = 'no')
    completed_status = models.CharField(max_length = 10, default = 'no')
    ordered_at = models.DateTimeField(auto_now_add = True, null = True)
    ordered_by = models.IntegerField()
    invoice_at = models.DateTimeField(null = True)
    invoice_by = models.IntegerField(null = True)
    dispatch_at = models.DateTimeField(null = True)
    dispatch_by = models.IntegerField(null = True)

    class Meta:
        db_table = 'order_header'
        ordering = ['id']


    
