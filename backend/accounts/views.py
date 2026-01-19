from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.authentication import JWTAuthentication
from django.contrib.auth import get_user_model
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from academics.models import SchoolClass


from rest_framework.permissions import AllowAny
from .serializers import (
    AdminLoginSerializer,
    TeacherCreateSerializer,
    StudentCreateSerializer,
    ParentCreateSerializer,
    LoginSerializer,
    TeacherSerializer
)
from .permissions import IsAdmin

User = get_user_model()


# -------------------------
# Teacher Creation
# -------------------------
@method_decorator(csrf_exempt, name='dispatch')
class CreateTeacherView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated, IsAdmin]

    def post(self, request):
        serializer = TeacherCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({"message": "Teacher created successfully"})
    
    def get(self, request):
        teachers = User.objects.filter(role="teacher")
        serializer = TeacherSerializer(teachers, many=True)
        return Response(serializer.data)


# -------------------------
# Student Creation
# -------------------------
@method_decorator(csrf_exempt, name='dispatch')
class CreateStudentView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated, IsAdmin]

    def post(self, request):
        serializer = StudentCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({"message": "Student created successfully"})


# -------------------------
# Parent Creation
# -------------------------
@method_decorator(csrf_exempt, name='dispatch')
class CreateParentView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated, IsAdmin]

    def post(self, request):
        serializer = ParentCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({"message": "Parent created successfully"})


# -------------------------
# Login View
# -------------------------
# @method_decorator(csrf_exempt, name="dispatch")
# class LoginView(APIView):
#     authentication_classes = []   # 🔑 REQUIRED
#     permission_classes = [AllowAny]

#     def post(self, request):
#         serializer = LoginSerializer(data=request.data)
#         serializer.is_valid(raise_exception=True)

#         user = serializer.validated_data

#         refresh = RefreshToken.for_user(user)

#         return Response({
#             "access": str(refresh.access_token),
#             "refresh": str(refresh),
#             "role": user.role,
#         })





@method_decorator(csrf_exempt, name="dispatch")
class LoginView(APIView):
    authentication_classes = []
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data, context={"request": request})
        serializer.is_valid(raise_exception=True)

        user = serializer.validated_data  # now a User instance

        refresh = RefreshToken.for_user(user)

        return Response({
            "access": str(refresh.access_token),
            "refresh": str(refresh),
            "role": user.role,
        })




@method_decorator(csrf_exempt, name="dispatch")
class AdminLoginView(APIView):
    authentication_classes = []
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = AdminLoginSerializer(
            data=request.data,
            context={"request": request}
        )
        serializer.is_valid(raise_exception=True)

        user = serializer.validated_data

        refresh = RefreshToken.for_user(user)

        return Response({
            "access": str(refresh.access_token),
            "refresh": str(refresh),
            "role": user.role,
            "staff_id": user.staff_id,          # ✅ correct
        })
    






class TeachersListView(APIView):
    permission_classes = [IsAuthenticated]  # or [IsAdmin] if only admin can view

    def get(self, request):
        # Filter only teachers
        teachers = User.objects.filter(role="teacher")
        serializer = TeacherSerializer(teachers, many=True)
        return Response(serializer.data)




class ParentListView(APIView):
    permission_classes = [IsAuthenticated]  # maybe restrict to admin only

    def get(self, request):
        parents = User.objects.filter(role="parent")
        data = [{"id": p.id, "full_name": p.full_name} for p in parents]
        return Response(data)

class StudentListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        students = User.objects.filter(role="student")
        data = [{"id": s.id, "full_name": s.full_name} for s in students]
        return Response(data)




class LinkStudentsToClassView(APIView):
    """
    Admin can link/unlink students to a class.
    POST: add students
    PUT: replace students list
    """
    permission_classes = [IsAuthenticated, IsAdmin]

    def post(self, request, class_id):
        """
        Add students to the class (without removing existing students)
        Expecting: { "student_ids": [1, 2, 3] }
        """
        try:
            school_class = SchoolClass.objects.get(id=class_id)
        except SchoolClass.DoesNotExist:
            return Response({"detail": "Class not found"}, status=404)

        student_ids = request.data.get("student_ids", [])
        if not isinstance(student_ids, list):
            return Response({"detail": "student_ids must be a list"}, status=400)

        students = User.objects.filter(id__in=student_ids, role="student")
        school_class.students.add(*students)

        return Response({
            "message": f"Added {students.count()} students to {school_class.name}",
            "students": [{"id": s.id, "full_name": s.full_name} for s in school_class.students.all()]
        })

    def put(self, request, class_id):
        """
        Replace students in the class (unlink all previous and set new list)
        Expecting: { "student_ids": [1, 2, 3] }
        """
        try:
            school_class = SchoolClass.objects.get(id=class_id)
        except SchoolClass.DoesNotExist:
            return Response({"detail": "Class not found"}, status=404)

        student_ids = request.data.get("student_ids", [])
        if not isinstance(student_ids, list):
            return Response({"detail": "student_ids must be a list"}, status=400)

        students = User.objects.filter(id__in=student_ids, role="student")
        school_class.students.set(students)  # replace all
        school_class.save()

        return Response({
            "message": f"Updated students in {school_class.name}",
            "students": [{"id": s.id, "full_name": s.full_name} for s in school_class.students.all()]
        })

    def get(self, request, class_id):
        """
        List all students currently linked to this class
        """
        try:
            school_class = SchoolClass.objects.get(id=class_id)
        except SchoolClass.DoesNotExist:
            return Response({"detail": "Class not found"}, status=404)

        students = school_class.students.all()
        return Response({
            "class_id": school_class.id,
            "class_name": school_class.name,
            "students": [{"id": s.id, "full_name": s.full_name} for s in students]
        })