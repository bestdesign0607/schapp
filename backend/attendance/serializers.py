# from rest_framework import serializers
# from .models import Attendance

# class AttendanceSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Attendance
#         fields = [
#             "id", "student", "school_class", "date", "period",
#             "status", "reason", "marked_by", "term", "session"
#         ]

#     def validate(self, data):
#         # Ensure a reason is provided if absent
#         if data["status"] == "absent" and not data.get("reason"):
#             raise serializers.ValidationError({"reason": "Reason is required if student is absent"})
#         return data
