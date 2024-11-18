from django.contrib.auth.models import User
from django.db import models

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)  # link to User model
    roleid = models.IntegerField(null=True, blank=True)  # or ForeignKey to Role model
    customerid = models.IntegerField(null=True, blank=True)  # or ForeignKey to Customer model
    status = models.CharField(max_length=50)


