# Generated by Django 4.2 on 2024-12-12 06:29

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('asset', '0011_ordertransaction_customer_name'),
    ]

    operations = [
        migrations.CreateModel(
            name='OrderAttachmentTransaction',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('attached_image', models.FileField(upload_to='attachments/')),
                ('attached_at', models.DateTimeField(auto_now_add=True, null=True)),
                ('attached_by', models.IntegerField()),
                ('verified_at', models.DateTimeField(null=True)),
                ('verified_by', models.IntegerField()),
            ],
            options={
                'db_table': 'order_attachment_transaction',
                'ordering': ['id'],
            },
        ),
        migrations.CreateModel(
            name='OrderHeader',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('order_number', models.CharField(blank=True, max_length=100, null=True)),
                ('payment_type', models.CharField(blank=True, max_length=20, null=True)),
                ('part_name', models.CharField(blank=True, max_length=200, null=True)),
                ('uom', models.CharField(blank=True, max_length=200, null=True)),
                ('quantity', models.FloatField()),
                ('unit_price', models.FloatField()),
                ('tax_percentage', models.FloatField()),
                ('customer_name', models.CharField(blank=True, max_length=200, null=True)),
                ('amount_for_quantity', models.FloatField()),
                ('total_amount', models.FloatField()),
                ('paid_amount', models.FloatField()),
                ('irn_invoice_number', models.CharField(blank=True, max_length=255, null=True)),
                ('attached_status', models.CharField(default='no', max_length=10)),
                ('verified_status', models.CharField(default='no', max_length=10)),
                ('invoice_generated_status', models.CharField(default='no', max_length=10)),
                ('dispatched_status', models.CharField(default='no', max_length=10)),
                ('paid_status', models.CharField(default='no', max_length=10)),
                ('completed_status', models.CharField(default='no', max_length=10)),
                ('ordered_at', models.DateTimeField(auto_now_add=True, null=True)),
                ('ordered_by', models.IntegerField()),
                ('invoice_at', models.DateTimeField(null=True)),
                ('invoice_by', models.IntegerField()),
                ('dispatch_at', models.DateTimeField(null=True)),
                ('dispatch_by', models.IntegerField()),
                ('customer_master', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='asset.customermaster')),
            ],
            options={
                'db_table': 'order_header',
                'ordering': ['id'],
            },
        ),
        migrations.DeleteModel(
            name='OrderPlacedTransaction',
        ),
        migrations.AlterModelOptions(
            name='loactionmaster',
            options={'ordering': ['id']},
        ),
        migrations.AlterModelOptions(
            name='ordertransaction',
            options={'ordering': ['id']},
        ),
        migrations.AlterModelOptions(
            name='usermaster',
            options={'ordering': ['id']},
        ),
        migrations.RemoveField(
            model_name='ordertransaction',
            name='amount_for_qty',
        ),
        migrations.RemoveField(
            model_name='ordertransaction',
            name='customer_name',
        ),
        migrations.RemoveField(
            model_name='ordertransaction',
            name='delivery_address',
        ),
        migrations.RemoveField(
            model_name='ordertransaction',
            name='invoice_no',
        ),
        migrations.RemoveField(
            model_name='ordertransaction',
            name='order_no',
        ),
        migrations.RemoveField(
            model_name='ordertransaction',
            name='part',
        ),
        migrations.RemoveField(
            model_name='ordertransaction',
            name='payment_type',
        ),
        migrations.RemoveField(
            model_name='ordertransaction',
            name='quantity',
        ),
        migrations.RemoveField(
            model_name='ordertransaction',
            name='status',
        ),
        migrations.RemoveField(
            model_name='ordertransaction',
            name='tax_percentage',
        ),
        migrations.RemoveField(
            model_name='ordertransaction',
            name='total_amount',
        ),
        migrations.RemoveField(
            model_name='ordertransaction',
            name='transaction_id',
        ),
        migrations.RemoveField(
            model_name='ordertransaction',
            name='unit_price',
        ),
        migrations.RemoveField(
            model_name='ordertransaction',
            name='uom',
        ),
        migrations.AddField(
            model_name='ordertransaction',
            name='payment_amount',
            field=models.FloatField(default=1),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='ordertransaction',
            name='payment_comments',
            field=models.CharField(max_length=200, null=True),
        ),
        migrations.AddField(
            model_name='ordertransaction',
            name='payment_date',
            field=models.CharField(max_length=200, null=True),
        ),
        migrations.AddField(
            model_name='partmaster',
            name='allocated_stock',
            field=models.CharField(blank=True, max_length=255, null=True),
        ),
        migrations.AddField(
            model_name='partmaster',
            name='stock',
            field=models.CharField(blank=True, max_length=255, null=True),
        ),
        migrations.AlterField(
            model_name='ordertransaction',
            name='created_at',
            field=models.DateTimeField(auto_now_add=True, null=True),
        ),
        migrations.AlterField(
            model_name='ordertransaction',
            name='updated_at',
            field=models.DateTimeField(auto_now=True, null=True),
        ),
        migrations.AlterField(
            model_name='ordertransaction',
            name='updated_by',
            field=models.IntegerField(default=1),
            preserve_default=False,
        ),
        migrations.AlterModelTable(
            name='loactionmaster',
            table='location_master',
        ),
        migrations.AlterModelTable(
            name='usermaster',
            table='user_master',
        ),
        migrations.DeleteModel(
            name='OrderTransactionImage',
        ),
        migrations.AddField(
            model_name='orderheader',
            name='part_master',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='asset.partmaster'),
        ),
        migrations.AddField(
            model_name='orderattachmenttransaction',
            name='order_header',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='asset.orderheader'),
        ),
        migrations.AddField(
            model_name='ordertransaction',
            name='order_header',
            field=models.ForeignKey(default=1, on_delete=django.db.models.deletion.CASCADE, to='asset.orderheader'),
            preserve_default=False,
        ),
    ]
