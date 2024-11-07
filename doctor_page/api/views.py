from rest_framework import status,viewsets
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAdminUser, IsAuthenticated, AllowAny
from .models import Doctor, Patient, Appointment, Medicine, Prescription, GlobalMedicine, PrescriptionItem
from .serializers import DoctorSerializer, PatientSerializer, AppointmentSerializer, MedicineSerializer, PrescriptionSerializer, GlobalMedicineSerializer
from django.contrib.auth.models import User
from .permissions import IsPatientOrAdmin, IsDoctorOrAdmin
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from django.core.files.base import ContentFile
import logging
from io import BytesIO
from datetime import datetime 
from django.shortcuts import get_object_or_404
from rest_framework.permissions import IsAuthenticated
from .permissions import IsDoctorOrAdmin
from rest_framework.decorators import action
import qrcode


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



class GlobalMedicineViewSet(viewsets.ModelViewSet):
    queryset = GlobalMedicine.objects.all()
    serializer_class = GlobalMedicineSerializer

    @action(detail=False, methods=['post'], url_path='add_to_inventory', permission_classes=[AllowAny])
    def add_to_inventory(self, request):
        """
        Add a new medicine to the global inventory with a unique code and allow confirmation for a doctor.
        """
        # Extract data from the request
        doctor_id = request.data.get('doctor_id')
        name = request.data.get('name')
        category = request.data.get('category')
        company = request.data.get('company')

        # Validate required fields
        if not all([doctor_id, name, category, company]):
            return Response(
                {"error": "All fields (doctor_id, name, category, company) are required."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Validate doctor existence
        try:
            doctor = Doctor.objects.get(pk=doctor_id)
        except Doctor.DoesNotExist:
            return Response(
                {"error": "Invalid doctor ID."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Generate a unique code and create the GlobalMedicine instance
        global_medicine = GlobalMedicine(name=name, category=category, company=company)
        unique_code = global_medicine.generate_unique_code()

        # Check if a GlobalMedicine with the generated unique code already exists
        if GlobalMedicine.objects.filter(unique_code=unique_code).exists():
            return Response(
                {"error": "Medicine with this unique code already exists."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Save the GlobalMedicine instance
        global_medicine.unique_code = unique_code
        global_medicine.save()

        # Add the medicine to the doctor's inventory
        medicine = Medicine.objects.create(global_medicine=global_medicine, doctor=doctor)

        # Serialize and return the response
        global_medicine_serializer = GlobalMedicineSerializer(global_medicine)
        medicine_serializer = MedicineSerializer(medicine)

        return Response(
            {
                "message": "Medicine added to global inventory and doctor's inventory.",
                "global_medicine": global_medicine_serializer.data,
                "medicine": medicine_serializer.data
            },
            status=status.HTTP_201_CREATED
        )
    


class PrescriptionViewSet(viewsets.ModelViewSet):
    queryset = Prescription.objects.all()
    serializer_class = PrescriptionSerializer

    @action(detail=False, methods=['post'], permission_classes=[AllowAny])
    def prescribe(self, request):
        doctor_id = request.data.get('doctor_id')
        patient_id = request.data.get('patient_id')
        appointment_id = request.data.get('appointment_id')
        items = request.data.get('items', [])

        # Validate doctor, patient, and appointment
        try:
            doctor = Doctor.objects.get(pk=doctor_id)
            patient = Patient.objects.get(pk=patient_id)
            appointment = Appointment.objects.get(pk=appointment_id)
        except (Doctor.DoesNotExist, Patient.DoesNotExist, Appointment.DoesNotExist):
            return Response({"error": "Invalid doctor, patient, or appointment ID."}, status=status.HTTP_400_BAD_REQUEST)

        # Create the prescription
        prescription = Prescription.objects.create(appointment=appointment)

        # Add prescription items
        medicine_details = []
        for item in items:
            medicine_id = item.get('medicine_id')
            quantity = item.get('quantity', 1)
            remarks = item.get('remarks', '')

            try:
                medicine = Medicine.objects.get(pk=medicine_id)
                PrescriptionItem.objects.create(
                    prescription=prescription,
                    medicine=medicine,
                    quantity=quantity,
                    remarks=remarks
                )
                # Collect medicine details for QR code
                medicine_details.append(f"{medicine.global_medicine.name} (Qty: {quantity}, Remarks: {remarks})")
            except Medicine.DoesNotExist:
                return Response({"error": f"Invalid medicine ID: {medicine_id}"}, status=status.HTTP_400_BAD_REQUEST)

        # Generate QR code including medicine details
        qr_data = f"Doctor: {doctor.name}, Patient: {patient.name}, Prescription ID: {prescription.id}, Medicines: {', '.join(medicine_details)}"
        qr = qrcode.QRCode()
        qr.add_data(qr_data)
        qr.make(fit=True)
        img = qr.make_image(fill='black', back_color='white')

        buffer = BytesIO()
        img.save(buffer, format="PNG")
        buffer.seek(0)
        qr_image = ContentFile(buffer.read(), name=f'prescription_{prescription.id}.png')
        prescription.qr_code.save(f'prescription_{prescription.id}.png', qr_image)

        # Serialize the response
        serializer = PrescriptionSerializer(prescription)
        return Response(serializer.data, status=status.HTTP_201_CREATED)