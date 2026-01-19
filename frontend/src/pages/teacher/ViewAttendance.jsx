import { useState, useEffect } from "react";
import api from "../../api/axios";

export default function ViewAttendance() {
  const [teacherClasses, setTeacherClasses] = useState([]);
  const [selectedClassId, setSelectedClassId] = useState(null);
  const [attendanceData, setAttendanceData] = useState([]);
  const [expandedStudents, setExpandedStudents] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch teacher's classes
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const res = await api.get("/academics/teacher/assignments/");
        console.log("Teacher classes:", res.data);
        if (res.data.length === 0) {
          setError("You are not assigned to any classes.");
          return;
        }
        setTeacherClasses(res.data);
        setSelectedClassId(res.data[0].id); // default to first class
      } catch (err) {
        console.error(err);
        setError("Failed to fetch your classes.");
      }
    };
    fetchClasses();
  }, []);

  // Fetch attendance for selected class
  useEffect(() => {
    if (!selectedClassId) return;

    const fetchAttendance = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await api.get(
          `/academics/class-teacher/classes/${selectedClassId}/attendance/`
        );
        // Backend already returns morning/afternoon correctly
        setAttendanceData(res.data);
      } catch (err) {
        console.error(err);
        if (err.response?.status === 403) {
          setError("You are not the class teacher for this class.");
        } else if (err.response?.status === 404) {
          setError("Attendance not found for this class.");
        } else {
          setError("Failed to fetch attendance.");
        }
        setAttendanceData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAttendance();
  }, [selectedClassId]);

  // Toggle student attendance display
  const toggleStudent = (studentId) => {
    setExpandedStudents((prev) => ({
      ...prev,
      [studentId]: !prev[studentId],
    }));
  };

  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div>
      {/* Class selection */}
      <div className="mb-4">
        <label className="mr-2 font-semibold">Select Class:</label>
        <select
          value={selectedClassId || ""}
          onChange={(e) => setSelectedClassId(Number(e.target.value))}
          className="p-2 border rounded"
        >
          {teacherClasses.length === 0 ? (
            <option value="">No classes assigned</option>
          ) : (
            teacherClasses.map((cls) => (
              <option key={cls.id} value={cls.id}>
                {cls.name}
                {cls.section ? ` - ${cls.section}` : ""}
              </option>
            ))
          )}
        </select>
      </div>

      {loading ? (
        <p>Loading attendance...</p>
      ) : attendanceData.length === 0 ? (
        <p>No students or attendance records found.</p>
      ) : (
        attendanceData.map((student) => (
          <div
            key={student.student_id}
            className="mb-4 border p-4 rounded-lg bg-white shadow-sm cursor-pointer"
            onClick={() => toggleStudent(student.student_id)}
          >
            <h3 className="font-bold">{student.student_name}</h3>

            {expandedStudents[student.student_id] && (
              <table className="w-full table-auto border-collapse border border-gray-300 mt-2">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border px-2 py-1">Date</th>
                    <th className="border px-2 py-1">Morning</th>
                    <th className="border px-2 py-1">Afternoon</th>
                  </tr>
                </thead>
                <tbody>
                  {student.attendance.map((day) => (
                    <tr key={`${student.student_id}-${day.date}`}>
                      <td className="border px-2 py-1">{day.date}</td>
                      <td
                        className={`border px-2 py-1 ${
                          day.morning?.status === "present"
                            ? "bg-green-100"
                            : day.morning?.status === "absent"
                            ? "bg-red-100"
                            : ""
                        }`}
                      >
                        {day.morning
                          ? day.morning.status.charAt(0).toUpperCase() +
                            day.morning.status.slice(1)
                          : "-"}
                        {day.morning?.status === "absent" &&
                          day.morning.reason && (
                            <div className="text-sm text-gray-600">
                              Reason: {day.morning.reason}
                            </div>
                          )}
                      </td>
                      <td
                        className={`border px-2 py-1 ${
                          day.afternoon?.status === "present"
                            ? "bg-green-100"
                            : day.afternoon?.status === "absent"
                            ? "bg-red-100"
                            : ""
                        }`}
                      >
                        {day.afternoon
                          ? day.afternoon.status.charAt(0).toUpperCase() +
                            day.afternoon.status.slice(1)
                          : "-"}
                        {day.afternoon?.status === "absent" &&
                          day.afternoon.reason && (
                            <div className="text-sm text-gray-600">
                              Reason: {day.afternoon.reason}
                            </div>
                          )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        ))
      )}
    </div>
  );
}
