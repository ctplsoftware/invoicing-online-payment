from django.db import models
from django.contrib.auth.hashers import make_password

class UserMaster(models.Model):
    USER_TYPE_CHOICES = [
        ('staff', 'Internal'),
        ('customer', 'Customer'),
    ]
    username = models.CharField(max_length=255, unique=True)
    password = models.CharField(max_length=255)  
    email = models.EmailField(unique=True)
    is_staff = models.CharField(max_length=10, choices=USER_TYPE_CHOICES, default='customer')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    created_by = models.IntegerField()
    updated_by = models.IntegerField()

    def save(self, *args, **kwargs):
        # Ensure password is hashed before saving
        if not self.pk and not self.password.startswith('pbkdf2_'):  # Check if it's already hashed
            self.password = make_password(self.password)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.username
