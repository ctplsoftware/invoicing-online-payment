from django.db.models import DateField
from django.db.models import Model
from datetime import date
from django.db.models.functions import Cast
import datetime



def base33():
    today = datetime.date.today()
    number = today.timetuple().tm_yday

    digits = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    converted_number = ""

    while number > 0:
        remainder = number % 33 
        converted_number = digits[remainder] + converted_number
        number = number // 33

    if len(converted_number) == 1:
        converted_number = f'0{converted_number}'

    return converted_number


def get_count_requestid(model: Model) -> int:
    return model.objects.annotate(date_created = Cast('created_at', DateField())).filter(date_created = date.today()).count()

def get_count(model: Model) -> int:
    return model.objects.annotate(date_created = Cast('ordered_at', DateField())).filter(date_created = date.today()).count()