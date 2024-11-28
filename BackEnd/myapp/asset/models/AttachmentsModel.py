from django.db import models

class Attachment(models.Model):
    file = models.FileField(upload_to='attachments/')  # Path relative to `MEDIA_ROOT`
    uploaded_at = models.DateTimeField(auto_now_add=True)
    uploaded_by = models.CharField(max_length=55, null=True, blank=True)

    def __str__(self):
        return self.file.name
    
