from django.db import models
from django.contrib.auth.models import User

# Doctor model with appointment fee and availability status
class Doctor(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    specialty = models.CharField(max_length=100, default='General')  # Default to 'General' for specialty
    appointment_fee = models.DecimalField(max_digits=10, decimal_places=2, default=500.00)  # Default appointment fee
    available = models.BooleanField(default=True)  # Doctor availability default set to True

    def __str__(self):
        return f"Dr. {self.user.username} - {self.specialty}"


# Patient model with personal details and doctor assignment
class Patient(models.Model):
    SEX_CHOICES = [
        ('M', 'Male'),
        ('F', 'Female'),
        ('O', 'Other'),
    ]

    user = models.OneToOneField(User, on_delete=models.CASCADE)

    name = models.CharField(max_length=100)
    age = models.IntegerField()
    sex = models.CharField(max_length=1, choices=SEX_CHOICES, default='not specified')  # Default sex to 'Other'
    height = models.FloatField(blank=True, null=True)  # Optional height
    weight = models.FloatField(blank=True, null=True)  # Optional weight
    medical_history = models.TextField(blank=True, null=True)  # Optional medical history
    registered_by_hospital = models.BooleanField(default=False)  # Default set to False
    doctor = models.ForeignKey(Doctor, on_delete=models.SET_NULL, null=True, blank=True)  # Assigned doctor can be null

    def __str__(self):
        return f"{self.name} (Patient)"


# Appointment model to handle appointments between doctors and patients
class Appointment(models.Model):
    doctor = models.ForeignKey(Doctor, on_delete=models.CASCADE)
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE)
    appointment_date = models.DateTimeField()
    fee_paid = models.BooleanField(default=False)  # Default to False (fee unpaid)

    def __str__(self):
        return f"Appointment with Dr. {self.doctor.user.username} for {self.patient.name} on {self.appointment_date}"


# Hospital Admin model to manage hospital resources
class HospitalAdmin(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)

    def __str__(self):
        return f"Admin {self.user.username}"
