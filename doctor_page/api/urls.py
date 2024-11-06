from django.urls import path
from . import views

urlpatterns = [
    path('doctors/', views.list_available_doctors, name='list-available-doctors'),
    path('patients/register/', views.register_patient, name='register-patient'),
    path('patient/login/', views.login_patient, name='login-patient'),
    path('doctor/login/', views.login_doctor, name='login-doctor'),
    path('user/login/', views.login_user, name='login-user'),
    path('appointments/book/', views.book_appointment, name='book-appointment'),
    path('api/doctor/patients/', views.list_patients, name='list-doctor-patients'),
    path('admin/appointments/', views.doctor_appointments, name='list-appointments'),
    path('doctor/patients/', views.list_patients, name='list-doctor-patients'),
    path('admin/create-doctor/', views.create_doctor, name='create-doctor'),




    path('admin/generate-medicine-code/', views.generate_medicine_code, name='generate-medicine-code'),
    path('admin/confirm-medicine-code/', views.confirm_medicine_code, name='confirm-medicine-code'),

    path('doctor/profile/', views.doctor_profile,name='doctor-profile'),

]
