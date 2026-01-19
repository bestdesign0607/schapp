# from django.urls import path
# from .views import (
#     AdminLoginView,
#     LoginView,
#     CreateTeacherView,
#     CreateStudentView,
#     CreateParentView,
#     TeachersListView
# )

# urlpatterns = [
#     # Authentication
#     path("login/", LoginView.as_view(), name="login"),
#     path("admin/login/", AdminLoginView.as_view(), name="admin-login"),

#     # Account creation API endpoints (moved outside /admin/)
#     path("teachers/", CreateTeacherView.as_view(), name="create-teacher"),
#     path("students/", CreateStudentView.as_view(), name="create-student"),
#     path("parents/", CreateParentView.as_view(), name="create-parent"),
#     path("teachers/", TeachersListView.as_view(), name="list-teachers"),
    
# ]










from django.urls import path
from .views import (
    AdminLoginView,
    LinkStudentsToClassView,
    LoginView,
    CreateTeacherView,
    CreateStudentView,
    CreateParentView,
    ParentListView,
    StudentListView,
    TeachersListView
)

urlpatterns = [
    # Authentication
    path("login/", LoginView.as_view(), name="login"),
    path("admin/login/", AdminLoginView.as_view(), name="admin-login"),

    # Account creation API endpoints
    path("teachers/create/", CreateTeacherView.as_view(), name="create-teacher"),
    path("students/create/", CreateStudentView.as_view(), name="create-student"),
    path("parents/create/", CreateParentView.as_view(), name="create-parent"),

    # Teachers list
    path("teachers/", TeachersListView.as_view(), name="list-teachers"),

    path("parents/", ParentListView.as_view(), name="parent-list"),
    path("students/", StudentListView.as_view(), name="student-list"),

    path('admin/classes/<int:class_id>/link-students/', LinkStudentsToClassView.as_view(), name='link-students'),
]
