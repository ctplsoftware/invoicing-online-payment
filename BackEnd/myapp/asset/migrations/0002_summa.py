# Generated by Django 5.0.6 on 2024-11-13 08:07

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('asset', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='summa',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('name', models.CharField(max_length=255)),
                ('gstin_number', models.CharField(default='', max_length=250)),
                ('delivery_address', models.CharField(blank=True, max_length=255, null=True)),
            ],
        ),
    ]
