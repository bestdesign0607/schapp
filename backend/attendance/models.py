# from django.db import models
# from django.utils import timezone
# from django.contrib.auth import get_user_model

# User = get_user_model()

# class Attendance(models.Model):
#     PERIOD_CHOICES = (
#         ("morning", "Morning"),
#         ("afternoon", "Afternoon"),
#     )

#     STATUS_CHOICES = (
#         ("present", "Present"),
#         ("absent", "Absent"),
#     )

#     student = models.ForeignKey(
#         User,
#         on_delete=models.CASCADE,
#         limit_choices_to={"role": "student"},
#         related_name="attendance"
#     )
#     school_class = models.ForeignKey("academics.SchoolClass", on_delete=models.CASCADE)
#     date = models.DateField(default=timezone.now)
#     period = models.CharField(max_length=10, choices=PERIOD_CHOICES)
#     status = models.CharField(max_length=10, choices=STATUS_CHOICES)
#     reason = models.TextField(blank=True, null=True, help_text="Reason if absent")
#     marked_by = models.ForeignKey(
#         User,
#         on_delete=models.SET_NULL,
#         null=True,
#         related_name="marked_attendance"
#     )
#     term = models.CharField(max_length=20)
#     session = models.CharField(max_length=20)
#     created_at = models.DateTimeField(auto_now_add=True)

#     class Meta:
#         unique_together = ("student", "date", "period")  # prevent double marking

#     def __str__(self):
#         return f"{self.student} - {self.date} ({self.period})"
