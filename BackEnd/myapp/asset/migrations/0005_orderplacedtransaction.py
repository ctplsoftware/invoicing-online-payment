# Generated by Django 5.0.6 on 2024-11-26 09:37

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('asset', '0004_ordertransaction_uom'),
    ]

    operations = [
        migrations.CreateModel(
            name='OrderPlacedTransaction',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('order_no', models.CharField(blank=True, max_length=255, null=True)),
                ('transaction_id', models.IntegerField(blank=True, null=True)),
                ('user_id', models.IntegerField(blank=True, null=True)),
            ],
        ),
    ]