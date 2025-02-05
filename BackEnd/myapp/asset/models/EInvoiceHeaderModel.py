from django.db import models
from asset.models.OrderHeaderModel import OrderHeader

class EInvoiceHeader(models.Model):
    order_header = models.ForeignKey(OrderHeader, on_delete = models.CASCADE, null = True)
    request_id = models.CharField(max_length = 200, null = True)
    AckNo = models.CharField(max_length = 200, null = True)
    AckDt = models.DateTimeField(null = True)
    Irn = models.CharField(max_length = 200, null = True)
    SignedInvoice = models.TextField(null = True)
    SignedQRCode = models.TextField(null = True)
    Status = models.CharField(max_length = 50, null = True)
    EwbNo = models.CharField(max_length = 200, null = True)
    EwbDt = models.DateTimeField(null = True)
    EwbValidTill = models.CharField(max_length = 200, null = True)
    Remarks = models.TextField(null = True)
    einvoice_status = models.CharField(max_length = 50, null = True)
    created_by = models.IntegerField(null = True)
    updated_by = models.IntegerField(null = True)
    created_at = models.DateTimeField(auto_now_add = True, null = True)
    updated_at = models.DateTimeField(auto_now = True, null = True)

    class Meta:
        db_table = 'e_invoice_header'
        ordering = ['-id']
    
