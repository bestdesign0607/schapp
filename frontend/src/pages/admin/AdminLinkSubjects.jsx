// import { useState, useEffect } from "react";
// import api from "../api/axios";

// export default function AdminLinkSubjects() {
//   const [classes, setClasses] = useState([]);
//   const [subjects, setSubjects] = useState([]);

//   const [selectedClass, setSelectedClass] = useState("");
//   const [selectedSubjects, setSelectedSubjects] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [success, setSuccess] = useState("");
//   const [error, setError] = useState("");

//   // Fetch all classes and subjects
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const [classesRes, subjectsRes] = await Promise.all([
//           api.get("/academics/classes/"),   // Adjust URL if different
//           api.get("/academics/subjects/")
//         ]);
//         setClasses(classesRes.data);
//         setSubjects(subjectsRes.data);
//       } catch (err) {
//         console.error(err);
//         setError("Failed to load classes or subjects");
//       }
//     };
//     fetchData();
//   }, []);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");
//     setSuccess("");

//     if (!selectedClass || selectedSubjects.length === 0) {
//       setError("Please select a class and at least one subject");
//       return;
//     }

//     setLoading(true);
//     try {
//       await api.post(`/academics/admin/classes/${selectedClass}/link-subjects/`, {
//         subject_ids: selectedSubjects
//       });
//       setSuccess("Subjects linked successfully!");
//       setSelectedSubjects([]);
//       setSelectedClass("");
//     } catch (err) {
//       console.error(err.response || err);
//       setError(err.response?.data?.detail || "Failed to link subjects");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-md">
//       <h2 className="text-2xl font-bold mb-4">Link Subjects to Class</h2>

//       {error && <p className="text-red-600 mb-2">{error}</p>}
//       {success && <p className="text-green-600 mb-2">{success}</p>}

//       <form onSubmit={handleSubmit} className="space-y-4">
//         {/* Class selection */}
//         <div>
//           <label className="block mb-1 font-medium">Class</label>
//           <select
//             value={selectedClass}
//             onChange={(e) => setSelectedClass(e.target.value)}
//             className="w-full border px-3 py-2 rounded-lg"
//             required
//           >
//             <option value="">Select Class</option>
//             {classes.map((c) => (
//               <option key={c.id} value={c.id}>
//                 {c.name} {c.section && `(${c.section})`}
//               </option>
//             ))}
//           </select>
//         </div>

//         {/* Subjects selection */}
//         <div>
//           <label className="block mb-1 font-medium">Subjects</label>
//           <select
//             multiple
//             value={selectedSubjects}
//             onChange={(e) =>
//               setSelectedSubjects(
//                 Array.from(e.target.selectedOptions, (opt) => Number(opt.value))
//               )
//             }
//             className="w-full border px-3 py-2 rounded-lg h-40"
//             required
//           >
//             {subjects.map((s) => (
//               <option key={s.id} value={s.id}>
//                 {s.name}
//               </option>
//             ))}
//           </select>
//           <p className="text-sm text-gray-500 mt-1">
//             Hold Ctrl (Windows) / Cmd (Mac) to select multiple subjects
//           </p>
//         </div>

//         <button
//           type="submit"
//           disabled={loading}
//           className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
//         >
//           {loading ? "Linking..." : "Link Subjects"}
//         </button>
//       </form>
//     </div>
//   );
// }














import { useState, useEffect } from "react";
import api from "../api/axios";

export default function AdminLinkSubjects() {
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [linkedSubjects, setLinkedSubjects] = useState([]); // Subjects already linked to selected class

  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  // Fetch all classes and all subjects initially
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [classesRes, subjectsRes] = await Promise.all([
          api.get("/academics/admin/classes/"), // All classes
          api.get("/academics/admin/subjects/") // All subjects
        ]);
        setClasses(classesRes.data);
        setSubjects(subjectsRes.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load classes or subjects");
      }
    };
    fetchData();
  }, []);

  // Fetch linked subjects whenever a class is selected
  useEffect(() => {
    if (!selectedClass) {
      setLinkedSubjects([]);
      setSelectedSubjects([]);
      return;
    }

    const fetchLinkedSubjects = async () => {
      try {
        const res = await api.get(`/academics/admin/class/${selectedClass}/subjects/`);
        const linked = res.data.subjects.map(s => s.id);
        setLinkedSubjects(linked);
        setSelectedSubjects(linked); // Preselect already linked subjects
      } catch (err) {
        console.error(err);
        setLinkedSubjects([]);
        setSelectedSubjects([]);
      }
    };

    fetchLinkedSubjects();
  }, [selectedClass]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!selectedClass || selectedSubjects.length === 0) {
      setError("Please select a class and at least one subject");
      return;
    }

    setLoading(true);
    try {
      await api.put(`/academics/admin/class/${selectedClass}/subjects/`, {
        subject_ids: selectedSubjects
      });
      setSuccess("Subjects linked successfully!");
      setLinkedSubjects(selectedSubjects); // Update linked subjects
    } catch (err) {
      console.error(err.response || err);
      setError(err.response?.data?.detail || "Failed to link subjects");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Link Subjects to Class</h2>

      {error && <p className="text-red-600 mb-2">{error}</p>}
      {success && <p className="text-green-600 mb-2">{success}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Class selection */}
        <div>
          <label className="block mb-1 font-medium">Class</label>
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
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

        {/* Subjects selection */}
        <div>
          <label className="block mb-1 font-medium">Subjects</label>
          <select
            multiple
            value={selectedSubjects}
            onChange={(e) =>
              setSelectedSubjects(
                Array.from(e.target.selectedOptions, (opt) => Number(opt.value))
              )
            }
            className="w-full border px-3 py-2 rounded-lg h-40"
            required
          >
            {subjects.length > 0 ? (
              subjects.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))
            ) : (
              <option disabled>No subjects available</option>
            )}
          </select>
          <p className="text-sm text-gray-500 mt-1">
            Hold Ctrl (Windows) / Cmd (Mac) to select multiple subjects
          </p>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
        >
          {loading ? "Linking..." : "Link Subjects"}
        </button>
      </form>

      {linkedSubjects.length > 0 && (
        <div className="mt-4">
          <h3 className="font-semibold mb-2">Currently Linked Subjects:</h3>
          <ul className="list-disc ml-6">
            {subjects
              .filter(s => linkedSubjects.includes(s.id))
              .map(s => (
                <li key={`linked-${s.id}`}>{s.name}</li>
              ))}
          </ul>
        </div>
      )}
    </div>
  );
}
