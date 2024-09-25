from django.db import migrations

def fix_duplicate_users(apps, schema_editor):
    Patient = apps.get_model("api", "Patient")
    User = apps.get_model("auth", "User")

    for patient in Patient.objects.all():
        if Patient.objects.filter(user=patient.user).count() > 1:
            patient.user = None  # Remove the user for duplicate entries
            patient.save()

class Migration(migrations.Migration):

    dependencies = [
        ('api', '0004_auto'),
    ]

    operations = [
        migrations.RunPython(fix_duplicate_users),
    ]
