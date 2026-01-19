# Register your models here.
from django.contrib import admin
from .models import Attendance, Result, Subject, SchoolClass, TeachingAssignment


@admin.register(Subject)
class SubjectAdmin(admin.ModelAdmin):
    list_display = ("name", "code")
    search_fields = ("name", "code")
    ordering = ("name",)


@admin.register(SchoolClass)
class SchoolClassAdmin(admin.ModelAdmin):
    list_display = ("name", "section")
    search_fields = ("name", "section")
    ordering = ("name",)


@admin.register(TeachingAssignment)
class TeachingAssignmentAdmin(admin.ModelAdmin):
    list_display = ("teacher", "subject", "school_class")
    list_filter = ("subject", "school_class")
    search_fields = (
        "teacher__email",
        "teacher__staff_id",
        "subject__name",
        "school_class__name",
    )
    autocomplete_fields = ("teacher", "subject", "school_class")



# @admin.register(StudentProfile)
# class StudentProfileAdmin(admin.ModelAdmin):
#     list_display = ("student", "admission_number", "parent", "school_class")
#     search_fields = ("admission_number", "student__full_name")
#     list_filter = ("school_class",)


# @admin.register(Result)
# class ResultAdmin(admin.ModelAdmin):
#     list_display = (
#         "student",
#         "subject",
#         "school_class",
#         "term",
#         "session",
#         "total",
#         "approved_by_class_teacher",
#         "is_published",
#     )
#     list_filter = ("term", "session", "school_class", "is_published")
#     search_fields = ("student__full_name",)


@admin.register(Attendance)
class AttendanceAdmin(admin.ModelAdmin):
    list_display = ("student", "school_class", "date", "period", "status")
    list_filter = ("school_class", "date", "period", "status")





@admin.register(Result)
class ResultAdmin(admin.ModelAdmin):
    list_display = (
        "student",
        "subject",
        "school_class",
        "term",
        "session",
        "ca_score",
        "exam_score",
        "total_score",
        "is_published",
    )

    list_filter = (
        "school_class",
        "term",
        "session",
        "is_published",
    )

    search_fields = (
        "student__full_name",
        "student__admission_number",
        "subject__name",
    )

    list_editable = ("is_published",)
    list_per_page = 30

    def total_score(self, obj):
        return obj.ca_score + obj.exam_score

    total_score.short_description = "Total"
