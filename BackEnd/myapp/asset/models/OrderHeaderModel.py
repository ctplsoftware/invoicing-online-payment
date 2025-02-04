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
    delivery_address_city = models.CharField(max_length = 200, null = True)
    delivery_address_state = models.CharField(max_length = 200, null = True)
    delivery_address_state_code = models.IntegerField(null = True)
    uom = models.CharField(max_length = 200, null = True, blank = True)
    quantity = models.FloatField()
    unit_price = models.FloatField()
    tax_percentage = models.FloatField()

   

    igst_percentage = models.FloatField(null = True)
    cgst_percentage = models.FloatField(null = True)
    sgst_percentage = models.FloatField(null = True)

    customer_name = models.CharField(max_length = 200, null = True, blank = True)
    amount_for_quantity = models.FloatField()

    total_tax_amount = models.FloatField(null = True)
    igst_amount = models.FloatField(null = True)
    cgst_amount = models.FloatField(null = True)
    sgst_amount = models.FloatField(null = True)
    
    total_amount = models.FloatField(null = True)
    paid_amount = models.FloatField(null = True)

    delivery_note = models.CharField(max_length = 200, null = True)
    other_references = models.CharField(max_length = 200, null = True)
    buyer_order_number = models.CharField(max_length = 200, null = True)
    buyer_order_date = models.CharField(max_length = 200, null = True)
    dispatch_document_number = models.CharField(max_length = 200, null = True)
    delivery_note_date = models.CharField(max_length = 200, null = True)
    dispatched_through = models.CharField(max_length = 200, null = True)
    terms_of_delivery = models.CharField(max_length = 200, null = True)





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


    
