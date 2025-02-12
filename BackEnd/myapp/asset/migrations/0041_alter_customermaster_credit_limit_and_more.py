# Generated by Django 4.2.2 on 2025-02-12 06:39

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('asset', '0040_alter_partmaster_allocated_stock'),
    ]

    operations = [
        migrations.AlterField(
            model_name='customermaster',
            name='credit_limit',
            field=models.FloatField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='customermaster',
            name='used_limit',
            field=models.FloatField(blank=True, default=0, null=True),
        ),
    ]
