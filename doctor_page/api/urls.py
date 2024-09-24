from django.urls import path
from .views import doctor_login, patient_list

urlpatterns = [
    path('login/', doctor_login, name='doctor-login'),
    path('patients/', patient_list, name='patient-list'),
]
