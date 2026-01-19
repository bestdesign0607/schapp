import { useState, useEffect } from "react";
import api from "../../api/axios";

export default function AssignClassTeacher() {
  const [teachers, setTeachers] = useState([]);
  const [classes, setClasses] = useState([]);

  const [teacher, setTeacher] = useState("");
  const [schoolClass, setSchoolClass] = useState("");

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const authHeaders = {
    Authorization: `Bearer ${localStorage.getItem("access")}`,
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        const [tRes, cRes] = await Promise.all([
          api.get("/accounts/teachers/", { headers: authHeaders }),
          api.get("/academics/classes/", { headers: authHeaders }),
        ]);

        setTeachers(tRes.data);
        setClasses(cRes.data);
      } catch (err) {
        console.error(err.response?.data || err);
        setError("Failed to load teachers or classes");
      }
    };

    loadData();
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!teacher || !schoolClass) {
      setError("All fields are required");
      return;
    }

    setLoading(true);

    try {
      await api.post(
        "/academics/admin/assign-class-teacher/",
        {
          teacher,
          school_class: schoolClass,
        },
        { headers: authHeaders }
      );

      setSuccess("Class teacher assigned successfully");
      setTeacher("");
      setSchoolClass("");
    } catch (err) {
      console.error(err.response?.data || err);
      setError(
        err.response?.data?.detail ||
        "Failed to assign class teacher"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md max-w-md">
      <h2 className="text-2xl font-bold mb-4">
        Assign Class Teacher
      </h2>

      {error && <p className="text-red-600 mb-3">{error}</p>}
      {success && <p className="text-green-600 mb-3">{success}</p>}

      <form onSubmit={submit} className="space-y-4">
        {/* Teacher */}
        <div>
          <label className="block mb-1 font-medium">
            Teacher
          </label>
          <select
            value={teacher}
            onChange={(e) => setTeacher(e.target.value)}
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

        {/* Class */}
        <div>
          <label className="block mb-1 font-medium">
            Class
          </label>
          <select
            value={schoolClass}
            onChange={(e) => setSchoolClass(e.target.value)}
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

        <button
          disabled={loading}
          className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-60"
        >
          {loading ? "Assigning..." : "Assign Class Teacher"}
        </button>
      </form>
    </div>
  );
}
