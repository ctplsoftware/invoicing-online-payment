# Generated by Django 5.0.6 on 2024-12-17 05:28

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('asset', '0016_delete_attachment_delete_sampleform_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='partmaster',
            name='created_by',
            field=models.IntegerField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='partmaster',
            name='updated_by',
            field=models.IntegerField(blank=True, null=True),
        ),
    ]
