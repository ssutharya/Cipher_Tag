from django.db import models
from django.contrib.auth.models import User

class Doctor(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    name = models.CharField(max_length=255, default="Unnamed Doctor")
    specialization = models.CharField(max_length=255, default="General")
    available = models.BooleanField(default=True)
    def __str__(self):
        return f"Dr. {self.name}"



class Patient(models.Model):
    SEX_CHOICES = [
        ('male', 'Male'),
        ('female', 'Female'),
        ('other', 'Other'),
    ]

    user = models.OneToOneField(User, on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    age = models.IntegerField()
    sex = models.CharField(max_length=10, choices=SEX_CHOICES)  # Updated to include choices
    height = models.FloatField(null=True, blank=True)
    weight = models.FloatField(null=True, blank=True)
    medical_history = models.TextField(blank=True, null=True)
    registered_by_hospital = models.BooleanField(default=False)

    def __str__(self):
        return self.name



class Appointment(models.Model):
    doctor = models.ForeignKey(Doctor, on_delete=models.CASCADE)
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE)
    appointment_date = models.DateTimeField()
    fee_paid = models.BooleanField(default=False)

    def __str__(self):
        return f"Appointment with Dr. {self.doctor.name} on {self.appointment_date}"
