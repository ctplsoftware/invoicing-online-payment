from django.db import models
from asset.models.EInvoiceHeaderModel import EInvoiceHeader

class EInvoiceTransaction(models.Model):
    e_invoice_header = models.ForeignKey(EInvoiceHeader, on_delete = models.CASCADE)
    Version = models.CharField(max_length = 200, null = True)
    TranDtls = models.JSONField()
    DocDtls = models.JSONField()
    SellerDtls = models.JSONField()
    BuyerDtls = models.JSONField()
    ItemList = models.JSONField()
    ValDtls = models.JSONField()
    PayDtls = models.JSONField()
    RefDtls = models.JSONField()
    AddlDocDtls = models.JSONField()
    ExpDtls = models.JSONField()
    EwbDtls = models.JSONField()
    created_by = models.IntegerField(null = True)
    updated_by = models.IntegerField(null = True)
    created_at = models.DateTimeField(auto_now_add = True, null = True)
    updated_at = models.DateTimeField(auto_now = True, null = True)

    class Meta:
        db_table = 'e_invoice_transaction'
        ordering = ['-id']