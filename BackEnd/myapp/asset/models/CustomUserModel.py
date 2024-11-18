from django.contrib.auth.models import AbstractUser
from django.db import models

class CustomUser(AbstractUser):
    roleid = models.IntegerField(null=True, blank=True)  # or ForeignKey to Role model
    customerid = models.IntegerField(null=True, blank=True)  
    status = models.CharField(max_length=10, choices=[('active', 'Active'), ('inactive', 'Inactive')], default='active')

    def __str__(self):
        return self.username
