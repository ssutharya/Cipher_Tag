from django.shortcuts import render

# Create your views here.
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import authenticate
from .models import Doctor, Patient
from .serializers import PatientSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import SessionAuthentication, BasicAuthentication

# Login view for doctors
@api_view(['POST'])
def doctor_login(request):
    username = request.data.get('username')
    password = request.data.get('password')

    # Authenticate the user
    user = authenticate(username=username, password=password)
    if user is not None:
        try:
            # Check if the user is a doctor
            doctor = Doctor.objects.get(user=user)
            return Response({"message": "Login successful", "doctor_id": doctor.id})
        except Doctor.DoesNotExist:
            return Response({"error": "User is not a doctor"}, status=status.HTTP_403_FORBIDDEN)
    else:
        return Response({"error": "Invalid credentials"}, status=status.HTTP_400_BAD_REQUEST)

# Patient list view (for authenticated doctors)
@api_view(['GET'])
def patient_list(request):
    authentication_classes = [SessionAuthentication, BasicAuthentication]
    permission_classes = [IsAuthenticated]

    # Get the logged-in doctor's patients
    try:
        doctor = Doctor.objects.get(user=request.user)
        patients = Patient.objects.filter(doctor=doctor)
        serializer = PatientSerializer(patients, many=True)
        return Response(serializer.data)
    except Doctor.DoesNotExist:
        return Response({"error": "Doctor not found"}, status=status.HTTP_404_NOT_FOUND)
