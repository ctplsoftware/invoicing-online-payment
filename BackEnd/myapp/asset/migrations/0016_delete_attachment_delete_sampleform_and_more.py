# Generated by Django 5.0.6 on 2024-12-17 05:11

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('asset', '0015_orderheader_delivery_address_alter_partmaster_stock'),
    ]

    operations = [
        migrations.DeleteModel(
            name='Attachment',
        ),
        migrations.DeleteModel(
            name='SampleForm',
        ),
        migrations.AlterField(
            model_name='customermaster',
            name='created_by',
            field=models.IntegerField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='customermaster',
            name='updated_by',
            field=models.IntegerField(blank=True, null=True),
        ),
    ]
