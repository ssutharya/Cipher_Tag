from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAdminUser, IsAuthenticated, AllowAny
from .models import Doctor, Patient, Appointment, Medicine, Prescription, GlobalMedicine
from .serializers import DoctorSerializer, PatientSerializer, AppointmentSerializer, MedicineSerializer, PrescriptionSerializer, GlobalMedicineSerializer
from django.contrib.auth.models import User
from .permissions import IsPatientOrAdmin, IsDoctorOrAdmin
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
import logging
from datetime import datetime 
from django.shortcuts import get_object_or_404
from rest_framework.permissions import IsAuthenticated
from .permissions import IsDoctorOrAdmin


logger = logging.getLogger(__name__)

# Doctor Profile API
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def doctor_profile(request):
    doctor = Doctor.objects.get(user=request.user)
    data = {
        "name": doctor.name,
        "specialization": doctor.specialization
    }
    return Response(data)

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
@permission_classes([IsAuthenticated])
def list_patients(request):
    patients = Patient.objects.all()
    serializer = PatientSerializer(patients, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def list_appointments(request):
    try:
        doctor = Doctor.objects.get(user=request.user)
        appointments = Appointment.objects.filter(doctor=doctor)

        # Handle date filtering
        date_param = request.GET.get('date')
        if date_param:
            filter_date = datetime.strptime(date_param, "%Y-%m-%d").date()
            appointments = appointments.filter(appointment_date__date=filter_date)

        # Handle 'consulted' (finished) status filtering
        consulted_param = request.GET.get('consulted')
        if consulted_param is not None:
            consulted = consulted_param.lower() == 'true'
            appointments = appointments.filter(consulted=consulted)

        # Serialize the data
        data = [{
            "patient": {
                "name": appt.patient.name,
                "age": appt.patient.age,
                "sex": appt.patient.sex
            },
            "appointment_date": appt.appointment_date,
            "token": appt.id,  # Unique identifier for the appointment
            "consulted": appt.consulted  # Include consulted status
        } for appt in appointments]

        return Response(data)
    except Doctor.DoesNotExist:
        return Response({"error": "Doctor not found"}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        

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
    

# API to generate unique code and display it before confirming
@api_view(['POST'])
@permission_classes([IsAdminUser])  # Only admin can create global medicines
def generate_medicine_code(request):
    data = request.data
    try:
        # Check if all required fields are provided
        if not data.get('name') or not data.get('category') or not data.get('company'):
            return Response({'error': 'Missing required fields'}, status=status.HTTP_400_BAD_REQUEST)

        # Create a temporary medicine object to generate the unique code
        medicine = GlobalMedicine(
            name=data['name'],
            category=data['category'],
            company=data['company']
        )

        # Generate unique code
        unique_code = medicine.generate_unique_code()

        # Log the generated code for debugging
        print(f"Generated unique code: {unique_code}")

        # Return the generated code in response but don't save the medicine yet
        return Response({
            'name': medicine.name,
            'category': medicine.category,
            'company': medicine.company,
            'unique_code': unique_code
        }, status=status.HTTP_200_OK)

    except Exception as e:
        print(f"Error in generating code: {str(e)}")
        return Response({'error': 'Failed to generate unique code.'}, status=status.HTTP_400_BAD_REQUEST)

# API to confirm and save the global medicine to the inventory
@api_view(['POST'])
@permission_classes([IsAdminUser])
def confirm_medicine_code(request):
    data = request.data
    try:
        # Ensure all fields are passed correctly
        if not all(key in data for key in ('name', 'category', 'company', 'unique_code')):
            return Response({'error': 'Missing required fields'}, status=status.HTTP_400_BAD_REQUEST)

        # Confirm the medicine with the code provided by the user
        confirmed_medicine = GlobalMedicine.objects.create(
            name=data['name'],
            category=data['category'],
            company=data['company'],
            unique_code=data['unique_code'],  # Code must be passed exactly as generated
            code_confirmed=True  # Now the code is confirmed
        )

        serializer = GlobalMedicineSerializer(confirmed_medicine)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

    
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def doctor_appointments(request):
    """
    Fetches all appointments of the logged-in doctor.
    """
    doctor = get_object_or_404(Doctor, user=request.user)
    appointments = Appointment.objects.filter(doctor=doctor).order_by('appointment_date')
    serializer = AppointmentSerializer(appointments, many=True)
    return Response(serializer.data)