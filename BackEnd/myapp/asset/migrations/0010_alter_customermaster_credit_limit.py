# Generated by Django 5.0.6 on 2024-12-05 06:41

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('asset', '0009_inwardtransaction_locationmaster'),
    ]

    operations = [
        migrations.AlterField(
            model_name='customermaster',
            name='credit_limit',
            field=models.DecimalField(blank=True, decimal_places=2, max_digits=10, null=True),
        ),
    ]