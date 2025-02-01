# Generated by Django 4.2.2 on 2025-01-07 09:17

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('asset', '0025_remove_customermaster_balance_limit_and_more'),
    ]

    operations = [
        migrations.CreateModel(
            name='EInvoiceHeader',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('request_id', models.CharField(max_length=200, null=True)),
                ('AckNo', models.CharField(max_length=200, null=True)),
                ('AckDt', models.DateTimeField(null=True)),
                ('Irn', models.CharField(max_length=200, null=True)),
                ('SignedInvoice', models.TextField(null=True)),
                ('SignedQRCode', models.TextField(null=True)),
                ('Status', models.CharField(max_length=50, null=True)),
                ('EwbNo', models.CharField(max_length=200, null=True)),
                ('EwbDt', models.DateTimeField(null=True)),
                ('EwbValidTill', models.CharField(max_length=200, null=True)),
                ('Remarks', models.TextField(null=True)),
                ('created_by', models.IntegerField(null=True)),
                ('updated_by', models.IntegerField(null=True)),
                ('created_at', models.DateTimeField(auto_now_add=True, null=True)),
                ('updated_at', models.DateTimeField(auto_now=True, null=True)),
                ('order_header', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='asset.orderheader')),
            ],
            options={
                'db_table': 'e_invoice_header',
                'ordering': ['-id'],
            },
        ),
        migrations.CreateModel(
            name='EInvoiceTransaction',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('Version', models.CharField(max_length=200, null=True)),
                ('TranDtls', models.JSONField()),
                ('DocDtls', models.JSONField()),
                ('SellerDtls', models.JSONField()),
                ('BuyerDtls', models.JSONField()),
                ('ValDtls', models.JSONField()),
                ('PayDtls', models.JSONField()),
                ('RefDtls', models.JSONField()),
                ('AddlDocDtls', models.JSONField()),
                ('ExpDtls', models.JSONField()),
                ('EwbDtls', models.JSONField()),
                ('created_by', models.IntegerField(null=True)),
                ('updated_by', models.IntegerField(null=True)),
                ('created_at', models.DateTimeField(auto_now_add=True, null=True)),
                ('updated_at', models.DateTimeField(auto_now=True, null=True)),
                ('e_invoice_header_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='asset.einvoiceheader')),
            ],
            options={
                'db_table': 'e_invoice_transaction',
                'ordering': ['-id'],
            },
        ),
    ]
