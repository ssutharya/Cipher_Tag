from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAdminUser, IsAuthenticated, AllowAny
from .models import Doctor, Patient, Appointment
from .serializers import DoctorSerializer, PatientSerializer, AppointmentSerializer
from django.contrib.auth.models import User
from .permissions import IsPatientOrAdmin, IsDoctorOrAdmin
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate

# List all available doctors (no authentication needed)
@api_view(['GET'])
@permission_classes([AllowAny])
def list_available_doctors(request):
    doctors = Doctor.objects.filter(available=True)
    serializer = DoctorSerializer(doctors, many=True)
    return Response(serializer.data)

# Register a new patient
@api_view(['POST'])
@permission_classes([AllowAny])
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
            registered_by_hospital=False
        )
        serializer = PatientSerializer(patient)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

# Separate login for patients
@api_view(['POST'])
@permission_classes([AllowAny])
def login_patient(request):
    data = request.data
    username = data.get('username')
    password = data.get('password')
    user = authenticate(username=username, password=password)

    if user is not None:
        if hasattr(user, 'patient'):  # Check if the user is a patient
            refresh = RefreshToken.for_user(user)
            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
                'message': 'Patient login successful'
            }, status=status.HTTP_200_OK)
        else:
            return Response({'error': 'Invalid patient credentials'}, status=status.HTTP_401_UNAUTHORIZED)
    else:
        return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)

# Separate login for doctors
@api_view(['POST'])
@permission_classes([AllowAny])
def login_doctor(request):
    data = request.data
    username = data.get('username')
    password = data.get('password')
    user = authenticate(username=username, password=password)

    if user is not None:
        if hasattr(user, 'doctor'):  # Check if the user is a doctor
            refresh = RefreshToken.for_user(user)
            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
                'message': 'Doctor login successful'
            }, status=status.HTTP_200_OK)
        else:
            return Response({'error': 'Invalid doctor credentials'}, status=status.HTTP_401_UNAUTHORIZED)
    else:
        return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)

# Separate login for general users (hospital/admin)
@api_view(['POST'])
@permission_classes([AllowAny])
def login_user(request):
    data = request.data
    username = data.get('username')
    password = data.get('password')
    user = authenticate(username=username, password=password)

    if user is not None and user.is_staff:
        refresh = RefreshToken.for_user(user)
        return Response({
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'message': 'Admin login successful'
        }, status=status.HTTP_200_OK)
    else:
        return Response({'error': 'Invalid admin credentials'}, status=status.HTTP_401_UNAUTHORIZED)

# Book an appointment (only authenticated patients)
@api_view(['POST'])
@permission_classes([IsAuthenticated, IsPatientOrAdmin])
def book_appointment(request):
    try:
        patient = Patient.objects.get(user=request.user)
        doctor = Doctor.objects.get(id=request.data['doctor_id'])
        appointment_date = request.data['appointment_date']

        if not request.data.get('fee_paid', False):
            return Response({"error": "Fee must be paid"}, status=status.HTTP_400_BAD_REQUEST)

        appointment = Appointment.objects.create(
            doctor=doctor,
            patient=patient,
            appointment_date=appointment_date,
            fee_paid=True
        )

        serializer = AppointmentSerializer(appointment)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

# List all patients (admin only)
@api_view(['GET'])
@permission_classes([IsAdminUser])
def list_patients(request):
    patients = Patient.objects.all()
    serializer = PatientSerializer(patients, many=True)
    return Response(serializer.data)

# List all appointments (admin only)
@api_view(['GET'])
@permission_classes([IsAdminUser])
def list_appointments(request):
    appointments = Appointment.objects.all()
    serializer = AppointmentSerializer(appointments, many=True)
    return Response(serializer.data)

# List doctor's own patients (doctor login required)
@api_view(['GET'])
@permission_classes([IsAuthenticated, IsDoctorOrAdmin])
def list_doctor_patients(request):
    try:
        doctor = Doctor.objects.get(user=request.user)
        appointments = Appointment.objects.filter(doctor=doctor)
        serializer = AppointmentSerializer(appointments, many=True)
        return Response(serializer.data)
    except Doctor.DoesNotExist:
        return Response({"error": "Doctor not found"}, status=status.HTTP_404_NOT_FOUND)

# Create a new doctor profile (admin only)
@api_view(['POST'])
@permission_classes([IsAdminUser])
def create_doctor(request):
    data = request.data
    try:
        user = User.objects.create_user(
            username=data['username'],
            password=data['password'],
            email=data['email'],
            is_staff=False  # Ensure doctor is not an admin
        )
        doctor = Doctor.objects.create(
            user=user,
            name=data['name'],
            specialization=data['specialization'],
            available=data.get('available', True)
        )
        serializer = DoctorSerializer(doctor)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
