from django.db import models

class CustomerMaster(models.Model):
    STATUS_CHOICES = [
        ('active', 'Active'),
        ('inactive', 'Inactive'),
    ]

    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255)
    gstin_number = models.CharField(max_length=250, default="")
    
    
    

    billing_address = models.CharField(max_length=255, null=True, blank=True)
    billing_address_state = models.CharField(max_length = 100, null = True, blank = True)
    billing_address_city = models.CharField(max_length = 100, null = True, blank = True)
    billing_address_state_code = models.CharField(max_length = 100, null = True, blank = True)

    delivery_address = models.CharField(max_length=255, null=True, blank=True)
    delivery_address_state = models.CharField(max_length = 100, null = True, blank = True)
    delivery_address_city = models.CharField(max_length = 100, null = True, blank = True)
    delivery_address_state_code = models.CharField(max_length = 100, null = True, blank = True)

    additional_address1 = models.CharField(max_length=255, null=True, blank=True)
    additional_address1_state = models.CharField(max_length = 100, null = True, blank = True)
    additional_address1_city = models.CharField(max_length = 100, null = True, blank = True)
    additional_address1_state_code = models.CharField(max_length = 100, null = True, blank = True)

    additional_address2 = models.CharField(max_length=255, null=True, blank=True)
    additional_address2_state = models.CharField(max_length = 100, null = True, blank = True)
    additional_address2_city = models.CharField(max_length = 100, null = True, blank = True)
    additional_address2_state_code = models.CharField(max_length = 100, null = True, blank = True)


    TradeName = models.CharField(max_length= 255, null = True)
    LegalName = models.CharField(max_length= 255, null = True)
    AddrBnm = models.CharField(max_length= 255, null = True)
    AddrBno = models.CharField(max_length= 255, null = True)
    AddrFlno = models.CharField(max_length= 255, null = True)
    AddrSt = models.CharField(max_length= 255, null = True)
    StateCode = models.CharField(max_length= 255, null = True)
    AddrPncd = models.CharField(max_length= 255, null = True)
    TaxType = models.CharField(max_length= 255, null = True)
    CustomerStatus = models.CharField(max_length= 255, null = True)
    BlkStatus = models.CharField(max_length= 255, null = True)



    credit_limit = models.FloatField(null=True, blank=True)
    used_limit = models.FloatField(null=True, blank=True ,default=0)
    credit_days = models.CharField(max_length=50, blank=True, null=True)
    contact_person = models.CharField(max_length=255)
    contact_number = models.CharField(max_length=50)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES)
    created_at = models.DateTimeField(auto_now_add=True)  
    updated_at = models.DateTimeField(null=True, blank=True)
    created_by = models.IntegerField(blank=True, null=True)
    updated_by = models.IntegerField(blank=True, null=True)

    class Meta:
        db_table = 'customer_master'
        ordering = ['id']
