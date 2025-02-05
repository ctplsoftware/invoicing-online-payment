# Generated by Django 4.2.2 on 2025-02-01 09:48

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('asset', '0029_partmaster_hsn_code'),
    ]

    operations = [
        migrations.AddField(
            model_name='customermaster',
            name='additional_address1_city',
            field=models.CharField(blank=True, max_length=100, null=True),
        ),
        migrations.AddField(
            model_name='customermaster',
            name='additional_address1_state',
            field=models.CharField(blank=True, max_length=100, null=True),
        ),
        migrations.AddField(
            model_name='customermaster',
            name='additional_address1_state_code',
            field=models.CharField(blank=True, max_length=100, null=True),
        ),
        migrations.AddField(
            model_name='customermaster',
            name='additional_address2_city',
            field=models.CharField(blank=True, max_length=100, null=True),
        ),
        migrations.AddField(
            model_name='customermaster',
            name='additional_address2_state',
            field=models.CharField(blank=True, max_length=100, null=True),
        ),
        migrations.AddField(
            model_name='customermaster',
            name='additional_address2_state_code',
            field=models.CharField(blank=True, max_length=100, null=True),
        ),
        migrations.AddField(
            model_name='customermaster',
            name='billing_address_city',
            field=models.CharField(blank=True, max_length=100, null=True),
        ),
        migrations.AddField(
            model_name='customermaster',
            name='billing_address_state',
            field=models.CharField(blank=True, max_length=100, null=True),
        ),
        migrations.AddField(
            model_name='customermaster',
            name='billing_address_state_code',
            field=models.CharField(blank=True, max_length=100, null=True),
        ),
        migrations.AddField(
            model_name='customermaster',
            name='delivery_address_city',
            field=models.CharField(blank=True, max_length=100, null=True),
        ),
        migrations.AddField(
            model_name='customermaster',
            name='delivery_address_state',
            field=models.CharField(blank=True, max_length=100, null=True),
        ),
        migrations.AddField(
            model_name='customermaster',
            name='delivery_address_state_code',
            field=models.CharField(blank=True, max_length=100, null=True),
        ),
    ]
