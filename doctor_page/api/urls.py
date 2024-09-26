from django.urls import path
from . import views

urlpatterns = [
    path('doctors/', views.list_available_doctors),
    path('patients/register/', views.register_patient),
    path('patients/login/', views.login_patient),
    path('doctors/login/', views.login_doctor),
    path('admin/login/', views.login_user),
    path('appointments/book/', views.book_appointment),
    path('patients/', views.list_patients),
    path('appointments/', views.list_appointments),
    path('doctor/patients/', views.list_doctor_patients),
    path('doctors/create/', views.create_doctor),
]
