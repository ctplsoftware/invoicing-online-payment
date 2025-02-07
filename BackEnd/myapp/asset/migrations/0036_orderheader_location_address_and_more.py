# Generated by Django 4.2.2 on 2025-02-05 11:40

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('asset', '0035_einvoiceheader_status_einvoicetransaction_status_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='orderheader',
            name='location_address',
            field=models.CharField(max_length=200, null=True),
        ),
        migrations.AddField(
            model_name='orderheader',
            name='location_master',
            field=models.ForeignKey(default=1, on_delete=django.db.models.deletion.CASCADE, to='asset.loactionmaster'),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='orderheader',
            name='location_name',
            field=models.CharField(max_length=200, null=True),
        ),
    ]
