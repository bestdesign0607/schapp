import { useState, useEffect } from "react";
import api from "../../api/axios";

export default function AdminViewResults() {
  const [classes, setClasses] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedTerm, setSelectedTerm] = useState("");
  const [selectedSession, setSelectedSession] = useState("");
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const terms = ["First Term", "Second Term", "Third Term"];
  const fallbackSessions = ["2024/2025", "2025/2026", "2026/2027"];

  // Fetch classes
  useEffect(() => {
    api.get("/academics/admin/classes/") // include 'academics/' prefix
      .then(res => {
        console.log("Classes response:", res.data);
        setClasses(Array.isArray(res.data) ? res.data : []);
      })
      .catch(err => {
        console.error("Error fetching classes:", err);
        setClasses([]);
        setError("Failed to load classes. Check admin permissions.");
      });
  }, []);

  // Fetch sessions
  useEffect(() => {
    api.get("/academics/admin/sessions/") // include 'academics/' prefix
      .then(res => setSessions(Array.isArray(res.data) ? res.data : fallbackSessions))
      .catch(err => {
        console.error("Error fetching sessions:", err);
        setSessions(fallbackSessions);
      });
  }, []);

  // Fetch results when filters change
  useEffect(() => {
    if (!selectedClass || !selectedTerm || !selectedSession) return;

    setLoading(true);
    setSelectedStudent(null);
    setError("");

    api.get("/academics/admin/results/", {
      params: {
        class: selectedClass,
        term: selectedTerm,
        session: selectedSession
      }
    })
      .then(res => {
        console.log("Results response:", res.data);
        setStudents(Array.isArray(res.data) ? res.data : []);
      })
      .catch(err => {
        console.error("Error fetching results:", err);
        setStudents([]);
        setError("Failed to load results");
      })
      .finally(() => setLoading(false));
  }, [selectedClass, selectedTerm, selectedSession]);

  const toggleStudentDetail = (student) => {
    setSelectedStudent(selectedStudent?.student_id === student.student_id ? null : student);
  };

  return (
    <div className="p-4 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Admin Results Dashboard</h2>

      {error && <p className="text-red-600 mb-2">{error}</p>}

      {/* Filters */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <select
          value={selectedClass}
          onChange={e => setSelectedClass(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="">Select Class</option>
          {Array.isArray(classes) && classes.map(c => (
            <option key={c.id} value={c.id}>
              {c.name} {c.section && `(${c.section})`}
            </option>
          ))}
        </select>

        <select
          value={selectedTerm}
          onChange={e => setSelectedTerm(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="">Select Term</option>
          {terms.map(t => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>

        <select
          value={selectedSession}
          onChange={e => setSelectedSession(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="">Select Session</option>
          {Array.isArray(sessions) && sessions.map(s => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      {/* Results Table */}
      {loading ? (
        <p>Loading results...</p>
      ) : students.length === 0 ? (
        <p>No results found for this class, term, and session.</p>
      ) : (
        <table className="w-full border-collapse border border-gray-300 mb-6">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-3 py-2">#</th>
              <th className="border px-3 py-2">Student</th>
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
                <td className="border px-3 py-2">{s.total}</td>
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

      {/* Student Details */}
      {selectedStudent && (
        <div className="border p-4 rounded bg-gray-50">
          <h3 className="font-bold mb-2">
            {selectedStudent.student_name} | Position: {selectedStudent.position}
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
              {Array.isArray(selectedStudent.subjects) && selectedStudent.subjects.length > 0 ? (
                selectedStudent.subjects.map((sub, idx) => (
                  <tr key={idx}>
                    <td className="border px-3 py-2">{idx + 1}</td>
                    <td className="border px-3 py-2">{sub.subject}</td>
                    <td className="border px-3 py-2">{sub.ca}</td>
                    <td className="border px-3 py-2">{sub.exam}</td>
                    <td className="border px-3 py-2">{sub.total}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="border px-3 py-2 text-center">No subjects found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
