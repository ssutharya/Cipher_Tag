from django.urls import path
from . import views

urlpatterns = [
    path('doctors/', views.list_available_doctors, name='list-available-doctors'),
    path('patients/register/', views.register_patient, name='register-patient'),
    path('patient/login/', views.login_patient, name='login-patient'),
    path('doctor/login/', views.login_doctor, name='login-doctor'),
    path('user/login/', views.login_user, name='login-user'),
    path('appointments/book/', views.book_appointment, name='book-appointment'),
    path('admin/patients/', views.list_patients, name='list-patients'),
    path('admin/appointments/', views.list_appointments, name='list-appointments'),
    path('doctor/patients/', views.list_doctor_patients, name='list-doctor-patients'),
    path('admin/create-doctor/', views.create_doctor, name='create-doctor'),
    path('admin/global-medicines/', views.list_global_medicines, name='list-global-medicines'),
    path('admin/add-medicine/', views.add_medicine_to_inventory, name='add-medicine'),
    path('appointments/<int:appointment_id>/prescribe/', views.prescribe_medicines, name='prescribe-medicines'),
    path('patient/prescriptions/', views.patient_prescriptions, name='patient-prescriptions'),
    path('admin/generate-medicine-code/', views.generate_medicine_code, name='generate-medicine-code'),
    path('admin/confirm-medicine-code/', views.confirm_medicine_code, name='confirm-medicine-code')
]
