# Generated by Django 5.0.6 on 2024-12-17 05:39

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('asset', '0017_alter_partmaster_created_by_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='loactionmaster',
            name='created_by',
            field=models.IntegerField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='loactionmaster',
            name='updated_by',
            field=models.IntegerField(blank=True, null=True),
        ),
    ]