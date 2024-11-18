from django.db import models

class summa(models.Model):

    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255)
    gstin_number = models.CharField(max_length=250, default="")
    delivery_address = models.CharField(max_length=255, null=True, blank=True)
 