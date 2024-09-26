from rest_framework.permissions import BasePermission

class IsPatientOrAdmin(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_staff or hasattr(request.user, 'patient')


class IsDoctorOrAdmin(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_staff or hasattr(request.user, 'doctor')
