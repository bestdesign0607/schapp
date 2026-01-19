from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.permissions import AllowAny
from rest_framework import status
from rest_framework.exceptions import PermissionDenied
from django.shortcuts import get_object_or_404
from django.db.models import Q
from django.contrib.auth import get_user_model
from django.http import FileResponse
from reportlab.lib.pagesizes import A4
from io import BytesIO
from reportlab.pdfgen import canvas
from rest_framework_simplejwt.authentication import JWTAuthentication
from .serializers import AdminLinkSubjectsSerializer, ChildSerializer, StudentAttendanceOverviewSerializer
from collections import defaultdict
from django.http import HttpResponse
from django.db.models import Sum, F
from decimal import Decimal





User = get_user_model()



from .models import Subject, SchoolClass, TeachingAssignment
from .serializers import (
    AdminClassTeacherSerializer,
    AdminStudentListSerializer,
    AdminTeacherAssignmentSerializer,
    AssignClassTeacherSerializer,
    ParentChildLinkSerializer,
    SubjectSerializer,
    SchoolClassSerializer,
    TeachingAssignmentReadSerializer,
    TeachingAssignmentSerializer
)
from .permissions import IsAdmin, IsTeacher
from .models import Result, Attendance
from .serializers import (
    ResultCreateSerializer,
    ResultApproveSerializer,
    ResultListSerializer,
    AttendanceSerializer,
)


# --------------------
# SUBJECTS
# --------------------
class SubjectCreateView(APIView):
    permission_classes = [IsAdmin]

    def post(self, request):
        serializer = SubjectSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=201)


class SubjectListView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        subjects = Subject.objects.all()
        serializer = SubjectSerializer(subjects, many=True)
        return Response(serializer.data)


# --------------------
# CLASSES
# --------------------
class SchoolClassCreateView(APIView):
    permission_classes = [IsAdmin]

    def post(self, request):
        serializer = SchoolClassSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=201)


class SchoolClassListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        classes = SchoolClass.objects.all()
        serializer = SchoolClassSerializer(classes, many=True)
        return Response(serializer.data)


# --------------------
# TEACHING ASSIGNMENTS
# --------------------
class TeachingAssignmentCreateView(APIView):
    permission_classes = [IsAdmin]

    def post(self, request):
        serializer = TeachingAssignmentSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=201)




class TeacherAssignmentsView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated, IsTeacher]

    def get(self, request):
        assignments = TeachingAssignment.objects.select_related(
            "school_class",
            "subject"
        ).filter(teacher=request.user)

        serializer = TeachingAssignmentReadSerializer(assignments, many=True)
        return Response(serializer.data)




class TeacherStudentsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # Get classes taught by this teacher
        class_ids = TeachingAssignment.objects.filter(
            teacher=request.user
        ).values_list("school_class_id", flat=True)

        # Get students in those classes
        students = User.objects.filter(
            role="student",
            school_classes__id__in=class_ids
        ).distinct()

        student_data = [
            {
                "id": s.id,
                "full_name": s.full_name,
                "admission_number": s.admission_number,
                "classes": list(s.school_classes.values_list("id", flat=True)),
            }
            for s in students
        ]

        return Response({"students": student_data})


class AssignClassTeacherView(APIView):
    permission_classes = [IsAuthenticated, IsAdmin]

    def post(self, request):
        serializer = AssignClassTeacherSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        school_class = serializer.save()

        return Response({
            "message": "Class teacher assigned successfully",
            "class": str(school_class),
            "teacher": school_class.class_teacher.full_name
        })



# =========================
# SUBJECT TEACHER: ENTER RESULT
# =========================
class ResultCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user

        if user.role != "teacher":
            raise PermissionDenied("Only teachers can enter results.")

        serializer = ResultCreateSerializer(
            data=request.data,
            context={"request": request}
        )
        serializer.is_valid(raise_exception=True)
        serializer.save(entered_by=user)

        return Response(serializer.data, status=status.HTTP_201_CREATED)


# =========================
# CLASS TEACHER: APPROVE RESULT
# =========================
class ResultApproveView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, pk):
        result = get_object_or_404(Result, pk=pk)
        user = request.user

        if result.school_class.class_teacher != user:
            raise PermissionDenied("Only the class teacher can approve results.")

        serializer = ResultApproveSerializer(
            result,
            data=request.data,
            partial=True,
            context={"request": request}
        )
        serializer.is_valid(raise_exception=True)
        serializer.save(approved_by=user)

        return Response({"detail": "Result approved successfully"})

# =========================
# VIEW RESULTS
# =========================
class ResultListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user

        if user.role == "student":
            results = Result.objects.filter(
                student=user,
                is_published=True
            )

        elif user.role == "parent":
            results = Result.objects.filter(
            student__parents=user,
            is_published=True
    )

        elif user.role == "teacher":
            results = Result.objects.filter(
                Q(entered_by=user) |
                Q(school_class__class_teacher=user)
            )

        elif user.role == "admin":
            results = Result.objects.all()

        else:
            results = Result.objects.none()

        serializer = ResultListSerializer(results, many=True)
        return Response(serializer.data)

# =========================
# CLASS TEACHER: MARK ATTENDANCE
# =========================
# class AttendanceCreateView(APIView):
#     permission_classes = [IsAuthenticated]

#     def post(self, request):
#         user = request.user

#         if user.role != "teacher":
#             raise PermissionDenied("Only teachers can mark attendance.")

#         serializer = AttendanceSerializer(
#             data=request.data,
#             context={"request": request}
#         )
#         serializer.is_valid(raise_exception=True)

#         school_class = serializer.validated_data["school_class"]

#         if school_class.class_teacher != user:
#             raise PermissionDenied("Only the class teacher can mark attendance.")

#         serializer.save(marked_by=user)
#         return Response(serializer.data, status=status.HTTP_201_CREATED)


class AttendanceCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user

        if user.role != "teacher":
            raise PermissionDenied("Only teachers can mark attendance.")

        data = request.data
        if not isinstance(data, list):
            return Response({"detail": "Expected a list of attendance records."},
                            status=status.HTTP_400_BAD_REQUEST)

        created_records = []
        errors = []

        for item in data:
            serializer = AttendanceSerializer(data=item, context={"request": request})
            if serializer.is_valid():
                created_records.append(serializer.save())
            else:
                errors.append(serializer.errors)

        if errors:
            return Response({"errors": errors}, status=status.HTTP_400_BAD_REQUEST)

        return Response(
            AttendanceSerializer(created_records, many=True).data,
            status=status.HTTP_201_CREATED
        )




# class ClassStudentsView(APIView):
#     permission_classes = [IsAuthenticated]

#     def get(self, request, class_id):
#         user = request.user

#         school_class = get_object_or_404(SchoolClass, id=class_id)

#         if user.role == "teacher" and school_class.class_teacher != user:
#             raise PermissionDenied("You are not the class teacher.")

#         students = User.objects.filter(
#             role="student",
#             school_class=school_class
#         )

#         return Response([
#             {
#                 "id": s.id,
#                 "full_name": s.full_name,
#             }
#             for s in students
#         ])





# class ClassStudentsView(APIView):
#     permission_classes = [IsAuthenticated]

#     def get(self, request, class_id):
#         user = request.user
#         school_class = get_object_or_404(SchoolClass, id=class_id)

#         if user.role != "teacher":
#             raise PermissionDenied("Only teachers can view students.")

#         if school_class.class_teacher != user:
#             raise PermissionDenied("You are not the class teacher.")

#         students = school_class.students.all()

#         return Response([
#             {
#                 "id": s.id,
#                 "full_name": s.full_name,
#                 "admission_number": s.admission_number,
#             }
#             for s in students
#         ])









class ClassStudentsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, class_id):
        user = request.user
        school_class = get_object_or_404(SchoolClass, id=class_id)

        # ✅ Admin can view all
        if user.role == "admin":
            pass

        # ✅ Teacher can view ONLY their class
        elif user.role == "teacher":
            if school_class.class_teacher != user:
                raise PermissionDenied("You are not the class teacher.")

        else:
            raise PermissionDenied("Not allowed.")

        students = school_class.students.all()

        return Response([
            {
                "id": s.id,
                "full_name": s.full_name,
                "admission_number": s.admission_number,
            }
            for s in students
        ])






# class ClassAttendanceOverviewView(APIView):
#     permission_classes = [IsAuthenticated]

#     def get(self, request, class_id):
#         user = request.user

#         school_class = get_object_or_404(SchoolClass, id=class_id)

#         # ✅ Only class teacher allowed
#         if school_class.class_teacher != user:
#             raise PermissionDenied("You are not the class teacher.")

#         students = school_class.students.all()
#         result = []

#         for student in students:
#             attendance_qs = Attendance.objects.filter(
#                 student=student,
#                 school_class=school_class
#             ).order_by("date")

#             daily_map = defaultdict(lambda: {
#                 "morning": None,
#                 "afternoon": None,
#             })

#             for record in attendance_qs:
#                 daily_map[record.date][record.period] = {
#                     "status": record.status,
#                     "reason": record.reason,
#                 }

#             attendance_list = [
#                 {
#                     "date": date,
#                     "morning": data["morning"],
#                     "afternoon": data["afternoon"],
#                 }
#                 for date, data in daily_map.items()
#             ]

#             result.append({
#                 "student_id": student.id,
#                 "student_name": student.full_name,
#                 "attendance": attendance_list,
#             })

#         serializer = StudentAttendanceOverviewSerializer(result, many=True)
#         return Response(serializer.data)



class ClassAttendanceOverviewView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, class_id):
        user = request.user
        school_class = get_object_or_404(SchoolClass, id=class_id)

        # ✅ Admin OR class teacher
        if not (
            user.role == "admin" or
            (user.role == "teacher" and school_class.class_teacher == user)
        ):
            raise PermissionDenied("You are not allowed to view this class.")

        students = school_class.students.all()
        result = []

        for student in students:
            attendance_qs = Attendance.objects.filter(
                student=student,
                school_class=school_class
            ).order_by("date")

            daily_map = defaultdict(lambda: {
                "morning": None,
                "afternoon": None,
            })

            for record in attendance_qs:
                daily_map[record.date][record.period] = {
                    "status": record.status,
                    "reason": record.reason,
                }

            attendance_list = [
                {
                    "date": date,
                    "morning": data["morning"],
                    "afternoon": data["afternoon"],
                }
                for date, data in daily_map.items()
            ]

            result.append({
                "student_id": student.id,
                "student_name": student.full_name,
                "attendance": attendance_list,
            })

        return Response(result)





# =========================
# VIEW ATTENDANCE
# =========================
class AttendanceListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user

        if user.role == "student":
            attendance = Attendance.objects.filter(student=user)

        elif user.role == "parent":
            attendance = Attendance.objects.filter(
            student__parents=user
            )

        elif user.role == "teacher":
            attendance = Attendance.objects.filter(
                school_class__class_teacher=user
            )

        else:
            attendance = Attendance.objects.all()

        serializer = AttendanceSerializer(attendance, many=True)
        return Response(serializer.data)






# class StudentProfileCreateView(APIView):
#     permission_classes = [IsAuthenticated, IsAdmin]

#     def post(self, request):
#         serializer = StudentProfileSerializer(data=request.data)
#         serializer.is_valid(raise_exception=True)
#         serializer.save()
#         return Response(serializer.data, status=201)
    


# class StudentProfileListView(APIView):
#     permission_classes = [IsAuthenticated]

#     def get(self, request):
#         user = request.user

#         if user.role == "admin":
#             profiles = StudentProfile.objects.all()

#         elif user.role == "parent":
#             profiles = StudentProfile.objects.filter(parent=user)

#         elif user.role == "teacher":
#             profiles = StudentProfile.objects.filter(
#                 school_class__class_teacher=user
#             )

#         else:
#             profiles = StudentProfile.objects.filter(student=user)

#         serializer = StudentProfileSerializer(profiles, many=True)
#         return Response(serializer.data)




# class StudentProfileUpdateView(APIView):
#     permission_classes = [IsAuthenticated, IsAdmin]

#     def patch(self, request, pk):
#         profile = get_object_or_404(StudentProfile, pk=pk)

#         serializer = StudentProfileSerializer(
#             profile, data=request.data, partial=True
#         )
#         serializer.is_valid(raise_exception=True)
#         serializer.save()

#         return Response(serializer.data)







class AdminLinkParentView(APIView):
    permission_classes = [IsAuthenticated, IsAdmin]

    def post(self, request):
        serializer = ParentChildLinkSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        parent = serializer.save()

        return Response({
            "message": "Parent linked successfully",
            "parent": parent.full_name,
            "children": [{"id": c.id, "name": c.full_name} for c in parent.children.all()]
        })





# Teachers assigned to subjects
class AdminTeachersAssignmentsView(APIView):
    permission_classes = [IsAuthenticated, IsAdmin]

    def get(self, request):
        assignments = TeachingAssignment.objects.select_related("teacher", "subject", "school_class")
        serializer = AdminTeacherAssignmentSerializer(assignments, many=True)
        return Response(serializer.data)


# Class teachers and their classes
class AdminClassTeachersView(APIView):
    permission_classes = [IsAuthenticated, IsAdmin]

    def get(self, request):
        classes = SchoolClass.objects.select_related("class_teacher").all()
        serializer = AdminClassTeacherSerializer(classes, many=True)
        return Response(serializer.data)


# List all students with parents
class AdminStudentsView(APIView):
    permission_classes = [IsAuthenticated, IsAdmin]

    def get(self, request):
        students = User.objects.filter(role="student").prefetch_related("parents")
        serializer = AdminStudentListSerializer(students, many=True)
        return Response(serializer.data)






# -----------------------------
# PER-TERM RESULT WITH POSITION
# -----------------------------
class TeacherResultListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        if user.role != "teacher":
            raise PermissionDenied("Only teachers can view results.")

        school_class_id = request.GET.get("school_class")
        term = request.GET.get("term")
        session = request.GET.get("session")

        if not school_class_id or not term or not session:
            return Response({"detail": "class, term, and session are required"}, status=400)

        # All students in this class
        students_in_class = User.objects.filter(
            role="student",
            school_classes__id=school_class_id
        ).distinct()

        # All results for this class/term/session
        results = Result.objects.filter(
            school_class_id=school_class_id,
            term=term,
            session=session
        ).select_related("student", "subject")

        # Build student dict with nested subjects
        student_dict = {}
        for s in students_in_class:
            student_dict[s.id] = {
                "student_id": s.id,
                "student_name": s.full_name,
                "admission_number": s.admission_number,
                "subjects": [],
                "total_score": 0
            }

        for r in results:
            student_dict[r.student.id]["subjects"].append({
                "subject_name": r.subject.name,
                "ca_score": float(r.ca_score),
                "exam_score": float(r.exam_score),
                "total_score": float(r.ca_score + r.exam_score)
            })
            student_dict[r.student.id]["total_score"] += float(r.ca_score + r.exam_score)

        # Compute positions across all subjects in class
        students_list = list(student_dict.values())
        students_list.sort(key=lambda x: x["total_score"], reverse=True)
        for idx, s in enumerate(students_list):
            if idx > 0 and s["total_score"] == students_list[idx - 1]["total_score"]:
                s["position"] = students_list[idx - 1]["position"]
            else:
                s["position"] = idx + 1

        return Response(students_list)






class AdminLinkSubjectsView(APIView):
    permission_classes = [IsAuthenticated, IsAdmin]

    def post(self, request, class_id):
        """
        Add subjects to a class (without removing existing ones)
        Expecting: { "subject_ids": [1,2,3] }
        """
        serializer = AdminLinkSubjectsSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        subject_ids = serializer.validated_data["subject_ids"]

        school_class = get_object_or_404(SchoolClass, id=class_id)
        subjects = Subject.objects.filter(id__in=subject_ids)

        school_class.subjects.add(*subjects)

        return Response({
            "message": f"Added {subjects.count()} subjects to {school_class.name}",
            "subjects": [{"id": s.id, "name": s.name} for s in school_class.subjects.all()]
        }, status=status.HTTP_200_OK)

    def put(self, request, class_id):
        """
        Replace subjects in a class
        Expecting: { "subject_ids": [1,2,3] }
        """
        serializer = AdminLinkSubjectsSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        subject_ids = serializer.validated_data["subject_ids"]

        school_class = get_object_or_404(SchoolClass, id=class_id)
        subjects = Subject.objects.filter(id__in=subject_ids)

        school_class.subjects.set(subjects)

        return Response({
            "message": f"Updated subjects in {school_class.name}",
            "subjects": [{"id": s.id, "name": s.name} for s in school_class.subjects.all()]
        }, status=status.HTTP_200_OK)

    def get(self, request, class_id):
        """
        List all subjects currently linked to this class
        """
        school_class = get_object_or_404(SchoolClass, id=class_id)
        subjects = school_class.subjects.all()

        return Response({
            "class_id": school_class.id,
            "class_name": school_class.name,
            "subjects": [{"id": s.id, "name": s.name} for s in subjects]
        })



class AdminSubjectsListView(APIView):
    permission_classes = [IsAuthenticated, IsAdmin]

    def get(self, request):
        subjects = Subject.objects.all()
        return Response([{"id": s.id, "name": s.name} for s in subjects])


# -----------------------------
# CUMULATIVE 3-TERM RESULTS
# -----------------------------
class TeacherResultCumulativeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        if user.role != "teacher":
            raise PermissionDenied("Only teachers can view results.")

        school_class_id = request.GET.get("school_class")
        session = request.GET.get("session")

        if not school_class_id or not session:
            return Response({"detail": "class and session are required"}, status=400)

        # All results for this class and session
        results = Result.objects.filter(
            school_class_id=school_class_id,
            session=session
        ).select_related("student", "subject")

        # Only students assigned to this teacher's classes
        allowed_students = TeachingAssignment.objects.filter(
            teacher=user, school_class_id=school_class_id
        ).values_list("school_class__students__id", flat=True)
        results = results.filter(student_id__in=allowed_students)

        # Build cumulative structure
        cumulative = {}
        for r in results:
            sid = r.student.id
            total = float(r.ca_score + r.exam_score)
            cumulative.setdefault(sid, {
                "student_id": sid,
                "student_name": r.student.full_name,
                "admission_number": r.student.admission_number,
                "total_score": 0,
                "terms": {}
            })
            cumulative[sid]["total_score"] += total
            cumulative[sid]["terms"][r.term] = {
                "ca_score": float(r.ca_score),
                "exam_score": float(r.exam_score),
                "total_score": total
            }

        # Sort by cumulative total and assign position
        sorted_data = sorted(cumulative.values(), key=lambda x: x["total_score"], reverse=True)
        for idx, item in enumerate(sorted_data):
            item["position"] = idx + 1

        return Response(sorted_data)


# -----------------------------
# DOWNLOAD STUDENT RESULT
# -----------------------------


class ResultDownloadView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, student_id, school_class_id, session):
        user = request.user
        if user.role != "teacher":
            raise PermissionDenied("Only teachers can download results.")

        # Ensure teacher is assigned to this class
        if not TeachingAssignment.objects.filter(
            teacher=user,
            school_class_id=school_class_id
        ).exists():
            raise PermissionDenied("You are not allowed to download results for this class.")

        # Get all results for student in class and session
        results = Result.objects.filter(
            student_id=student_id,
            school_class_id=school_class_id,
            session=session
        ).select_related("subject", "student")

        if not results.exists():
            return Response({"detail": "No results found"}, status=404)

        # Compute positions in this class for the latest term
        school_class = results.first().school_class
        term = results.first().term
        all_results = Result.objects.filter(
            school_class=school_class,
            term=term,
            session=session
        )

        student_totals = {}
        for r in all_results:
            sid = r.student.id
            student_totals[sid] = student_totals.get(sid, 0) + float(r.ca_score + r.exam_score)

        sorted_totals = sorted(student_totals.items(), key=lambda x: x[1], reverse=True)
        positions = {}
        pos = 1
        for i, (sid, total) in enumerate(sorted_totals):
            if i > 0 and total == sorted_totals[i-1][1]:
                positions[sid] = positions[sorted_totals[i-1][0]]  # tie
            else:
                positions[sid] = pos
            pos += 1

        # Prepare PDF
        buffer = BytesIO()
        p = canvas.Canvas(buffer, pagesize=A4)
        width, height = A4

        student = results.first().student

        # Title
        p.setFont("Helvetica-Bold", 16)
        p.drawString(50, height - 50, f"Report Card: {student.full_name}")
        p.setFont("Helvetica", 12)
        p.drawString(50, height - 70, f"Class: {school_class}")
        p.drawString(50, height - 90, f"Session: {session}")

        # Table headers
        start_y = height - 130
        x_positions = [50, 200, 300, 380, 460]  # subject, CA, Exam, Total, Position
        p.setFont("Helvetica-Bold", 12)
        headers = ["Subject", "CA Score", "Exam Score", "Total", "Position"]
        for i, h in enumerate(headers):
            p.drawString(x_positions[i], start_y, h)

        # Results
        row_y = start_y - 20
        p.setFont("Helvetica", 12)
        for r in results:
            total = float(r.ca_score + r.exam_score)
            p.drawString(x_positions[0], row_y, r.subject.name)
            p.drawString(x_positions[1], row_y, str(r.ca_score))
            p.drawString(x_positions[2], row_y, str(r.exam_score))
            p.drawString(x_positions[3], row_y, str(total))
            p.drawString(x_positions[4], row_y, str(positions.get(r.student.id)))
            row_y -= 20
            if row_y < 50:
                p.showPage()
                row_y = height - 50

        # Cumulative total
        cumulative_total = sum(float(r.ca_score + r.exam_score) for r in results)
        p.setFont("Helvetica-Bold", 12)
        p.drawString(50, row_y - 10, f"Cumulative Total: {cumulative_total}")

        # Save PDF
        p.showPage()
        p.save()
        buffer.seek(0)

        filename = f"Report-{student.full_name}-{session}.pdf"
        return FileResponse(buffer, as_attachment=True, filename=filename)





class AdminClassesListView(APIView):
    """
    Return a list of all classes for admin to link students
    """
    permission_classes = [IsAuthenticated, IsAdmin]

    def get(self, request):
        classes = SchoolClass.objects.all()
        data = [{"id": c.id, "name": c.name, "section": c.section} for c in classes]
        return Response(data)




class AdminClassAttendanceView(APIView):
    permission_classes = [IsAuthenticated, IsAdmin]

    def get(self, request, class_id):
        school_class = get_object_or_404(SchoolClass, id=class_id)

        students = school_class.students.all()
        result = []

        for student in students:
            attendance_qs = Attendance.objects.filter(
                student=student,
                school_class=school_class
            ).order_by("date")

            daily_map = defaultdict(lambda: {
                "morning": None,
                "afternoon": None,
            })

            for record in attendance_qs:
                daily_map[record.date][record.period] = {
                    "status": record.status,
                    "reason": record.reason,
                }

            result.append({
                "student_id": student.id,
                "student_name": student.full_name,
                "admission_number": student.admission_number,
                "attendance": [
                    {
                        "date": date,
                        "morning": data["morning"],
                        "afternoon": data["afternoon"],
                    }
                    for date, data in daily_map.items()
                ]
            })

        return Response({
            "class_id": school_class.id,
            "class_name": str(school_class),
            "students": result
        })
    




# class AdminResultDashboardView(APIView):
#     permission_classes = [IsAuthenticated, IsAdmin]

#     def get(self, request):
#         school_class = request.GET.get("class")
#         term = request.GET.get("term")
#         session = request.GET.get("session")

#         results = Result.objects.all()

#         if school_class:
#             results = results.filter(school_class_id=school_class)
#         if term:
#             results = results.filter(term=term)
#         if session:
#             results = results.filter(session=session)

#         results = results.select_related("student", "subject", "school_class")

#         data = {}
#         for r in results:
#             sid = r.student.id
#             data.setdefault(sid, {
#                 "student_id": sid,
#                 "student_name": r.student.full_name,
#                 "class": str(r.school_class),
#                 "subjects": [],
#                 "total": 0
#             })

#             total = float(r.ca_score + r.exam_score)
#             data[sid]["subjects"].append({
#                 "subject": r.subject.name,
#                 "ca": r.ca_score,
#                 "exam": r.exam_score,
#                 "total": total
#             })
#             data[sid]["total"] += total

#         # position ranking
#         students = list(data.values())
#         students.sort(key=lambda x: x["total"], reverse=True)

#         for i, s in enumerate(students):
#             s["position"] = i + 1

#         return Response(students)






class AdminResultDashboardView(APIView):
    permission_classes = [IsAuthenticated, IsAdmin]

    def get(self, request):
        school_class = request.GET.get("class")
        term = request.GET.get("term")
        session = request.GET.get("session")

        results = Result.objects.all()

        if school_class:
            results = results.filter(school_class_id=school_class)
        if term:
            results = results.filter(term__iexact=term)  # case-insensitive
        if session:
            results = results.filter(session__icontains=session)  # flexible match

        results = results.select_related("student", "subject", "school_class")

        data = {}
        for r in results:
            sid = r.student.id
            data.setdefault(sid, {
                "student_id": sid,
                "student_name": r.student.full_name,
                "class": str(r.school_class),
                "subjects": [],
                "total": 0
            })

            total = float(r.ca_score + r.exam_score)
            data[sid]["subjects"].append({
                "subject": r.subject.name,
                "ca": float(r.ca_score),
                "exam": float(r.exam_score),
                "total": total
            })
            data[sid]["total"] += total

        # position ranking
        students = list(data.values())
        students.sort(key=lambda x: x["total"], reverse=True)

        for i, s in enumerate(students):
            s["position"] = i + 1

        return Response(students)




class AdminSessionsView(APIView):
    permission_classes = [IsAuthenticated, IsAdmin]

    def get(self, request):
        sessions = Result.objects.values_list("session", flat=True).distinct()
        return Response(list(sessions))





def get_grade(score):
    if score >= 75:
        return "A1"
    elif score >= 70:
        return "B2"
    elif score >= 65:
        return "B3"
    elif score >= 60:
        return "C4"
    elif score >= 55:
        return "C5"
    elif score >= 50:
        return "C6"
    elif score >= 45:
        return "D7"
    elif score >= 40:
        return "E8"
    return "F9"


def get_remark(score):
    return "Pass" if score >= 50 else "Fail"


# def build_result_payload(results):
#     subjects = []
#     total = 0

#     for r in results:
#         subject_total = float(r.ca_score + r.exam_score)
#         total += subject_total

#         subjects.append({
#             "subject": r.subject.name,
#             "ca": float(r.ca_score),
#             "exam": float(r.exam_score),
#             "total": subject_total,
#             "grade": get_grade(subject_total),
#             "remark": get_remark(subject_total),
#         })

#     return subjects, total

def ordinal(n):
    """Convert integer n to ordinal string: 1 -> 1st, 2 -> 2nd, etc."""
    if 10 <= n % 100 <= 20:
        suffix = "th"
    else:
        suffix = {1: "st", 2: "nd", 3: "rd"}.get(n % 10, "th")
    return f"{n}{suffix}"



def build_result_payload(results):
    """Build structured subjects and total"""
    subjects = []
    total_score = 0
    for r in results:
        sub_total = float(r.ca_score + r.exam_score)
        total_score += sub_total
        subjects.append({
            "subject": r.subject.name,
            "ca": float(r.ca_score),
            "exam": float(r.exam_score),
            "total": sub_total,
            "grade": getattr(r, "grade", ""),   # optional
            "remark": getattr(r, "remark", ""), # optional
        })
    return subjects, total_score




class StudentResultView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        term = request.GET.get("term")
        session = request.GET.get("session")

        # Get all results for the student that are published
        student_results = Result.objects.filter(
            student=request.user,
            is_published=True
        )

        if term:
            student_results = student_results.filter(term__iexact=term)
        if session:
            student_results = student_results.filter(session__icontains=session)

        if not student_results.exists():
            return Response({"detail": "No result found"}, status=404)

        student_results = student_results.select_related("subject", "school_class")

        # Build subjects and total for this student
        subjects = []
        total = 0
        for r in student_results:
            subject_total = float(r.ca_score + r.exam_score)
            total += subject_total
            subjects.append({
                "subject": r.subject.name,
                "ca": float(r.ca_score),
                "exam": float(r.exam_score),
                "total": subject_total,
            })

        # Calculate position among all students in same class, term, session
        school_class = student_results.first().school_class
        all_results = Result.objects.filter(
            school_class=school_class,
            term__iexact=term,
            session__icontains=session,
            is_published=True
        ).values("student").annotate(total_score=Sum(F("ca_score") + F("exam_score"))).order_by("-total_score")

        # Find this student's position
        position = 0
        for idx, s in enumerate(all_results, start=1):
            if s["student"] == request.user.id:
                position = idx
                break

        return Response({
            "student_name": request.user.full_name,
            "admission_number": request.user.admission_number,
            "class": str(school_class),
            "term": term,
            "session": session,
            "subjects": subjects,
            "total": total,
            "position": position,  # <-- added
        })



class StudentResultPDFView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        term = request.GET.get("term")
        session = request.GET.get("session")

        # Fetch student's results
        results = Result.objects.filter(
            student=request.user,
            term__iexact=term,
            session__icontains=session,
            is_published=True
        ).select_related("subject", "school_class")

        if not results.exists():
            return HttpResponse("No result found", content_type="text/plain", status=404)

        # Compute subjects and total
        subjects = []
        total_score = Decimal(0)
        for r in results:
            subject_total = r.ca_score + r.exam_score
            total_score += subject_total
            subjects.append({
                "subject": r.subject.name,
                "ca": float(r.ca_score),
                "exam": float(r.exam_score),
                "total": float(subject_total),
                "grade": "",  # Optional: add grading logic here
                "remark": "",
            })

        # Compute position in class
        school_class = results.first().school_class
        all_students_results = (
            Result.objects.filter(
                school_class=school_class,
                term__iexact=term,
                session__icontains=session,
                is_published=True
            )
            .values("student")
            .annotate(total_score=Sum(F("ca_score") + F("exam_score")))
            .order_by("-total_score")
        )

        # Determine the student position
        position = 1
        for i, s in enumerate(all_students_results, start=1):
            if s["student"] == request.user.id:
                position = i
                break

        # Create PDF
        response = HttpResponse(content_type="application/pdf")
        response['Content-Disposition'] = 'attachment; filename="result.pdf"'
        p = canvas.Canvas(response, pagesize=A4)
        width, height = A4
        y = height - 50

        # Header
        p.setFont("Helvetica-Bold", 16)
        p.drawCentredString(width / 2, y, "SCHOOL NAME HERE")
        y -= 25

        p.setFont("Helvetica", 11)
        p.drawCentredString(width / 2, y, "STUDENT TERMINAL RESULT")
        y -= 40

        student = request.user

        # Student Info + Position
        p.setFont("Helvetica", 10)
        p.drawString(50, y, f"Name: {student.full_name}")
        p.drawString(300, y, f"Admission No: {student.admission_number}")
        y -= 18
        p.drawString(50, y, f"Class: {school_class}")
        p.drawString(300, y, f"Position: {ordinal(position)}")
        y -= 18
        p.drawString(50, y, f"Term: {term}")
        p.drawString(300, y, f"Session: {session}")
        y -= 30

        # Table header
        p.setFont("Helvetica-Bold", 10)
        p.drawString(50, y, "Subject")
        p.drawString(220, y, "CA")
        p.drawString(260, y, "Exam")
        p.drawString(310, y, "Total")
        p.drawString(360, y, "Grade")
        p.drawString(420, y, "Remark")
        y -= 15

        p.setFont("Helvetica", 10)

        for sub in subjects:
            p.drawString(50, y, sub["subject"])
            p.drawString(220, y, str(sub["ca"]))
            p.drawString(260, y, str(sub["exam"]))
            p.drawString(310, y, str(sub["total"]))
            p.drawString(360, y, sub["grade"])
            p.drawString(420, y, sub["remark"])
            y -= 15
            if y < 50:
                p.showPage()
                y = height - 50

        y -= 20
        p.setFont("Helvetica-Bold", 11)
        p.drawString(50, y, f"TOTAL SCORE: {float(total_score)}")

        p.showPage()
        p.save()

        return response





class StudentSessionsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # Only sessions where this student has published results
        sessions = Result.objects.filter(student=request.user, is_published=True).values_list("session", flat=True).distinct()
        return Response(list(sessions))





class ParentChildrenView(APIView):
    """Return all children of the logged-in parent"""
    permission_classes = [IsAuthenticated]

    def get(self, request):
        children = request.user.children.all()  # assuming parent->children relation
        serializer = ChildSerializer(children, many=True)
        return Response(serializer.data)


class ParentChildResultView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, student_id):
        term = request.GET.get("term")
        session = request.GET.get("session")

        # Check if the child belongs to parent
        if not request.user.children.filter(id=student_id).exists():
            return Response({"detail": "Unauthorized"}, status=403)

        results = Result.objects.filter(
            student_id=student_id,
            is_published=True
        )
        if term:
            results = results.filter(term__iexact=term)
        if session:
            results = results.filter(session__icontains=session)
        if not results.exists():
            return Response({"detail": "No results found"}, status=404)

        school_class = results.first().school_class

        # Compute subjects & total
        subjects = []
        total_score = Decimal(0)
        for r in results.select_related("subject"):
            subject_total = r.ca_score + r.exam_score
            total_score += subject_total
            subjects.append({
                "subject": r.subject.name,
                "ca": float(r.ca_score),
                "exam": float(r.exam_score),
                "total": float(subject_total),
                "grade": "",
                "remark": "",
            })

        # Compute position
        all_students_results = (
            Result.objects.filter(
                school_class=school_class,
                term__iexact=term,
                session__icontains=session,
                is_published=True
            )
            .values("student")
            .annotate(total_score=Sum(F("ca_score") + F("exam_score")))
            .order_by("-total_score")
        )
        position = 1
        for i, s in enumerate(all_students_results, start=1):
            if s["student"] == student_id:
                position = i
                break

        data = {
            "student_id": student_id,
            "student_name": results.first().student.full_name,
            "admission_number": results.first().student.admission_number,
            "school_class": str(school_class),
            "term": term,
            "session": session,
            "subjects": subjects,
            "total": float(total_score),
            "position": ordinal(position),
        }
        return Response(data)


class ParentChildAttendanceView(APIView):
    """Return attendance overview for a child"""
    permission_classes = [IsAuthenticated]

    def get(self, request, student_id):
        if not request.user.children.filter(id=student_id).exists():
            return Response({"detail": "Unauthorized"}, status=403)

        attendance = Attendance.objects.filter(student_id=student_id).order_by("date")
        data = {}
        for att in attendance:
            date_str = att.date.strftime("%Y-%m-%d")
            data.setdefault(date_str, {"morning": "-", "afternoon": "-"})
            data[date_str][att.period] = att.status

        return Response(data)


class ParentChildResultPDFView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, student_id):
        term = request.GET.get("term")
        session = request.GET.get("session")

        if not request.user.children.filter(id=student_id).exists():
            return Response({"detail": "Unauthorized"}, status=403)

        results = Result.objects.filter(
            student_id=student_id,
            term__iexact=term,
            session__icontains=session,
            is_published=True
        ).select_related("subject", "school_class")

        if not results.exists():
            return HttpResponse("No result found", content_type="text/plain", status=404)

        # Compute subjects & total
        subjects = []
        total_score = Decimal(0)
        for r in results:
            subject_total = r.ca_score + r.exam_score
            total_score += subject_total
            subjects.append({
                "subject": r.subject.name,
                "ca": float(r.ca_score),
                "exam": float(r.exam_score),
                "total": float(subject_total),
                "grade": "",
                "remark": "",
            })

        # Compute position
        school_class = results.first().school_class
        all_students_results = (
            Result.objects.filter(
                school_class=school_class,
                term__iexact=term,
                session__icontains=session,
                is_published=True
            )
            .values("student")
            .annotate(total_score=Sum(F("ca_score") + F("exam_score")))
            .order_by("-total_score")
        )
        position = 1
        for i, s in enumerate(all_students_results, start=1):
            if s["student"] == student_id:
                position = i
                break

        # Generate PDF
        response = HttpResponse(content_type="application/pdf")
        response['Content-Disposition'] = f'attachment; filename="{results.first().student.full_name}_result.pdf"'

        p = canvas.Canvas(response, pagesize=A4)
        width, height = A4
        y = height - 50

        p.setFont("Helvetica-Bold", 16)
        p.drawCentredString(width / 2, y, "SCHOOL NAME")
        y -= 25
        p.setFont("Helvetica", 11)
        p.drawCentredString(width / 2, y, "STUDENT TERMINAL RESULT")
        y -= 40

        student = results.first().student
        p.setFont("Helvetica", 10)
        p.drawString(50, y, f"Name: {student.full_name}")
        p.drawString(300, y, f"Admission No: {student.admission_number}")
        y -= 18
        p.drawString(50, y, f"Class: {school_class}")
        p.drawString(300, y, f"Position: {ordinal(position)}")
        y -= 18
        p.drawString(50, y, f"Term: {term}")
        p.drawString(300, y, f"Session: {session}")
        y -= 30

        # Table header
        p.setFont("Helvetica-Bold", 10)
        p.drawString(50, y, "Subject")
        p.drawString(220, y, "CA")
        p.drawString(260, y, "Exam")
        p.drawString(310, y, "Total")
        p.drawString(360, y, "Grade")
        p.drawString(420, y, "Remark")
        y -= 15

        p.setFont("Helvetica", 10)
        for sub in subjects:
            p.drawString(50, y, sub["subject"])
            p.drawString(220, y, str(sub["ca"]))
            p.drawString(260, y, str(sub["exam"]))
            p.drawString(310, y, str(sub["total"]))
            p.drawString(360, y, sub["grade"])
            p.drawString(420, y, sub["remark"])
            y -= 15
            if y < 50:
                p.showPage()
                y = height - 50

        y -= 20
        p.setFont("Helvetica-Bold", 11)
        p.drawString(50, y, f"TOTAL SCORE: {float(total_score)}")

        p.showPage()
        p.save()
        return response
