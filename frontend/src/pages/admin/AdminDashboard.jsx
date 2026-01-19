import { useState, useEffect } from "react";
import CreateUser from "./CreateUser";
import CreateSubject from "./CreateSubject";
import CreateSchoolClass from "./CreateSchoolClass";
import AssignTeaching from "./AssignTeaching";
import AssignClassTeacher from "./AssignClassTeacher";
import AdminViewAttendance from "./AdminViewAttendance";
import AdminViewResults from "./AdminViewResults";

import axios from "../../api/axios";

export default function AdminDashboard() {
  const [activeSection, setActiveSection] = useState("createAccount");
  const [accountType, setAccountType] = useState("teacher");

  // Data states
  const [teachersAssignments, setTeachersAssignments] = useState([]);
  const [classTeachers, setClassTeachers] = useState([]);
  const [students, setStudents] = useState([]);
  const [parents, setParents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);

  // Parent → Children
  const [selectedParent, setSelectedParent] = useState("");
  const [selectedStudents, setSelectedStudents] = useState([]);

  // Students → Class
  const [selectedClass, setSelectedClass] = useState("");
  const [linkedStudents, setLinkedStudents] = useState([]);
  const [selectedSubjects, setSelectedSubjects] = useState([]);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const menuBtn = (key, label) => (
    <button
      onClick={() => setActiveSection(key)}
      className={`mb-3 py-2 px-4 rounded-lg text-left ${activeSection === key
        ? "bg-blue-600 text-white"
        : "bg-gray-200 text-gray-800 hover:bg-gray-300"
        }`}
    >
      {label}
    </button>
  );

  useEffect(() => {
    if (activeSection === "teachersAssignments") {
      axios.get("/academics/admin/teachers-assignments/").then(res => setTeachersAssignments(res.data));
    }
    if (activeSection === "classTeachers") {
      axios.get("/academics/admin/class-teachers/").then(res => setClassTeachers(res.data));
    }
    if (activeSection === "students" || activeSection === "linkParent") {
      axios.get("/accounts/students/").then(res => setStudents(res.data));
    }
    if (activeSection === "linkParent") {
      axios.get("/accounts/parents/").then(res => setParents(res.data));
    }
    if (["linkStudentsToClass", "linkSubjectsToClass"].includes(activeSection)) {
      axios.get("/academics/admin/classes/").then(res => setClasses(res.data));
      axios.get("/accounts/students/").then(res => setStudents(res.data));
    }
  }, [activeSection]);

  // -----------------------------
  // Parent → Children
  // -----------------------------
  const handleLinkParent = () => {
    axios.post("/academics/admin/link-parent/", {
      parent_id: selectedParent,
      student_ids: selectedStudents,
    })
      .then(res => alert(res.data.message))
      .catch(err => console.error(err));
  };

  // -----------------------------
  // Students → Class
  // -----------------------------
  useEffect(() => {
    if (!selectedClass) {
      setSubjects([]);
      setSelectedSubjects([]);
      return;
    }

    // Fetch linked subjects for the class
    axios.get(`/academics/admin/class/${selectedClass}/subjects/`)
      .then(res => {
        console.log("Subjects response:", res.data); // Debug
        const data = Array.isArray(res.data.subjects) ? res.data.subjects : [];
        setSubjects(data);

        // Optionally pre-select already linked subjects
        const preselected = data.map(s => s.id);
        setSelectedSubjects(preselected);
      })
      .catch(err => {
        console.error("Failed to fetch subjects", err);
        setSubjects([]);
        setSelectedSubjects([]);
      });
  }, [selectedClass]);


  useEffect(() => {
    if (!selectedClass) {
      setSubjects([]);
      setSelectedSubjects([]);
      return;
    }

    // 1️⃣ Fetch all subjects
    axios.get("/academics/admin/subjects/")
      .then(res => {
        setSubjects(res.data); // all subjects
      })
      .catch(err => console.error(err));

    // 2️⃣ Fetch subjects linked to this class
    axios.get(`/academics/admin/class/${selectedClass}/subjects/`)
      .then(res => {
        const linkedIds = res.data.subjects.map(s => s.id);
        setSelectedSubjects(linkedIds); // preselect
      })
      .catch(err => console.error(err));
  }, [selectedClass]);


  const handleAddStudentsToClass = () => {
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

  const handleReplaceStudentsInClass = () => {
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

  // -----------------------------
  // Subjects → Class
  // -----------------------------
  const handleLinkSubjectsToClass = () => {
    if (!selectedClass || selectedSubjects.length === 0) {
      setError("Please select a class and at least one subject.");
      setMessage("");
      return;
    }

    axios.post(`/academics/admin/class/${selectedClass}/subjects/`, {
      subject_ids: selectedSubjects
    })
      .then(res => {
        setMessage(res.data.message);
        setError("");
      })
      .catch(err => {
        console.error(err);
        setError("Failed to link subjects.");
        setMessage("");
      });
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg p-6 flex flex-col">
        <h2 className="text-xl font-bold mb-6">Admin Menu</h2>
        {menuBtn("createAccount", "Create Account")}
        {menuBtn("createSubject", "Create Subject")}
        {menuBtn("createClass", "Create Class")}
        {menuBtn("assignTeaching", "Assign Subject to Teacher")}
        {menuBtn("assignClassTeacher", "Assign Class Teacher")}
        {menuBtn("linkParent", "Link Parent → Children")}
        {menuBtn("linkStudentsToClass", "Link Students → Class")}
        {menuBtn("linkSubjectsToClass", "Link Subjects → Class")}
        {menuBtn("teachersAssignments", "Teachers & Subjects")}
        {menuBtn("classTeachers", "Class Teachers & Classes")}
        {menuBtn("students", "Students & Parents")}
        {menuBtn("viewAttendance", "View Attendance")}
        {menuBtn("viewResults", "View Results")}

      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 overflow-auto">
        {/* CREATE ACCOUNT */}
        {activeSection === "createAccount" && (
          <div className="bg-white p-6 rounded-lg shadow-md max-w-lg">
            <h2 className="text-2xl font-bold mb-4">Create Account</h2>
            <div className="mb-6">
              <label className="block mb-2 font-medium">Account Type</label>
              <select
                value={accountType}
                onChange={(e) => setAccountType(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg"
              >
                <option value="teacher">Teacher</option>
                <option value="student">Student</option>
                <option value="parent">Parent</option>
              </select>
            </div>
            <CreateUser accountType={accountType} />
          </div>
        )}

        {/* CREATE SUBJECT */}
        {activeSection === "createSubject" && <CreateSubject />}

        {activeSection === "viewAttendance" && <AdminViewAttendance />}
        {activeSection === "viewResults" && <AdminViewResults />}

        {/* CREATE CLASS */}
        {activeSection === "createClass" && <CreateSchoolClass />}

        {/* ASSIGN TEACHING */}
        {activeSection === "assignTeaching" && <AssignTeaching />}

        {/* ASSIGN CLASS TEACHER */}
        {activeSection === "assignClassTeacher" && <AssignClassTeacher />}

        {/* LINK PARENT → CHILDREN */}
        {/* LINK PARENT → CHILDREN */}
{activeSection === "linkParent" && (
  <div className="bg-white p-6 rounded-lg shadow-md max-w-2xl">
    <h2 className="text-2xl font-bold mb-4">Link Parent to Children</h2>

    {message && <p className="text-green-600 mb-2">{message}</p>}
    {error && <p className="text-red-600 mb-2">{error}</p>}

    <div className="mb-4">
      <label className="block mb-2 font-medium">Select Parent</label>
      <select
        value={selectedParent}
        onChange={(e) => setSelectedParent(e.target.value)}
        className="w-full px-4 py-2 border rounded-lg mb-4"
      >
        <option value="">-- Select Parent --</option>
        {parents.map((p) => (
          <option key={`parent-${p.id}`} value={p.id}>
            {p.full_name}
          </option>
        ))}
      </select>

      <label className="block mb-2 font-medium">Select Children</label>
      <select
        multiple
        value={selectedStudents}
        onChange={(e) =>
          setSelectedStudents([...e.target.selectedOptions].map((o) => o.value))
        }
        className="w-full px-4 py-2 border rounded-lg"
      >
        {students.map((s) => (
          <option key={`student-${s.id}`} value={s.id}>
            {s.full_name} ({s.admission_number || "N/A"})
          </option>
        ))}
      </select>
    </div>

    <button
      onClick={async () => {
        if (!selectedParent || selectedStudents.length === 0) {
          setError("Please select a parent and at least one student.");
          setMessage("");
          return;
        }

        setError("");
        setMessage("");

        try {
          await axios.post("/academics/admin/link-parent/", {
            parent_id: selectedParent,
            student_ids: selectedStudents,
          });

          setMessage("Parent linked successfully!");

          // Refresh students so parents show in table
          const res = await axios.get("/accounts/students/");
          setStudents(res.data);

          // Reset selection
          setSelectedParent("");
          setSelectedStudents([]);
        } catch (err) {
          console.error(err);
          setError(err.response?.data?.detail || "Failed to link parent.");
        }
      }}
      className="bg-blue-600 text-white px-6 py-2 rounded-lg"
    >
      Link Parent
    </button>
  </div>
)}


        {/* LINK STUDENTS → CLASS */}
        {activeSection === "linkStudentsToClass" && (
          <div className="bg-white p-6 rounded-lg shadow-md max-w-3xl">
            <h2 className="text-2xl font-bold mb-4">Link Students to Class</h2>

            {message && <p className="text-green-600 mb-4">{message}</p>}
            {error && <p className="text-red-600 mb-4">{error}</p>}

            <div className="mb-4">
              <label className="block mb-2 font-medium">Select Class</label>
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg"
              >
                <option value="">-- Select Class --</option>
                {classes.map(c => (
                  <option key={`class-${c.id}`} value={c.id}>
                    {c.name} {c.section ? `(${c.section})` : ""}
                  </option>
                ))}
              </select>
            </div>

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
                  <option key={`student-${s.id}`} value={s.id}>
                    {s.full_name} ({s.admission_number || "N/A"})
                  </option>
                ))}
              </select>
            </div>

            <div className="flex gap-4 mb-4">
              <button
                onClick={handleAddStudentsToClass}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
              >
                Add Students
              </button>
              <button
                onClick={handleReplaceStudentsInClass}
                className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
              >
                Replace Students
              </button>
            </div>

            {linkedStudents.length > 0 && (
              <div className="mt-6">
                <h3 className="text-xl font-semibold mb-2">Currently Linked Students:</h3>
                <ul className="list-disc ml-6">
                  {students.filter(s => linkedStudents.includes(s.id)).map(s => (
                    <li key={`linked-${s.id}`}>{s.full_name}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* LINK SUBJECTS → CLASS */}
        {activeSection === "linkSubjectsToClass" && (
          <div className="bg-white p-6 rounded-lg shadow-md max-w-3xl">
            <h2 className="text-2xl font-bold mb-4">Link Subjects to Class</h2>

            {message && <p className="text-green-600 mb-4">{message}</p>}
            {error && <p className="text-red-600 mb-4">{error}</p>}

            <div className="mb-4">
              <label className="block mb-2 font-medium">Select Class</label>
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg"
              >
                <option value="">-- Select Class --</option>
                {classes.map(c => (
                  <option key={`class-${c.id}`} value={c.id}>
                    {c.name} {c.section ? `(${c.section})` : ""}
                  </option>
                ))}
              </select>
            </div>

            {/* <div className="mb-4">
              <label className="block mb-2 font-medium">Select Subjects</label>
              <select
                multiple
                value={selectedSubjects}
                onChange={(e) =>
                  setSelectedSubjects([...e.target.selectedOptions].map(o => parseInt(o.value)))
                }
                className="w-full px-4 py-2 border rounded-lg"
              >
                {subjects.length > 0 ? (
                  subjects.map((s) => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))
                ) : (
                  <option disabled>No subjects available</option>
                )}
              </select>
            </div> */}
            <select
              multiple
              value={selectedSubjects}
              onChange={(e) =>
                setSelectedSubjects([...e.target.selectedOptions].map(o => parseInt(o.value)))
              }
            >
              {subjects.length > 0 ? (
                subjects.map(s => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))
              ) : (
                <option disabled>No subjects available</option>
              )}
            </select>


            <button
              onClick={handleLinkSubjectsToClass}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              Link Subjects
            </button>
          </div>
        )}

        {/* TEACHERS & SUBJECTS */}
        {activeSection === "teachersAssignments" && (
          <div className="bg-white p-6 rounded-lg shadow-md max-w-4xl overflow-auto">
            <h2 className="text-2xl font-bold mb-4">Teachers & Assigned Subjects</h2>
            <table className="w-full table-auto border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border px-4 py-2">ID</th>
                  <th className="border px-4 py-2">Name</th>
                  <th className="border px-4 py-2">Staff ID</th>
                  <th className="border px-4 py-2">Subject</th>
                  <th className="border px-4 py-2">Class</th>
                </tr>
              </thead>
              <tbody>
                {teachersAssignments.map((t) => (
                  <tr key={`teacher-${t.teacher_id}-${t.subject}`}>
                    <td className="border px-4 py-2">{t.teacher_id}</td>
                    <td className="border px-4 py-2">{t.teacher_name}</td>
                    <td className="border px-4 py-2">{t.staff_id}</td>
                    <td className="border px-4 py-2">{t.subject}</td>
                    <td className="border px-4 py-2">{t.school_class}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* CLASS TEACHERS & CLASSES */}
        {activeSection === "classTeachers" && (
          <div className="bg-white p-6 rounded-lg shadow-md max-w-4xl overflow-auto">
            <h2 className="text-2xl font-bold mb-4">Class Teachers & Classes</h2>
            <table className="w-full table-auto border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border px-4 py-2">Class ID</th>
                  <th className="border px-4 py-2">Class Name</th>
                  <th className="border px-4 py-2">Section</th>
                  <th className="border px-4 py-2">Teacher ID</th>
                  <th className="border px-4 py-2">Teacher Name</th>
                  <th className="border px-4 py-2">Staff ID</th>
                </tr>
              </thead>
              <tbody>
                {classTeachers.map((c) => (
                  <tr key={`classteacher-${c.id}`}>
                    <td className="border px-4 py-2">{c.id}</td>
                    <td className="border px-4 py-2">{c.name}</td>
                    <td className="border px-4 py-2">{c.section}</td>
                    <td className="border px-4 py-2">{c.class_teacher_id}</td>
                    <td className="border px-4 py-2">{c.class_teacher_name}</td>
                    <td className="border px-4 py-2">{c.staff_id}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* STUDENTS & PARENTS */}
        {activeSection === "students" && (
          <div className="bg-white p-6 rounded-lg shadow-md max-w-4xl overflow-auto">
            <h2 className="text-2xl font-bold mb-4">Students & Parents</h2>
            <table className="w-full table-auto border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border px-4 py-2">ID</th>
                  <th className="border px-4 py-2">Name</th>
                  <th className="border px-4 py-2">Admission No</th>
                  <th className="border px-4 py-2">Parents</th>
                </tr>
              </thead>
              <tbody>
                {students.map((s) => (
                  <tr key={`student-table-${s.id}`}>
                    <td className="border px-4 py-2">{s.id}</td>
                    <td className="border px-4 py-2">{s.full_name}</td>
                    <td className="border px-4 py-2">{s.admission_number}</td>
                    <td className="border px-4 py-2">
                      {s.parents?.map(p => p.full_name).join(", ")}
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      </div>
    </div>
  );
}
