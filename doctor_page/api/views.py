from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAdminUser, IsAuthenticated
from .models import Doctor, Patient, Appointment
from .serializers import DoctorSerializer, PatientSerializer, AppointmentSerializer
from django.contrib.auth.models import User

from rest_framework.permissions import AllowAny

@api_view(['GET'])
@permission_classes([AllowAny])  # This allows access without authentication
def list_available_doctors(request):
    doctors = Doctor.objects.filter(available=True)
    serializer = DoctorSerializer(doctors, many=True)
    return Response(serializer.data)


# Register a new patient
@api_view(['POST'])
def register_patient(request):
    data = request.data

    try:
        user = User.objects.create_user(
            username=data['username'],
            password=data['password'],
            email=data['email']
        )

        patient = Patient.objects.create(
            user=user,
            name=data['name'],
            age=data['age'],
            sex=data['sex'],
            height=data.get('height'),
            weight=data.get('weight'),
            medical_history=data.get('medical_history', ''),
            registered_by_hospital=False  # Patient registered through mobile app
        )

        serializer = PatientSerializer(patient)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


# Book an appointment
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def book_appointment(request):
    try:
        patient = Patient.objects.get(user=request.user)
        doctor = Doctor.objects.get(id=request.data['doctor_id'])
        appointment_date = request.data['appointment_date']

        # Create an appointment
        appointment = Appointment.objects.create(
            doctor=doctor,
            patient=patient,
            appointment_date=appointment_date,
            fee_paid=False  # Assuming fee not yet paid; can be updated later
        )

        serializer = AppointmentSerializer(appointment)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


# Admin view to list all patients (admin only)
@api_view(['GET'])
@permission_classes([IsAdminUser])
def list_patients(request):
    patients = Patient.objects.all()
    serializer = PatientSerializer(patients, many=True)
    return Response(serializer.data)


# Admin view to list all appointments (admin only)
@api_view(['GET'])
@permission_classes([IsAdminUser])
def list_appointments(request):
    appointments = Appointment.objects.all()
    serializer = AppointmentSerializer(appointments, many=True)
    return Response(serializer.data)


# Doctor login API
@api_view(['POST'])
def doctor_login(request):
    data = request.data
    username = data.get('username')
    password = data.get('password')

    # Authenticate the doctor
    user = authenticate(username=username, password=password)

    if user is not None:
        try:
            doctor = Doctor.objects.get(user=user)
            serializer = DoctorSerializer(doctor)
            return Response({
                "message": "Login successful",
                "doctor": serializer.data
            }, status=status.HTTP_200_OK)
        except Doctor.DoesNotExist:
            return Response({"error": "User is not a doctor"}, status=status.HTTP_403_FORBIDDEN)
    else:
        return Response({"error": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)