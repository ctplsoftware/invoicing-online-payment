# Generated by Django 5.0.6 on 2024-11-13 07:54

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('asset', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='userprofile',
            name='status',
            field=models.CharField(max_length=50),
        ),
    ]
