from rest_framework import serializers
from .models import Doctor, Patient, Appointment, Medicine, Prescription, GlobalMedicine

class DoctorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Doctor
        fields = '__all__'



class PatientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Patient
        fields = ['id', 'name', 'age', 'sex', 'height', 'weight', 'medical_history']


class AppointmentSerializer(serializers.ModelSerializer):
    doctor = DoctorSerializer()
    patient = PatientSerializer()

    class Meta:
        model = Appointment
        fields = '__all__'
        
class GlobalMedicineSerializer(serializers.ModelSerializer):
    class Meta:
        model = GlobalMedicine
        fields = ['id', 'name', 'category', 'company', 'unique_code', 'code_confirmed']


class MedicineSerializer(serializers.ModelSerializer):
    global_medicine = GlobalMedicineSerializer()

    class Meta:
        model = Medicine
        fields = ['id', 'global_medicine', 'doctor']


class PrescriptionSerializer(serializers.ModelSerializer):
    medicines = MedicineSerializer(many=True, read_only=True)

    class Meta:
        model = Prescription
        fields = ['id', 'appointment', 'medicines', 'notes']