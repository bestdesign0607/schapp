from rest_framework import serializers
from .models import Subject, SchoolClass, TeachingAssignment, Result, Attendance
from django.contrib.auth import get_user_model
from django.db.models import Sum


User = get_user_model()

class SubjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subject
        fields = "__all__"


class SchoolClassSerializer(serializers.ModelSerializer):
    class Meta:
        model = SchoolClass
        fields = "__all__"


class TeachingAssignmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = TeachingAssignment
        fields = "__all__"

    def validate_teacher(self, teacher):
        if teacher.role != "teacher":
            raise serializers.ValidationError("User must be a teacher")
        return teacher




class TeachingAssignmentReadSerializer(serializers.ModelSerializer):
    school_class = SchoolClassSerializer()
    subject = SubjectSerializer()

    class Meta:
        model = TeachingAssignment
        fields = "__all__"




class AssignClassTeacherSerializer(serializers.Serializer):
    school_class = serializers.PrimaryKeyRelatedField(
        queryset=SchoolClass.objects.all()
    )
    teacher = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.filter(role="teacher")
    )

    def save(self):
        school_class = self.validated_data["school_class"]
        teacher = self.validated_data["teacher"]

        school_class.class_teacher = teacher
        school_class.save()

        return school_class





# =========================
# RESULT SERIALIZERS
# =========================
class ResultCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Result
        fields = [
            "student",
            "subject",
            "school_class",
            "ca_score",
            "exam_score",
            "term",
            "session",
        ]

    def validate(self, attrs):
        request = self.context["request"]
        user = request.user

        subject = attrs["subject"]
        school_class = attrs["school_class"]

        is_assigned = TeachingAssignment.objects.filter(
            teacher=user,
            subject=subject,
            school_class=school_class
        ).exists()

        if not is_assigned:
            raise serializers.ValidationError(
                "You are not assigned to teach this subject in this class."
            )

        return attrs



class ResultApproveSerializer(serializers.ModelSerializer):
    """
    Used by CLASS TEACHER to approve & publish
    """

    class Meta:
        model = Result
        fields = ["approved_by_class_teacher", "is_published"]

    def validate(self, attrs):
        user = self.context["request"].user
        result = self.instance

        if result.school_class.class_teacher != user:
            raise serializers.ValidationError(
                "Only the class teacher can approve this result."
            )

        return attrs


class ResultListSerializer(serializers.ModelSerializer):
    student_name = serializers.CharField(source="student.full_name", read_only=True)
    admission_number = serializers.CharField(source="student.admission_number", read_only=True)
    subject_name = serializers.CharField(source="subject.name", read_only=True)
    total_score = serializers.SerializerMethodField()
    cumulative_total = serializers.SerializerMethodField()
    position = serializers.IntegerField(read_only=True)  # assigned in view

    class Meta:
        model = Result
        fields = [
            "id",
            "student",
            "student_name",
            "admission_number",
            "subject",
            "subject_name",
            "school_class",
            "ca_score",
            "exam_score",
            "total_score",
            "term",
            "session",
            "position",
            "cumulative_total",
        ]

    def get_total_score(self, obj):
        return float(obj.ca_score + obj.exam_score)

    def get_cumulative_total(self, obj):
        # Sum total for this student in the session across all terms
        session = obj.session
        student = obj.student
        total = Result.objects.filter(student=student, session=session).aggregate(
            total_sum=Sum("ca_score") + Sum("exam_score")
        )["total_sum"] or 0
        return float(total)
    

# =========================
# ATTENDANCE SERIALIZER
# =========================
# class AttendanceSerializer(serializers.ModelSerializer):
#     student_name = serializers.CharField(source="student.full_name", read_only=True)

#     class Meta:
#         model = Attendance
#         fields = [
#             "id",
#             "student",
#             "student_name",
#             "school_class",
#             "date",
#             "period",
#             "status",
#         ]

#     def validate(self, attrs):
#         user = self.context["request"].user
#         school_class = attrs["school_class"]

#         if school_class.class_teacher != user:
#             raise serializers.ValidationError(
#                 "Only the class teacher can mark attendance."
#             )

#         return attrs

#     def create(self, validated_data):
#         validated_data["marked_by"] = self.context["request"].user
#         return super().create(validated_data)



from rest_framework import serializers
from .models import Attendance

class AttendanceSerializer(serializers.ModelSerializer):
    student_name = serializers.CharField(source="student.full_name", read_only=True)

    class Meta:
        model = Attendance
        fields = [
            "id",
            "student",
            "student_name",
            "school_class",
            "date",
            "period",
            "status",
            "reason",  # add this if you track absent reason
        ]

    def validate(self, attrs):
        user = self.context["request"].user
        school_class = attrs["school_class"]

        if school_class.class_teacher != user:
            raise serializers.ValidationError(
                "Only the class teacher can mark attendance."
            )

        return attrs

    def create(self, validated_data):
        validated_data["marked_by"] = self.context["request"].user
        return super().create(validated_data)




# class StudentProfileSerializer(serializers.ModelSerializer):
#     student_name = serializers.CharField(source="student.full_name", read_only=True)
#     parent_name = serializers.CharField(source="parent.full_name", read_only=True)
#     class_name = serializers.CharField(source="school_class.__str__", read_only=True)

#     class Meta:
#         model = StudentProfile
#         fields = [
#             "id",
#             "student",
#             "student_name",
#             "parent",
#             "parent_name",
#             "school_class",
#             "class_name",
#             "admission_number",
#         ]

#     def validate_student(self, student):
#         if student.role != "student":
#             raise serializers.ValidationError("Selected user is not a student")
#         return student

#     def validate_parent(self, parent):
#         if parent and parent.role != "parent":
#             raise serializers.ValidationError("Selected user is not a parent")
#         return parent
    



class ParentChildLinkSerializer(serializers.Serializer):
    parent_id = serializers.IntegerField()
    student_ids = serializers.ListField(
        child=serializers.IntegerField()
    )

    def validate(self, data):
        parent = User.objects.filter(
            id=data["parent_id"], role="parent"
        ).first()
        if not parent:
            raise serializers.ValidationError("Invalid parent")

        students = User.objects.filter(
            id__in=data["student_ids"], role="student"
        )
        if not students.exists():
            raise serializers.ValidationError("Invalid students")

        data["parent"] = parent
        data["students"] = students
        return data

    def save(self):
        parent = self.validated_data["parent"]
        students = self.validated_data["students"]
        parent.children.set(students)
        return parent
    







class AdminTeacherAssignmentSerializer(serializers.ModelSerializer):
    teacher_id = serializers.IntegerField(source="teacher.id")
    teacher_name = serializers.CharField(source="teacher.full_name")
    staff_id = serializers.CharField(source="teacher.staff_id")
    subject = serializers.CharField(source="subject.name")
    school_class = serializers.CharField(source="school_class.name")

    class Meta:
        model = TeachingAssignment
        fields = [
            "teacher_id",
            "staff_id",
            "teacher_name",
            "subject",
            "school_class",
        ]







class AdminClassTeacherSerializer(serializers.ModelSerializer):
    class_teacher_id = serializers.IntegerField(source="class_teacher.id")
    class_teacher_name = serializers.CharField(source="class_teacher.full_name")
    staff_id = serializers.CharField(source="class_teacher.staff_id")

    class Meta:
        model = SchoolClass
        fields = [
            "id",
            "name",
            "section",
            "class_teacher_id",
            "class_teacher_name",
            "staff_id",
        ]







class AdminStudentListSerializer(serializers.ModelSerializer):
    parents = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = [
            "id",
            "full_name",
            "admission_number",
            "parents",
        ]

    def get_parents(self, obj):
        return [
            {
                "id": p.id,
                "name": p.full_name,
                "phone": p.phone,
            }
            for p in obj.parents.all()
        ]



class StudentWithParentsSerializer(serializers.ModelSerializer):
    parents = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'full_name', 'admission_number', 'parents']

    def get_parents(self, obj):
        # Make sure to return id and full_name
        return [{'id': p.id, 'full_name': p.full_name} for p in obj.parents.all()]



class SubjectScoreSerializer(serializers.Serializer):
    subject_id = serializers.IntegerField()
    subject_name = serializers.CharField()
    ca_score = serializers.FloatField()
    exam_score = serializers.FloatField()
    total_score = serializers.FloatField()

class StudentTermResultSerializer(serializers.Serializer):
    student_id = serializers.IntegerField()
    student_name = serializers.CharField()
    admission_number = serializers.CharField()
    subjects = SubjectScoreSerializer(many=True)
    term_total = serializers.FloatField()
    position = serializers.IntegerField()





class AdminLinkSubjectsSerializer(serializers.Serializer):
        subject_ids = serializers.ListField(
            child=serializers.IntegerField(),
            allow_empty=False,
            help_text="List of subject IDs to link to the class"
        )

        class Meta:
            fields = ["subject_ids"]


class DailyAttendanceSerializer(serializers.Serializer):
    date = serializers.DateField()
    morning = serializers.DictField(allow_null=True)
    afternoon = serializers.DictField(allow_null=True)


class StudentAttendanceOverviewSerializer(serializers.Serializer):
    student_id = serializers.IntegerField()
    student_name = serializers.CharField()
    attendance = DailyAttendanceSerializer(many=True)





class ChildSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "full_name", "admission_number", "school_classes"]



class ChildResultSerializer(serializers.Serializer):
    student_id = serializers.IntegerField()
    student_name = serializers.CharField()
    admission_number = serializers.CharField()
    school_class = serializers.CharField()
    term = serializers.CharField()
    session = serializers.CharField()
    subjects = SubjectScoreSerializer(many=True)
    total = serializers.FloatField()
    position = serializers.CharField()




class ParentChildResultSerializer(serializers.Serializer):
    student_id = serializers.IntegerField()
    student_name = serializers.CharField()
    admission_number = serializers.CharField()
    school_class = serializers.CharField()
    subjects = serializers.ListField()
    total = serializers.FloatField()
    position = serializers.CharField()