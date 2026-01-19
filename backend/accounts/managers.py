from django.contrib.auth.base_user import BaseUserManager


class UserManager(BaseUserManager):
    def create_user(self, staff_id=None, admission_number=None, password=None, role="teacher", **extra_fields):
        """
        Create and save a user with either a staff_id (teacher/admin) or admission_number (student/parent).
        """
        if role in ["teacher", "admin"]:
            if not staff_id:
                raise ValueError("Staff ID is required for teachers/admins")
        else:  # student or parent
            if not admission_number:
                raise ValueError("Admission number is required for students/parents")

        # Ensure boolean flags
        extra_fields.setdefault("is_active", True)
        extra_fields.setdefault("is_staff", role in ["teacher", "admin"])
        extra_fields.setdefault("is_superuser", role == "admin")

        user = self.model(
            staff_id=staff_id if role in ["teacher", "admin"] else None,
            admission_number=admission_number if role in ["student", "parent"] else None,
            role=role,
            **extra_fields
        )

        # Default password is state_of_origin if not provided
        if password is None:
            password = extra_fields.get("state_of_origin", "changeme123")

        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, staff_id, password=None, **extra_fields):
        """
        Create and save a superuser with role=admin
        """
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        extra_fields.setdefault("is_active", True)
        extra_fields.setdefault("role", "admin")

        if extra_fields.get("is_staff") is not True:
            raise ValueError("Superuser must have is_staff=True")
        if extra_fields.get("is_superuser") is not True:
            raise ValueError("Superuser must have is_superuser=True")
        if extra_fields.get("role") != "admin":
            raise ValueError("Superuser must have role='admin'")

        return self.create_user(staff_id=staff_id, password=password, **extra_fields)
