# from rest_framework.views import APIView
# from rest_framework.response import Response
# from rest_framework.permissions import IsAuthenticated
# from django.utils import timezone
# # from .models import Attendance
# from .serializers import AttendanceSerializer
# from rest_framework import status
# import datetime
# from academics.models import SchoolClass

# class ClassAttendanceView(APIView):
#     permission_classes = [IsAuthenticated]  # later restrict to class teachers

#     def get(self, request, class_id):
#         """Fetch today's attendance for a class"""
#         today = timezone.localdate()
#         school_class = SchoolClass.objects.get(id=class_id)
#         attendance = Attendance.objects.filter(
#             school_class=school_class,
#             date=today
#         )
#         serializer = AttendanceSerializer(attendance, many=True)
#         return Response(serializer.data)

#     def post(self, request, class_id):
#         """Mark attendance"""
#         # Check weekday
#         today = timezone.localdate()
#         if today.weekday() >= 5:  # 0 = Monday, 6 = Sunday
#             return Response({"detail": "Attendance can only be marked Monday to Friday"}, status=400)

#         school_class = SchoolClass.objects.get(id=class_id)
#         data = request.data
#         # expect list of attendance entries
#         # [
#         #   {"student": 1, "period": "morning", "status": "present", "reason": ""},
#         #   ...
#         # ]
#         for entry in data:
#             entry["school_class"] = school_class.id
#             entry["marked_by"] = request.user.id
#             entry["date"] = today
#             entry["term"] = entry.get("term", "First Term")   # default term if not passed
#             entry["session"] = entry.get("session", "2025/2026")  # default session

#         serializer = AttendanceSerializer(data=data, many=True)
#         serializer.is_valid(raise_exception=True)
#         serializer.save()
#         return Response({"message": "Attendance marked successfully"})
