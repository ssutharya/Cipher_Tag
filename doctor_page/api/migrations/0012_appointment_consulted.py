# Generated by Django 5.1.1 on 2024-10-16 06:56

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("api", "0011_globalmedicine_remove_medicine_category_and_more"),
    ]

    operations = [
        migrations.AddField(
            model_name="appointment",
            name="consulted",
            field=models.BooleanField(default=False),
        ),
    ]
