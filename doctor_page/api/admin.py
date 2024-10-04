
# Register the Doctor and Patient models
from django.contrib import admin
from .models import Doctor, Patient, Appointment

admin.site.register(Doctor)
admin.site.register(Patient)
admin.site.register(Appointment)
