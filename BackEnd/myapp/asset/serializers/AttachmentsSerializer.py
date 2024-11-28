from rest_framework import serializers
from ..models.AttachmentsModel import Attachment

class AttachmentsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Attachment
        fields = '__all__' 

