# Generated by Django 4.2 on 2024-12-12 08:18

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('asset', '0012_orderattachmenttransaction_orderheader_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='customermaster',
            name='used_limit',
            field=models.DecimalField(blank=True, decimal_places=2, max_digits=10, null=True),
        ),
    ]
