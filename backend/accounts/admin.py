from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django import forms

from academics.models import SchoolClass
from .models import User


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    ordering = ("staff_id",)
    list_display = (
        "staff_id",
        "full_name",
        "role",
        "is_active",
        "is_staff",
        "is_superuser",
    )
    list_filter = ("role", "is_active", "is_staff")
    search_fields = ("staff_id", "full_name", "email")
    readonly_fields = ("last_login", "date_joined")

    # Fields displayed when viewing/editing a user
    fieldsets = (
        ("Account Info", {
            "fields": ("staff_id", "password", "role")
        }),
        ("Personal Info", {
            "fields": ("full_name", "email", "phone", "state_of_origin", "religion")
        }),
        ("Permissions", {
            "fields": (
                "is_active",
                "is_staff",
                "is_superuser",
                "groups",
                "user_permissions",
            )
        }),
        ("Important dates", {
            "fields": ("last_login", "date_joined")
        }),
    )

    # Fields displayed when creating a new user
    add_fieldsets = (
        (None, {
            "classes": ("wide",),
            "fields": (
                "staff_id",
                "full_name",
                "email",
                "password1",
                "password2",
                "role",
                "is_active",
                "is_staff",
                "is_superuser",
            ),
        }),
    )

    filter_horizontal = ("groups", "user_permissions")

    def save_model(self, request, obj, form, change):
        """
        Ensure only superusers can create teacher accounts via admin panel.
        """
        if not change and obj.role == "teacher" and not request.user.is_superuser:
            raise PermissionError("Only superusers can create teacher accounts")
        super().save_model(request, obj, form, change)




class SchoolClassAdminForm(forms.ModelForm):
    students = forms.ModelMultipleChoiceField(
        queryset=User.objects.filter(role="student"),
        required=False,
        widget=admin.widgets.FilteredSelectMultiple("Students", is_stacked=False)
    )

    class Meta:
        model = SchoolClass
        fields = "__all__"


class ChildInline(admin.TabularInline):
    """Children inline for parent users"""
    model = User.children.through
    fk_name = "from_user"  # parent side
    extra = 1
    verbose_name = "Child"
    verbose_name_plural = "Children"

class ParentInline(admin.TabularInline):
    """Parents inline for student users"""
    model = User.children.through
    fk_name = "to_user"  # student side
    extra = 1
    verbose_name = "Parent"
    verbose_name_plural = "Parents"
