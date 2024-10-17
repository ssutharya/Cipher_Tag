from rest_framework.permissions import BasePermission
import logging

class IsPatientOrAdmin(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_staff or hasattr(request.user, 'patient')


class IsDoctorOrAdmin(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_staff or hasattr(request.user, 'doctor')


logger = logging.getLogger(__name__)

# class IsDoctorOrAdmin(BasePermission):
#     def has_permission(self, request, view):
#         user = request.user
#         is_doctor = hasattr(user, 'doctor')
#         is_admin = user.is_staff
        
#         logger.info(f"User: {user.username}, Is Doctor: {is_doctor}, Is Admin: {is_admin}")
        
#         # Check if the user is authenticated and is either a doctor or an admin
#         return user.is_authenticated and (is_doctor or is_admin)
