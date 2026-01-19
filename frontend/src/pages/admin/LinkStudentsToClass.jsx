import { useState, useEffect } from "react";
import axios from "../../api/axios";

export default function LinkStudentsToClass() {
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [linkedStudents, setLinkedStudents] = useState([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Fetch all classes and students on mount
  useEffect(() => {
    axios.get("/academics/admin/classes/")
      .then(res => setClasses(res.data))
      .catch(err => console.error(err));

    axios.get("/accounts/students/")
      .then(res => setStudents(res.data))
      .catch(err => console.error(err));
  }, []);

  // Fetch students linked to selected class
  useEffect(() => {
    if (!selectedClass) {
      setLinkedStudents([]);
      return;
    }

    axios.get(`/academics/admin/link-students-to-class/${selectedClass}/`)
      .then(res => {
        setLinkedStudents(res.data.students.map(s => s.id));
        setSelectedStudents(res.data.students.map(s => s.id));
      })
      .catch(err => console.error(err));
  }, [selectedClass]);

  const handleAddStudents = () => {
    if (!selectedClass || selectedStudents.length === 0) {
      setError("Please select a class and at least one student.");
      setMessage("");
      return;
    }

    axios.post(`/academics/admin/link-students-to-class/${selectedClass}/`, {
      student_ids: selectedStudents
    })
      .then(res => {
        setMessage(res.data.message);
        setError("");
        setLinkedStudents(res.data.students.map(s => s.id));
      })
      .catch(err => {
        console.error(err);
        setError("Failed to add students.");
        setMessage("");
      });
  };

  const handleReplaceStudents = () => {
    if (!selectedClass) return;

    axios.put(`/academics/admin/link-students-to-class/${selectedClass}/`, {
      student_ids: selectedStudents
    })
      .then(res => {
        setMessage(res.data.message);
        setError("");
        setLinkedStudents(res.data.students.map(s => s.id));
      })
      .catch(err => {
        console.error(err);
        setError("Failed to update students.");
        setMessage("");
      });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md max-w-3xl">
      <h2 className="text-2xl font-bold mb-4">Link Students to Class</h2>

      {message && <p className="text-green-600 mb-4">{message}</p>}
      {error && <p className="text-red-600 mb-4">{error}</p>}

      {/* Select Class */}
      <div className="mb-4">
        <label className="block mb-2 font-medium">Select Class</label>
        <select
          value={selectedClass}
          onChange={(e) => setSelectedClass(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg"
        >
          <option value="">-- Select Class --</option>
          {classes.map(c => (
            <option key={c.id} value={c.id}>
              {c.name} {c.section ? `(${c.section})` : ""}
            </option>
          ))}
        </select>
      </div>

      {/* Select Students */}
      <div className="mb-4">
        <label className="block mb-2 font-medium">Select Students</label>
        <select
          multiple
          value={selectedStudents}
          onChange={(e) =>
            setSelectedStudents([...e.target.selectedOptions].map(o => o.value))
          }
          className="w-full px-4 py-2 border rounded-lg"
        >
          {students.map(s => (
            <option key={s.id} value={s.id}>
              {s.full_name} ({s.admission_number || "N/A"})
            </option>
          ))}
        </select>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <button
          onClick={handleAddStudents}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
        >
          Add Students
        </button>
        <button
          onClick={handleReplaceStudents}
          className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
        >
          Replace Students
        </button>
      </div>

      {/* Currently linked students */}
      {linkedStudents.length > 0 && (
        <div className="mt-6">
          <h3 className="text-xl font-semibold mb-2">Currently Linked Students:</h3>
          <ul className="list-disc ml-6">
            {students
              .filter(s => linkedStudents.includes(s.id))
              .map(s => (
                <li key={s.id}>{s.full_name}</li>
              ))}
          </ul>
        </div>
      )}
    </div>
  );
}
