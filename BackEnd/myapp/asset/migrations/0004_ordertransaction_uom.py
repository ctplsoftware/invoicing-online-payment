# Generated by Django 5.0.6 on 2024-11-26 07:09

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('asset', '0003_ordertransaction_delivery_address'),
    ]

    operations = [
        migrations.AddField(
            model_name='ordertransaction',
            name='uom',
            field=models.CharField(blank=True, max_length=255, null=True),
        ),
    ]
