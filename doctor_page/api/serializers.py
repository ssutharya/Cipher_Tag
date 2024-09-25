from rest_framework import serializers
from .models import Doctor, Patient, Appointment
from django.contrib.auth.models import User


# User serializer (for authentication and user info)
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email']


# Doctor serializer for handling doctor data
class DoctorSerializer(serializers.ModelSerializer):
    user = UserSerializer()

    class Meta:
        model = Doctor
        fields = ['id', 'user', 'specialty', 'appointment_fee', 'available']


# Patient serializer for handling patient data
class PatientSerializer(serializers.ModelSerializer):
    user = UserSerializer()

    class Meta:
        model = Patient
        fields = ['id', 'user', 'name', 'age', 'sex', 'height', 'weight', 'medical_history', 'doctor', 'registered_by_hospital']


# Appointment serializer for handling appointment data
class AppointmentSerializer(serializers.ModelSerializer):
    doctor = DoctorSerializer()
    patient = PatientSerializer()

    class Meta:
        model = Appointment
        fields = ['id', 'doctor', 'patient', 'appointment_date', 'fee_paid']
