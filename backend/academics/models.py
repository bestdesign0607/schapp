# from django.db import models
# from django.conf import settings

# User = settings.AUTH_USER_MODEL


# class Subject(models.Model):
#     name = models.CharField(max_length=100)
#     code = models.CharField(max_length=20, unique=True)

#     def __str__(self):
#         return f"{self.name} ({self.code})"


# class SchoolClass(models.Model):
#     name = models.CharField(max_length=50)  # JSS1, SS2
#     section = models.CharField(max_length=10, blank=True, null=True)

#     # ✅ NEW FIELD
#     class_teacher = models.ForeignKey(
#         User,
#         on_delete=models.SET_NULL,
#         null=True,
#         blank=True,
#         limit_choices_to={"role": "teacher"},
#         related_name="class_teacher_for"
#     )


#     def __str__(self):
#         return f"{self.name}{self.section or ''}"


# class TeachingAssignment(models.Model):
#     teacher = models.ForeignKey(
#         User,
#         on_delete=models.CASCADE,
#         limit_choices_to={"role": "teacher"},
#         related_name="teaching_assignments"
#     )
#     subject = models.ForeignKey(
#         Subject,
#         on_delete=models.CASCADE,
#         related_name="assignments"
#     )
#     school_class = models.ForeignKey(
#         SchoolClass,
#         on_delete=models.CASCADE,
#         related_name="assignments"
#     )

#     class Meta:
#         unique_together = ("teacher", "subject", "school_class")

#     def __str__(self):
#         return f"{self.teacher} → {self.subject} → {self.school_class}"














from django.db import models
from django.conf import settings
from django.utils import timezone

# User = settings.AUTH_USER_MODEL

from django.contrib.auth import get_user_model
User = get_user_model()


# =========================
# SUBJECT
# =========================
class Subject(models.Model):
    name = models.CharField(max_length=100)
    code = models.CharField(max_length=20, unique=True)

    def __str__(self):
        return f"{self.name} ({self.code})"





class SchoolClass(models.Model):
    name = models.CharField(max_length=50)  # JSS1, SS2
    section = models.CharField(max_length=10, blank=True, null=True)

    class_teacher = models.ForeignKey(
        "accounts.User",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        limit_choices_to={"role": "teacher"},
        related_name="class_teacher_for"
    )

    students = models.ManyToManyField(
        "accounts.User",
        related_name="school_classes",
        limit_choices_to={"role": "student"},
        blank=True,
    )

    subjects = models.ManyToManyField(
        "academics.Subject",
        related_name="classes",
        blank=True
    )

    def __str__(self):
        return f"{self.name}{self.section or ''}"





# =========================
# TEACHING ASSIGNMENT
# =========================
class TeachingAssignment(models.Model):
    teacher = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        limit_choices_to={"role": "teacher"},
        related_name="teaching_assignments"
    )
    subject = models.ForeignKey(
        Subject,
        on_delete=models.CASCADE,
        related_name="assignments"
    )
    school_class = models.ForeignKey(
        SchoolClass,
        on_delete=models.CASCADE,
        related_name="assignments"
    )

    class Meta:
        unique_together = ("teacher", "subject", "school_class")

    def __str__(self):
        return f"{self.teacher} → {self.subject} → {self.school_class}"


# =========================
# STUDENT RESULT
# =========================
class Result(models.Model):
    student = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        limit_choices_to={"role": "student"},
        related_name="results"
    )
    subject = models.ForeignKey(Subject, on_delete=models.CASCADE)
    school_class = models.ForeignKey(SchoolClass, on_delete=models.CASCADE)

    ca_score = models.DecimalField(max_digits=5, decimal_places=2)
    exam_score = models.DecimalField(max_digits=5, decimal_places=2)
    total = models.DecimalField(max_digits=5, decimal_places=2)

    # Who entered it (subject teacher)
    entered_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        related_name="entered_results"
    )

    # Class teacher approval
    approved_by_class_teacher = models.BooleanField(default=False)

    # Published = visible to parents/students
    is_published = models.BooleanField(default=False)

    term = models.CharField(max_length=20)
    session = models.CharField(max_length=20)

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("student", "subject", "school_class", "term", "session")

    def save(self, *args, **kwargs):
        self.total = self.ca_score + self.exam_score
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.student} - {self.subject} ({self.term})"


# =========================
# ATTENDANCE
# =========================
class Attendance(models.Model):
    PERIOD_CHOICES = (
        ("morning", "Morning"),
        ("afternoon", "Afternoon"),
    )

    STATUS_CHOICES = (
        ("present", "Present"),
        ("absent", "Absent"),
    )

    student = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        limit_choices_to={"role": "student"},
        related_name="attendance"
    )
    school_class = models.ForeignKey(SchoolClass, on_delete=models.CASCADE)

    date = models.DateField(default=timezone.now)
    period = models.CharField(max_length=10, choices=PERIOD_CHOICES)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES)
    reason = models.TextField(
        blank=True,
        null=True,
        help_text="Reason for absence (required if absent)"
    )

    marked_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        related_name="marked_attendance"
    )

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("student", "date", "period")

    def __str__(self):
        return f"{self.student} - {self.date} ({self.period})"



