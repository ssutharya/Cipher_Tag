from django.urls import path
from . import views

urlpatterns = [
    path('doctors/', views.list_available_doctors, name='list_available_doctors'),
    path('patients/register/', views.register_patient, name='register_patient'),
    path('appointments/book/', views.book_appointment, name='book_appointment'),
    path('admin/patients/', views.list_patients, name='list_patients'),
    path('admin/appointments/', views.list_appointments, name='list_appointments'),
]
