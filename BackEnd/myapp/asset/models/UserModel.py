from django.db import models
from django.contrib.auth.models import User, Group, Permission
from django.conf import settings

# class User(models.Model):
#     username = models.CharField(max_length=100)
#     password = models.CharField(max_length=100)

#     def __str__(self):
#         return self.username
    

class UserRolePermission(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    role = models.ForeignKey(Group, on_delete=models.CASCADE)  # Role represented by Group
    permission = models.ForeignKey(Permission, on_delete=models.CASCADE)  # Permission model
    can_create = models.BooleanField(default=False)
    can_read = models.BooleanField(default=False)
    can_update = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.user.username} - {self.role.name} - {self.permission.name}"


