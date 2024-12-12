from django.db.models import DateField
from django.db.models import Model
from datetime import date
from django.db.models.functions import Cast



def get_count(model: Model) -> int:
    return model.objects.annotate(date_created = Cast('ordered_at', DateField())).filter(date_created = date.today()).count()