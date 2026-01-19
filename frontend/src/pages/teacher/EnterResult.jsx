import { useState, useEffect } from "react";
import api from "../../api/axios";

export default function EnterResult() {
  const [assignments, setAssignments] = useState([]);
  const [students, setStudents] = useState([]);

  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedStudent, setSelectedStudent] = useState("");

  const [caScore, setCaScore] = useState("");
  const [examScore, setExamScore] = useState("");
  const [term, setTerm] = useState("");
  const [session, setSession] = useState("");

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  // =========================
  // FETCH TEACHER ASSIGNMENTS
  // =========================
  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const res = await api.get("/academics/teacher/assignments/");
        setAssignments(res.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load your teaching assignments");
      }
    };
    fetchAssignments();
  }, []);



useEffect(() => {
  if (!selectedClass) return;

  const fetchStudents = async () => {
    try {
      const res = await api.get("/academics/teacher/students/");

      const allStudents = res.data.students;

      const filtered = allStudents.filter((s) =>
        s.classes.includes(Number(selectedClass))
      );

      setStudents(filtered);
    } catch (err) {
      console.error(err);
      setError("Failed to load students");
    }
  };

  fetchStudents();
}, [selectedClass]);




  
  // =========================
  // SUBMIT RESULT
  // =========================
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (
      !selectedStudent ||
      !selectedSubject ||
      !selectedClass ||
      !caScore ||
      !examScore ||
      !term ||
      !session
    ) {
      setError("All fields are required");
      return;
    }

    setLoading(true);
    try {
      await api.post("/academics/teacher/results/create/", {
        student: selectedStudent,
        subject: selectedSubject,
        school_class: selectedClass,
        ca_score: caScore,
        exam_score: examScore,
        term,
        session,
      });
      setSuccess("Result submitted successfully");
      setSelectedStudent("");
      setSelectedSubject("");
      setCaScore("");
      setExamScore("");
      setTerm("");
      setSession("");
    } catch (err) {
      console.error(err.response?.data || err);
      setError(err.response?.data?.detail || "Failed to submit result");
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // UNIQUE CLASSES & SUBJECTS
  // =========================
  const classes = [
    ...new Map(assignments.map((a) => [a.school_class.id, a.school_class])).values(),
  ];

  const subjects = assignments.filter(
    (a) => String(a.school_class.id) === selectedClass
  );

  // TERM & SESSION OPTIONS
  const terms = ["First Term", "Second Term", "Third Term"];
  const sessions = ["2024/2025", "2025/2026", "2026/2027"];

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <p className="text-red-600">{error}</p>}
      {success && <p className="text-green-600">{success}</p>}

      {/* CLASS */}
      <div>
        <label className="block font-medium mb-1">Class</label>
        <select
          value={selectedClass}
          onChange={(e) => {
            setSelectedClass(e.target.value);
            setSelectedSubject("");
            setSelectedStudent("");
          }}
          className="w-full border px-3 py-2 rounded-lg"
          required
        >
          <option value="">Select Class</option>
          {classes.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name} {c.section && `(${c.section})`}
            </option>
          ))}
        </select>
      </div>

      {/* SUBJECT */}
      <div>
        <label className="block font-medium mb-1">Subject</label>
        <select
          value={selectedSubject}
          onChange={(e) => setSelectedSubject(e.target.value)}
          className="w-full border px-3 py-2 rounded-lg"
          required
          disabled={!selectedClass}
        >
          <option value="">Select Subject</option>
          {subjects.map((a) => (
            <option key={a.subject.id} value={a.subject.id}>
              {a.subject.name}
            </option>
          ))}
        </select>
      </div>

      {/* STUDENT */}
      <div>
        <label className="block font-medium mb-1">Student</label>
        <select
          value={selectedStudent}
          onChange={(e) => setSelectedStudent(e.target.value)}
          className="w-full border px-3 py-2 rounded-lg"
          required
          disabled={!selectedSubject}
        >
          <option value="">Select Student</option>
          {students.map((s) => (
            <option key={s.id} value={s.id}>
              {s.full_name} ({s.admission_number})
            </option>
          ))}
        </select>
      </div>

      {/* SCORES */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block font-medium mb-1">CA Score</label>
          <input
            type="number"
            value={caScore}
            onChange={(e) => setCaScore(e.target.value)}
            className="w-full border px-3 py-2 rounded-lg"
            required
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Exam Score</label>
          <input
            type="number"
            value={examScore}
            onChange={(e) => setExamScore(e.target.value)}
            className="w-full border px-3 py-2 rounded-lg"
            required
          />
        </div>
      </div>

      {/* TERM / SESSION */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block font-medium mb-1">Term</label>
          <select
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            className="w-full border px-3 py-2 rounded-lg"
            required
          >
            <option value="">Select Term</option>
            {terms.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block font-medium mb-1">Session</label>
          <select
            value={session}
            onChange={(e) => setSession(e.target.value)}
            className="w-full border px-3 py-2 rounded-lg"
            required
          >
            <option value="">Select Session</option>
            {sessions.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      <button
        disabled={loading}
        className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
      >
        {loading ? "Submitting..." : "Submit Result"}
      </button>
    </form>
  );
}
