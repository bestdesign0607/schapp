# backends.py
from django.contrib.auth.backends import ModelBackend
from .models import User

class AdmissionNumberBackend(ModelBackend):
    """
    Authenticate using admission_number for students/parents,
    and staff_id for teachers/admins.
    """
    def authenticate(self, request, username=None, password=None, admission_number=None, **kwargs):
        try:
            if admission_number:
                user = User.objects.get(admission_number=admission_number)
            elif username:
                user = User.objects.get(staff_id=username)
            else:
                return None
        except User.DoesNotExist:
            return None

        if user.check_password(password) and self.user_can_authenticate(user):
            return user
        return None
