from django.db import models
from asset.models.EInvoiceHeaderModel import EInvoiceHeader

class EInvoiceTransaction(models.Model):
    e_invoice_header = models.ForeignKey(EInvoiceHeader, on_delete = models.CASCADE)
    Version = models.CharField(max_length = 200, null = True)
    TranDtls = models.JSONField(null = True)
    DocDtls = models.JSONField(null = True)
    SellerDtls = models.JSONField(null = True)
    BuyerDtls = models.JSONField(null = True)
    ItemList = models.JSONField(null = True)
    ValDtls = models.JSONField(null = True)
    PayDtls = models.JSONField(null = True)
    RefDtls = models.JSONField(null = True)
    AddlDocDtls = models.JSONField(null = True)
    ExpDtls = models.JSONField(null = True)
    EwbDtls = models.JSONField(null = True)
    status = models.CharField(max_length = 50, null = True)
    created_by = models.IntegerField(null = True)
    updated_by = models.IntegerField(null = True)
    created_at = models.DateTimeField(auto_now_add = True, null = True)
    updated_at = models.DateTimeField(auto_now = True, null = True)

    class Meta:
        db_table = 'e_invoice_transaction'
        ordering = ['-id']