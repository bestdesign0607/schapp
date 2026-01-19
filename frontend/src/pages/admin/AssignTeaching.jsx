import { useState, useEffect } from "react";
import api from "../../api/axios";

export default function AssignTeaching() {
  const [teachers, setTeachers] = useState([]);
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);

  const [selectedTeacher, setSelectedTeacher] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  // Helper: get auth headers
  const getAuthHeaders = () => ({
    Authorization: `Bearer ${localStorage.getItem("access")}`,
  });

  // Fetch teachers, classes, subjects on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [tRes, cRes, sRes] = await Promise.all([
          api.get("/accounts/teachers/", { headers: getAuthHeaders() }),
          api.get("/academics/classes/", { headers: getAuthHeaders() }),
          api.get("/academics/subjects/", { headers: getAuthHeaders() }),
        ]);

        setTeachers(tRes.data);
        setClasses(cRes.data);
        setSubjects(sRes.data);
      } catch (err) {
        console.error(err.response?.data || err);
        setError("Failed to load data. Make sure you are logged in as admin.");
      }
    };

    fetchData();
  }, []);

  const handleAssign = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!selectedTeacher || !selectedClass || !selectedSubject) {
      setError("All fields are required");
      return;
    }

    setLoading(true);

    try {
      await api.post(
        "/academics/admin/assignments/create/",
        {
          teacher: selectedTeacher,     // must match serializer field
          school_class: selectedClass,  // must match serializer field
          subject: selectedSubject,     // must match serializer field
        },
        { headers: getAuthHeaders() }
      );

      setSuccess("Teacher assigned successfully!");
      setSelectedTeacher("");
      setSelectedClass("");
      setSelectedSubject("");
    } catch (err) {
      console.error(err.response?.data || err);
      setError(err.response?.data?.detail || "Failed to assign teaching");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md max-w-md">
      <h2 className="text-2xl font-bold mb-4">Assign Teacher to Class & Subject</h2>

      {error && <p className="text-red-600 mb-2">{error}</p>}
      {success && <p className="text-green-600 mb-2">{success}</p>}

      <form onSubmit={handleAssign} className="space-y-4">
        {/* Teacher Dropdown */}
        <div>
          <label className="block mb-1 font-medium">Teacher</label>
          <select
            value={selectedTeacher}
            onChange={(e) => setSelectedTeacher(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg"
            required
          >
            <option value="">Select Teacher</option>
            {teachers.map((t) => (
              <option key={t.id} value={t.id}>
                {t.full_name} ({t.staff_id})
              </option>
            ))}
          </select>
        </div>

        {/* Class Dropdown */}
        <div>
          <label className="block mb-1 font-medium">Class</label>
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg"
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

        {/* Subject Dropdown */}
        <div>
          <label className="block mb-1 font-medium">Subject</label>
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg"
            required
          >
            <option value="">Select Subject</option>
            {subjects.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} ({s.code})
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition disabled:opacity-60"
        >
          {loading ? "Assigning..." : "Assign Teacher"}
        </button>
      </form>
    </div>
  );
}
