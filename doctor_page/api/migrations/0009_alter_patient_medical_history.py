# Generated by Django 5.1.1 on 2024-09-26 06:59

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("api", "0008_remove_doctor_appointment_fee_and_more"),
    ]

    operations = [
        migrations.AlterField(
            model_name="patient",
            name="medical_history",
            field=models.TextField(blank=True, null=True),
        ),
    ]
