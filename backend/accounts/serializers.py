from academics.models import SchoolClass, TeachingAssignment
from rest_framework import serializers
from django.contrib.auth import authenticate, get_user_model

User = get_user_model()


# -------------------------
# Teacher Serializer
# -------------------------
class TeacherCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["full_name", "email", "staff_id", "phone", "state_of_origin"]

    def create(self, validated_data):
        # Use state_of_origin as password
        password = validated_data.pop("state_of_origin")

        # Pop other fields explicitly
        staff_id = validated_data.pop("staff_id")
        full_name = validated_data.pop("full_name", "")
        email = validated_data.pop("email", "")
        phone = validated_data.pop("phone", "")

        # Create user without passing **validated_data to avoid duplicates
        return User.objects.create_user(
            staff_id=staff_id,
            password=password,
            full_name=full_name,
            email=email,
            phone=phone,
            state_of_origin=password,  # store same value as password
            role="teacher",
        )




# -------------------------
# Student Serializer
# -------------------------
class ParentCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["full_name", "admission_number", "phone", "state_of_origin", "religion"]

    def create(self, validated_data):
        # Parent password = state_of_origin
        password = validated_data.get("state_of_origin", "defaultpassword")
        return User.objects.create_user(
            admission_number=validated_data["admission_number"],
            password=password,
            full_name=validated_data.get("full_name", ""),
            phone=validated_data.get("phone", ""),
            state_of_origin=password,
            religion=validated_data.get("religion", ""),
            role="parent",
        )



# -------------------------
# Parent Serializer
# -------------------------
class StudentCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["full_name", "admission_number", "state_of_origin"]

    def create(self, validated_data):
        # Student password = state_of_origin
        password = validated_data.get("state_of_origin", "defaultpassword")
        return User.objects.create_user(
            admission_number=validated_data["admission_number"],
            password=password,
            full_name=validated_data.get("full_name", ""),
            state_of_origin=password,
            role="student",
        )


# -------------------------
# Login Serializer
# -------------------------


class LoginSerializer(serializers.Serializer):
    role = serializers.ChoiceField(choices=["teacher", "student", "parent"])
    identifier = serializers.CharField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        role = data["role"]
        identifier = data["identifier"]
        password = data["password"]

        request = self.context.get("request")

        if role in ["student", "parent"]:
            user = authenticate(request=request, admission_number=identifier, password=password)
        else:
            user = authenticate(request=request, username=identifier, password=password)

        if not user:
            raise serializers.ValidationError("Invalid login credentials")

        if not user.is_active:
            raise serializers.ValidationError("Account disabled")

        # ✅ Return User instance, not dict
        return user










class AdminLoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        request = self.context.get("request")

        user = authenticate(
            request=request,
            username=data["username"],
            password=data["password"]
        )

        if not user:
            raise serializers.ValidationError("Invalid admin credentials")

        if not user.is_active:
            raise serializers.ValidationError("Account disabled")

        if not user.is_staff or user.role != "admin":
            raise serializers.ValidationError("Not authorized as admin")

        return user
    






class TeacherSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        # Only fields that exist on your custom User model
        fields = ["id", "staff_id", "full_name", "email", "role", "phone"]





class TeacherAssignmentListSerializer(serializers.ModelSerializer):
    teacher_name = serializers.CharField(source="teacher.full_name")
    teacher_id = serializers.IntegerField(source="teacher.id")
    subject_name = serializers.CharField(source="subject.name")
    class_name = serializers.CharField(source="school_class.name")

    class Meta:
        model = TeachingAssignment
        fields = [
            "teacher_id",
            "teacher_name",
            "subject_name",
            "class_name",
        ]



class ClassTeacherListSerializer(serializers.ModelSerializer):
    class_teacher_name = serializers.CharField(
        source="class_teacher.full_name"
    )
    class_teacher_id = serializers.IntegerField(
        source="class_teacher.id"
    )

    class Meta:
        model = SchoolClass
        fields = [
            "id",
            "name",
            "section",
            "class_teacher_id",
            "class_teacher_name",
        ]
    




class StudentAdminListSerializer(serializers.ModelSerializer):
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
            {"id": p.id, "name": p.full_name}
            for p in obj.parents.all()
        ]





class LinkStudentsSerializer(serializers.Serializer):
    student_ids = serializers.ListField(
        child=serializers.IntegerField(),
        allow_empty=False,
        help_text="List of student IDs to link to this class"
    )

    def validate_student_ids(self, value):
        # Ensure all IDs correspond to students
        students = User.objects.filter(id__in=value, role="student")
        if students.count() != len(value):
            raise serializers.ValidationError("Some IDs are invalid or not students")
        return value