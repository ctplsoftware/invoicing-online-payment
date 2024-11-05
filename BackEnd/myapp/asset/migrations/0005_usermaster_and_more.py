# Generated by Django 5.0.6 on 2024-11-04 07:14

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('asset', '0004_alter_customermaster_credit_limit'),
    ]

    operations = [
        migrations.CreateModel(
            name='UserMaster',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('username', models.CharField(max_length=255, unique=True)),
                ('password', models.CharField(max_length=255)),
                ('email', models.EmailField(max_length=254, unique=True)),
                ('is_staff', models.CharField(choices=[('staff', 'Internal'), ('customer', 'Customer')], default='customer', max_length=10)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('created_by', models.IntegerField()),
                ('updated_by', models.IntegerField()),
            ],
        ),
        migrations.RenameField(
            model_name='customermaster',
            old_name='secondary_address',
            new_name='additional_address1',
        ),
        migrations.RemoveField(
            model_name='customermaster',
            name='primary_address',
        ),
        migrations.AddField(
            model_name='customermaster',
            name='additional_address2',
            field=models.CharField(blank=True, max_length=255, null=True),
        ),
        migrations.AddField(
            model_name='customermaster',
            name='billing_address',
            field=models.CharField(blank=True, max_length=255, null=True),
        ),
        migrations.AddField(
            model_name='customermaster',
            name='company_address',
            field=models.CharField(blank=True, max_length=255, null=True),
        ),
        migrations.AddField(
            model_name='customermaster',
            name='gstin_number',
            field=models.CharField(default='', max_length=250),
        ),
    ]
