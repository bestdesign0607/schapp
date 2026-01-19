# # from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, Group, Permission
# # from django.db import models
# # from .managers import UserManager


# # class User(AbstractBaseUser, PermissionsMixin):
# #     ROLE_CHOICES = (
# #         ("admin", "Admin"),
# #         ("teacher", "Teacher"),
# #         ("student", "Student"),
# #         ("parent", "Parent"),
# #     )

# #     staff_id = models.CharField(max_length=20, unique=True, null=True, blank=True)
# #     email = models.EmailField(unique=True, null=True, blank=True)
# #     role = models.CharField(max_length=20, choices=ROLE_CHOICES)

# #     is_active = models.BooleanField(default=True)
# #     is_staff = models.BooleanField(default=False)

# #     # 👇 These two lines FIX the conflict
# #     groups = models.ManyToManyField(
# #         Group,
# #         related_name="custom_user_set",
# #         blank=True
# #     )

# #     user_permissions = models.ManyToManyField(
# #         Permission,
# #         related_name="custom_user_permissions",
# #         blank=True
# #     )

# #     USERNAME_FIELD = "staff_id"
# #     REQUIRED_FIELDS = []

# #     objects = UserManager()

# #     def __str__(self):
# #         return f"{self.role} - {self.staff_id}"










# from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, Group, Permission
# from django.db import models
# from django.utils import timezone
# from .managers import UserManager


# class User(AbstractBaseUser, PermissionsMixin):
#     ROLE_CHOICES = (
#         ("admin", "Admin"),
#         ("teacher", "Teacher"),
#         ("student", "Student"),
#         ("parent", "Parent"),
#     )

#     # Core fields
#     staff_id = models.CharField(max_length=20, unique=True, default="")  # ❌ Remove null=True and blank=True
#     email = models.EmailField(unique=True, null=True, blank=True, default="")  # optional email
#     role = models.CharField(max_length=20, choices=ROLE_CHOICES, default="teacher")
    
#     # Personal info
#     full_name = models.CharField(max_length=255, blank=True, default="Full Name")
#     phone = models.CharField(max_length=20, blank=True, default="Phone Number")
#     state_of_origin = models.CharField(max_length=50, blank=True, default="State of Origin")
#     religion = models.CharField(max_length=50, blank=True, default="Religion")

#     # Django permissions
#     is_active = models.BooleanField(default=True)
#     is_staff = models.BooleanField(default=False)
#     groups = models.ManyToManyField(Group, related_name="custom_user_set", blank=True, default="None")
#     user_permissions = models.ManyToManyField(Permission, related_name="custom_user_permissions", blank=True, default="None")

#     # Track creation date
#     date_joined = models.DateTimeField(default=timezone.now)
    
#     # Login config
#     USERNAME_FIELD = "staff_id"
#     REQUIRED_FIELDS = []  # email is optional

#     objects = UserManager()

#     def __str__(self):
#         return f"{self.role} - {self.staff_id}"











from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, Group, Permission
from django.db import models
from django.utils import timezone
from .managers import UserManager


# class User(AbstractBaseUser, PermissionsMixin):
#     ROLE_CHOICES = (
#         ("admin", "Admin"),
#         ("teacher", "Teacher"),
#         ("student", "Student"),
#         ("parent", "Parent"),
#     )

#     # Core login fields
#     staff_id = models.CharField(max_length=20, unique=True, null=True, blank=True, default="")
#     admission_number = models.CharField(max_length=20, unique=True, null=True, blank=True, default="")
#     email = models.EmailField(null=True, blank=True, unique=False)  # optional
#     role = models.CharField(max_length=20, choices=ROLE_CHOICES, default="teacher")
    
#     # Personal info
#     full_name = models.CharField(max_length=255, blank=True, default="Full Name")
#     phone = models.CharField(max_length=20, blank=True, default="Phone Number")
#     state_of_origin = models.CharField(max_length=50, blank=True, default="State of Origin")
#     religion = models.CharField(max_length=50, blank=True, default="Religion")

#     # Django permissions
#     is_active = models.BooleanField(default=True)
#     is_staff = models.BooleanField(default=False)
#     groups = models.ManyToManyField(Group, related_name="custom_user_set", blank=True)
#     user_permissions = models.ManyToManyField(Permission, related_name="custom_user_permissions", blank=True)

#     # Track creation date
#     date_joined = models.DateTimeField(default=timezone.now)
    
#     # Login config
#     USERNAME_FIELD = "staff_id"  # For Django admin login; students/parents will use admission_number in API
#     REQUIRED_FIELDS = []  # email is optional

#     objects = UserManager()

#     def __str__(self):
#         if self.role in ["student", "parent"]:
#             return f"{self.role} - {self.admission_number}"
#         return f"{self.role} - {self.staff_id}"









class User(AbstractBaseUser, PermissionsMixin):
    ROLE_CHOICES = (
        ("admin", "Admin"),
        ("teacher", "Teacher"),
        ("student", "Student"),
        ("parent", "Parent"),
    )


    staff_id = models.CharField(max_length=20, unique=True, null=True, blank=True, default="")
    admission_number = models.CharField(max_length=20, unique=True, null=True, blank=True, default="")
    email = models.EmailField(null=True, blank=True)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default="teacher")

    full_name = models.CharField(max_length=255, blank=True, default="Full Name")
    phone = models.CharField(max_length=20, blank=True, default="Phone Number")
    state_of_origin = models.CharField(max_length=50, blank=True, default="State of Origin")
    religion = models.CharField(max_length=50, blank=True, default="Religion")

    # ✅ Parent → Students
    children = models.ManyToManyField(
        "self",
        symmetrical=False,
        blank=True,
        related_name="parents",
        limit_choices_to={"role": "student"},
    )

    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    date_joined = models.DateTimeField(default=timezone.now)

    USERNAME_FIELD = "staff_id"
    REQUIRED_FIELDS = []

    objects = UserManager()

    def __str__(self):
        if self.role == "student":
            return f"{self.full_name} ({self.admission_number})"
        if self.role == "parent":
            return f"Parent - {self.full_name}"
        return f"{self.role} - {self.staff_id}"