# Generated by Django 5.0.6 on 2024-11-26 06:30

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('asset', '0002_alter_ordertransaction_options_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='ordertransaction',
            name='delivery_address',
            field=models.CharField(blank=True, max_length=255, null=True),
        ),
    ]
