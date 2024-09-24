
# Create your models here.
from django.db import models
from django.contrib.auth.models import User

# Doctor model that extends the default User model
class Doctor(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    specialization = models.CharField(max_length=100)

    def __str__(self):
        return f"Dr. {self.user.username} ({self.specialization})"

# Patient model with basic details
class Patient(models.Model):
    name = models.CharField(max_length=100)
    age = models.IntegerField()
    medical_history = models.TextField()
    doctor = models.ForeignKey(Doctor, on_delete=models.CASCADE)

    def __str__(self):
        return self.name
