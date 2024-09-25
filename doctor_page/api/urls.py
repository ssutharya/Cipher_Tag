from django.urls import path
from .views import list_available_doctors, register_patient, book_appointment, list_patients, list_appointments, doctor_login

urlpatterns = [
    path('available-doctors/', list_available_doctors, name='available_doctors'),
    path('register-patient/', register_patient, name='register_patient'),
    path('book-appointment/', book_appointment, name='book_appointment'),
    path('list-patients/', list_patients, name='list_patients'),
    path('list-appointments/', list_appointments, name='list_appointments'),
    path('doctor-login/', doctor_login, name='doctor_login'),
]
