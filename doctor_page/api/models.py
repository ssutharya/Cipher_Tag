from django.db import models
from django.contrib.auth.models import User
import random
from datetime import datetime

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
    consulted = models.BooleanField(default=False)  # New field to track if the appointment is finished

    def __str__(self):
        return f"Appointment with Dr. {self.doctor.name} on {self.appointment_date}"
  

# class Medicine(models.Model):
#     name = models.CharField(max_length=100)
#     category = models.CharField(max_length=100)  # e.g., Antibiotic, Painkiller
#     company = models.CharField(max_length=100)   # The company that produces it
#     unique_code = models.CharField(max_length=100, unique=True)  # Unique code for tracking
#     doctor = models.ForeignKey(Doctor, on_delete=models.CASCADE, related_name='inventory')

#     def __str__(self):
#         return f"{self.name} ({self.company}) - {self.unique_code}"


class GlobalMedicine(models.Model):
    """
    Managed by the service provider (company), this stores all medicines
    available globally with a unique tracking code.
    """
    name = models.CharField(max_length=100)
    category = models.CharField(max_length=100)  # e.g., Antibiotic, Painkiller
    company = models.CharField(max_length=100)   # The company that produces it
    unique_code = models.CharField(max_length=7, unique=True)  # Generated unique code
    code_confirmed = models.BooleanField(default=False)  # Whether the user has confirmed the code

    def generate_unique_code(self):
        """
        Generate a 7-character unique code based on the name, category, company, and random numbers.
        """
        base_string = f"{self.name[:2].upper()}{self.category[:2].upper()}{self.company[:2].upper()}"
        random_number = random.randint(100, 999)  # Generate a 3-digit random number
        unique_code = f"{base_string}{random_number}"
        
        if len(unique_code) > 7:
            unique_code = unique_code[:7]  # Truncate to make sure it's 7 characters long

        return unique_code

    def __str__(self):
        return f"{self.name} ({self.company}) - {self.unique_code}"

class Medicine(models.Model):
    """
    The medicine available in the doctor's personal inventory, pulled from the global inventory.
    """
    global_medicine = models.ForeignKey(GlobalMedicine, on_delete=models.CASCADE, null= True, blank=True)  # Linked to the company's global list
    doctor = models.ForeignKey(Doctor, on_delete=models.CASCADE, related_name='inventory')

    def __str__(self):
        return f"{self.global_medicine.name} ({self.global_medicine.company}) - {self.global_medicine.unique_code}"    




    


class Prescription(models.Model):
    appointment = models.ForeignKey(Appointment, on_delete=models.CASCADE)
    notes = models.TextField(blank=True, null=True)
    qr_code = models.ImageField(upload_to='qr_codes/', blank=True, null=True)  # QR code storage


class PrescriptionItem(models.Model):
    prescription = models.ForeignKey(Prescription, on_delete=models.CASCADE, related_name='prescription_items')  # Updated related_name
    medicine = models.ForeignKey(Medicine, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)
    remarks = models.TextField(blank=True, null=True)

