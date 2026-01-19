import { useEffect, useState } from "react";
import api from "../../api/axios";

export default function AdminViewAttendance() {
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [students, setStudents] = useState([]);
  const [classInfo, setClassInfo] = useState(null);
  const [openStudentId, setOpenStudentId] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch classes
  useEffect(() => {
    api.get("/academics/admin/classes/")
      .then(res => setClasses(res.data))
      .catch(console.error);
  }, []);

  // Fetch attendance per class
  useEffect(() => {
    if (!selectedClass) return;

    setLoading(true);
    api.get(`/academics/admin/classes/${selectedClass}/attendance/`)
      .then(res => {
        setStudents(res.data.students || []);
        setClassInfo(res.data.class || null);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [selectedClass]);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Admin Attendance View</h2>

      {/* Class selector */}
      <select
        value={selectedClass}
        onChange={e => setSelectedClass(e.target.value)}
        className="mb-6 p-2 border rounded w-full"
      >
        <option value="">Select Class</option>
        {classes.map(c => (
          <option key={`class-${c.id}`} value={c.id}>
            {c.name} {c.section && `(${c.section})`}
          </option>
        ))}
      </select>

      {classInfo && (
        <p className="mb-4 font-semibold">
          Class: {classInfo.name} {classInfo.section && `(${classInfo.section})`}
        </p>
      )}

      {loading && <p>Loading attendance...</p>}

      {!loading && students.length === 0 && selectedClass && (
        <p>No attendance records found.</p>
      )}

      {/* Students */}
      {students.map(student => (
        <div
          key={`student-${student.student_id}`}
          className="mb-4 border rounded"
        >
          <div
            onClick={() =>
              setOpenStudentId(
                openStudentId === student.student_id
                  ? null
                  : student.student_id
              )
            }
            className="cursor-pointer p-3 bg-gray-100 font-semibold flex justify-between"
          >
            <span>
              {student.student_name} ({student.admission_number || "N/A"})
            </span>
            <span>
              {openStudentId === student.student_id ? "▲" : "▼"}
            </span>
          </div>

          {openStudentId === student.student_id && (
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border p-2">Date</th>
                  <th className="border p-2">Morning</th>
                  <th className="border p-2">Afternoon</th>
                </tr>
              </thead>
              <tbody>
                {student.attendance.map((a, idx) => (
                  <tr key={`att-${student.student_id}-${idx}`}>
                    <td className="border p-2">{a.date}</td>
                    <td className="border p-2">
                      {a.morning?.status || "-"}
                    </td>
                    <td className="border p-2">
                      {a.afternoon?.status || "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      ))}
    </div>
  );
}
