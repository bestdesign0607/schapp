from django.urls import path

from accounts.views import LinkStudentsToClassView
from .views import (
    AdminClassAttendanceView,
    AdminClassTeachersView,
    AdminClassesListView,
    AdminLinkParentView,
    AdminLinkSubjectsView,
    AdminResultDashboardView,
    AdminSessionsView,
    AdminStudentsView,
    AdminSubjectsListView,
    AdminTeachersAssignmentsView,
    AssignClassTeacherView,
    AttendanceCreateView,
    AttendanceListView,
    ClassAttendanceOverviewView,
    ClassStudentsView,
    ParentChildAttendanceView,
    ParentChildResultPDFView,
    ParentChildResultView,
    ParentChildrenView,
    ResultApproveView,
    ResultCreateView,
    ResultDownloadView,
    ResultListView,
    StudentResultPDFView,
    StudentResultView,
    StudentSessionsView,

    SubjectCreateView,
    SubjectListView,
    SchoolClassCreateView,
    SchoolClassListView,
    TeacherResultCumulativeView,
    TeacherResultListView,
    TeacherStudentsView,
    TeachingAssignmentCreateView,
    TeacherAssignmentsView
)

urlpatterns = [
    # Subjects
    path("admin/subjects/create/", SubjectCreateView.as_view()),
    path("subjects/", SubjectListView.as_view()),

    # Classes
    path("admin/classes/create/", SchoolClassCreateView.as_view()),
    path("classes/", SchoolClassListView.as_view()),

    # Teaching Assignments
    path("admin/assignments/create/", TeachingAssignmentCreateView.as_view()),
    path("teacher/assignments/", TeacherAssignmentsView.as_view()),
    path("admin/assign-class-teacher/", AssignClassTeacherView.as_view()),

    # Results
    path("teacher/results/create/", ResultCreateView.as_view()),
    path("class-teacher/results/<int:pk>/approve/", ResultApproveView.as_view()),
    path("results/", ResultListView.as_view()),

    # Attendance
    path("class-teacher/attendance/create/", AttendanceCreateView.as_view()),
    path("attendance/", AttendanceListView.as_view()),

    path("admin/link-parent/", AdminLinkParentView.as_view(), name="link-parent"),
    path("admin/teachers-assignments/", AdminTeachersAssignmentsView.as_view(), name="teachers-assignments"),
    path("admin/class-teachers/", AdminClassTeachersView.as_view(), name="class-teachers"),
    path("admin/students/", AdminStudentsView.as_view(), name="students-list"), 

    path("teacher/students/", TeacherStudentsView.as_view(), name="teacher-students"),

    path("teacher/results/", TeacherResultListView.as_view(), name="teacher-results"),
    path("teacher/results/cumulative/", TeacherResultCumulativeView.as_view(), name="teacher-results-cumulative"),
    path("teacher/results/<int:student_id>/download/", ResultDownloadView.as_view(), name="teacher-result-download"),

    path("admin/classes/", AdminClassesListView.as_view(), name="admin-classes"),
    path("admin/link-students-to-class/<int:class_id>/", LinkStudentsToClassView.as_view(), name="link-students-to-class"),
    path("admin/class/<int:class_id>/subjects/", AdminLinkSubjectsView.as_view(), name="admin-link-subjects"),
    # urls.py
    path("admin/subjects/", AdminSubjectsListView.as_view(), name="admin-subjects-list"),

    path("class-teacher/classes/<int:class_id>/students/", ClassStudentsView.as_view(), name="class-students"),

    path("class-teacher/classes/<int:class_id>/attendance/", ClassAttendanceOverviewView.as_view(), name="class-attendance-overview"),
    path("admin/classes/<int:class_id>/attendance/", AdminClassAttendanceView.as_view(), name="admin-class-attendance"),
    path("admin/results/", AdminResultDashboardView.as_view(), name="admin-result-dashboard" ),
    path("admin/sessions/", AdminSessionsView.as_view(), name="admin-sessions"),
    
    path("student/results/download/", StudentResultPDFView.as_view(), name="student-result-download"),
    path("student/results/", StudentResultView.as_view(), name="student-results"),
    path("student/sessions/", StudentSessionsView.as_view(), name="student-sessions"),
    path("parent/children/", ParentChildrenView.as_view(), name="parent-children"),
    path("parent/child/<int:student_id>/results/", ParentChildResultView.as_view(), name="parent-child-results"),
    path("parent/child/<int:student_id>/results/download/", ParentChildResultPDFView.as_view(), name="parent-child-results-pdf"),
    path("parent/child/<int:student_id>/attendance/", ParentChildAttendanceView.as_view(), name="parent-child-attendance"),
    
]
