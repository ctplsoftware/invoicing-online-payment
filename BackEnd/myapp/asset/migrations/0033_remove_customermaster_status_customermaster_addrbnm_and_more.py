# Generated by Django 4.2.2 on 2025-02-03 10:36

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('asset', '0032_orderheader_delivery_address_city_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='customermaster',
            name='AddrBnm',
            field=models.CharField(max_length=255, null=True),
        ),
        migrations.AddField(
            model_name='customermaster',
            name='AddrBno',
            field=models.CharField(max_length=255, null=True),
        ),
        migrations.AddField(
            model_name='customermaster',
            name='AddrFlno',
            field=models.CharField(max_length=255, null=True),
        ),
        migrations.AddField(
            model_name='customermaster',
            name='AddrPncd',
            field=models.CharField(max_length=255, null=True),
        ),
        migrations.AddField(
            model_name='customermaster',
            name='AddrSt',
            field=models.CharField(max_length=255, null=True),
        ),
        migrations.AddField(
            model_name='customermaster',
            name='BlkStatus',
            field=models.CharField(max_length=255, null=True),
        ),
        migrations.AddField(
            model_name='customermaster',
            name='CustomerStatus',
            field=models.CharField(max_length=255, null=True),
        ),
        migrations.AddField(
            model_name='customermaster',
            name='LegalName',
            field=models.CharField(max_length=255, null=True),
        ),
        migrations.AddField(
            model_name='customermaster',
            name='StateCode',
            field=models.CharField(max_length=255, null=True),
        ),
        migrations.AddField(
            model_name='customermaster',
            name='TaxType',
            field=models.CharField(max_length=255, null=True),
        ),
        migrations.AddField(
            model_name='customermaster',
            name='TradeName',
            field=models.CharField(max_length=255, null=True),
        ),
    ]
