from django.contrib import admin
from .models import Doctor, Patient

# Register the Doctor and Patient models
admin.site.register(Doctor)
admin.site.register(Patient)
