import { useState, useEffect } from "react";
import api from "../../api/axios";

export default function ViewResults() {
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedTerm, setSelectedTerm] = useState("");
  const [selectedSession, setSelectedSession] = useState("");
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const terms = ["First Term", "Second Term", "Third Term"];
  const sessions = ["2024/2025", "2025/2026", "2026/2027"];

  // Fetch classes teacher is assigned to
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const res = await api.get("/academics/teacher/assignments/");
        const uniqueClasses = [
          ...new Map(res.data.map(a => [a.school_class.id, a.school_class])).values()
        ];
        setClasses(uniqueClasses);
      } catch (err) {
        console.error(err);
        setError("Failed to load classes");
      }
    };
    fetchClasses();
  }, []);

  // Fetch students and results when class/term/session changes
  useEffect(() => {
    if (!selectedClass || !selectedTerm || !selectedSession) return;

    const fetchResults = async () => {
      setLoading(true);
      setSelectedStudent(null); // hide details when filters change
      try {
        const res = await api.get("/academics/teacher/results/", {
          params: {
            school_class: selectedClass,
            term: selectedTerm,
            session: selectedSession,
          },
        });

        const data = Array.isArray(res.data) ? res.data : res.data.results;
        setStudents(data);
      } catch (err) {
        console.error(err);
        setError("Failed to load students and results");
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [selectedClass, selectedTerm, selectedSession]);

  // Toggle student detail section
  const toggleStudentDetail = (student) => {
    if (selectedStudent?.student_id === student.student_id) {
      setSelectedStudent(null); // hide if same student clicked
    } else {
      setSelectedStudent(student); // show new student
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">View Results</h2>

      {error && <p className="text-red-600 mb-2">{error}</p>}

      {/* Class / Term / Session Select */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <select
          value={selectedClass}
          onChange={(e) => setSelectedClass(e.target.value)}
          className="border px-3 py-2 rounded"
        >
          <option value="">Select Class</option>
          {classes.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name} {c.section && `(${c.section})`}
            </option>
          ))}
        </select>

        <select
          value={selectedTerm}
          onChange={(e) => setSelectedTerm(e.target.value)}
          className="border px-3 py-2 rounded"
        >
          <option value="">Select Term</option>
          {terms.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>

        <select
          value={selectedSession}
          onChange={(e) => setSelectedSession(e.target.value)}
          className="border px-3 py-2 rounded"
        >
          <option value="">Select Session</option>
          {sessions.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      {/* Students Table */}
      {loading ? (
        <p>Loading students...</p>
      ) : students.length === 0 ? (
        <p>No students found for this class, term, and session.</p>
      ) : (
        <table className="w-full border-collapse border border-gray-300 mb-6">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-3 py-2">#</th>
              <th className="border px-3 py-2">Student</th>
              <th className="border px-3 py-2">Admission No</th>
              <th className="border px-3 py-2">Total Score</th>
              <th className="border px-3 py-2">Position</th>
              <th className="border px-3 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {students.map((s, idx) => (
              <tr
                key={s.student_id}
                className={`cursor-pointer ${selectedStudent?.student_id === s.student_id ? "bg-yellow-100" : ""}`}
              >
                <td className="border px-3 py-2">{idx + 1}</td>
                <td className="border px-3 py-2">{s.student_name}</td>
                <td className="border px-3 py-2">{s.admission_number}</td>
                <td className="border px-3 py-2">{s.total_score}</td>
                <td className="border px-3 py-2">{s.position}</td>
                <td className="border px-3 py-2">
                  <button
                    className="bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700"
                    onClick={() => toggleStudentDetail(s)}
                  >
                    {selectedStudent?.student_id === s.student_id ? "Hide Details" : "View Details"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Student Detail Section */}
      {selectedStudent && (
        <div className="border p-4 rounded bg-gray-50">
          <h3 className="font-bold mb-2">
            {selectedStudent.student_name} ({selectedStudent.admission_number}) | Position: {selectedStudent.position}
          </h3>

          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border px-3 py-2">#</th>
                <th className="border px-3 py-2">Subject</th>
                <th className="border px-3 py-2">CA Score</th>
                <th className="border px-3 py-2">Exam Score</th>
                <th className="border px-3 py-2">Total</th>
              </tr>
            </thead>
            <tbody>
              {selectedStudent.subjects.length > 0 ? (
                selectedStudent.subjects.map((sub, idx) => (
                  <tr key={idx}>
                    <td className="border px-3 py-2">{idx + 1}</td>
                    <td className="border px-3 py-2">{sub.subject_name}</td>
                    <td className="border px-3 py-2">{sub.ca_score}</td>
                    <td className="border px-3 py-2">{sub.exam_score}</td>
                    <td className="border px-3 py-2">{sub.total_score}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="border px-3 py-2 text-center">
                    No subjects found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
