// import { useEffect, useState } from "react";
// import api from "../../api/axios";

// export default function StudentDashboard() {
//   const [sessions, setSessions] = useState([]);
//   const [selectedSession, setSelectedSession] = useState("");
//   const [selectedTerm, setSelectedTerm] = useState("");
//   const [result, setResult] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   const terms = ["First Term", "Second Term", "Third Term"];

//   // Fetch sessions for the student
//   useEffect(() => {
//     const fetchSessions = async () => {
//       try {
//         const res = await api.get("/academics/student/sessions/");
//         setSessions(res.data);
//       } catch (err) {
//         console.error("Error fetching sessions:", err);
//         setError("Failed to load sessions");
//       }
//     };
//     fetchSessions();
//   }, []);

//   // Fetch results when term & session are selected
//   useEffect(() => {
//     if (!selectedTerm || !selectedSession) return;

//     const fetchResults = async () => {
//       setLoading(true);
//       setError("");
//       try {
//         const res = await api.get("/academics/student/results/", {
//           params: { term: selectedTerm, session: selectedSession },
//         });
//         setResult(res.data);
//       } catch (err) {
//         console.error("Error fetching results:", err);
//         setResult(null);
//         setError(err.response?.data?.detail || "No results found");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchResults();
//   }, [selectedTerm, selectedSession]);

//   const downloadPDF = () => {
//     if (!selectedTerm || !selectedSession) return;
//     const url = `/academics/student/results/download/?term=${encodeURIComponent(
//       selectedTerm
//     )}&session=${encodeURIComponent(selectedSession)}`;
//     window.open(url, "_blank");
//   };

//   return (
//     <div className="p-6 bg-white rounded shadow-md">
//       <h2 className="text-2xl font-bold mb-4">Student Dashboard</h2>

//       {/* Term & Session selectors */}
//       <div className="grid grid-cols-2 gap-4 mb-6">
//         <select
//           value={selectedTerm}
//           onChange={(e) => setSelectedTerm(e.target.value)}
//           className="border px-3 py-2 rounded w-full"
//         >
//           <option value="">Select Term</option>
//           {terms.map((t) => (
//             <option key={t} value={t}>{t}</option>
//           ))}
//         </select>

//         <select
//           value={selectedSession}
//           onChange={(e) => setSelectedSession(e.target.value)}
//           className="border px-3 py-2 rounded w-full"
//         >
//           <option value="">Select Session</option>
//           {sessions.map((s) => (
//             <option key={s} value={s}>{s}</option>
//           ))}
//         </select>
//       </div>

//       <button
//         onClick={downloadPDF}
//         className="mb-6 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
//         disabled={!result}
//       >
//         Download Result PDF
//       </button>

//       {loading && <p>Loading results...</p>}
//       {error && <p className="text-red-600">{error}</p>}

//       {result && (
//         <div className="overflow-x-auto">
//           <table className="w-full border-collapse border border-gray-300">
//             <thead>
//               <tr className="bg-gray-100">
//                 <th className="border px-3 py-2">Subject</th>
//                 <th className="border px-3 py-2">CA</th>
//                 <th className="border px-3 py-2">Exam</th>
//                 <th className="border px-3 py-2">Total</th>
//               </tr>
//             </thead>
//             <tbody>
//               {result.subjects.map((sub, idx) => (
//                 <tr key={idx}>
//                   <td className="border px-3 py-2">{sub.subject}</td>
//                   <td className="border px-3 py-2">{sub.ca}</td>
//                   <td className="border px-3 py-2">{sub.exam}</td>
//                   <td className="border px-3 py-2">{sub.total}</td>
//                 </tr>
//               ))}
//               <tr className="font-bold bg-gray-50">
//                 <td className="border px-3 py-2 text-right" colSpan={3}>
//                   Total Score:
//                 </td>
//                 <td className="border px-3 py-2">{result.total}</td>
//               </tr>
//             </tbody>
//           </table>
//         </div>
//       )}
//     </div>
//   );
// }










import { useEffect, useState } from "react";
import api from "../../api/axios";

// Helper to convert number to ordinal
const ordinal = (n) => {
  if (!n) return "-";
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
};

export default function StudentDashboard() {
  const [sessions, setSessions] = useState([]);
  const [selectedSession, setSelectedSession] = useState("");
  const [selectedTerm, setSelectedTerm] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const terms = ["First Term", "Second Term", "Third Term"];

  // Fetch sessions for the student
  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const res = await api.get("/academics/student/sessions/");
        setSessions(res.data);
      } catch (err) {
        console.error("Error fetching sessions:", err);
        setError("Failed to load sessions");
      }
    };
    fetchSessions();
  }, []);

  // Fetch results when term & session are selected
  useEffect(() => {
    if (!selectedTerm || !selectedSession) return;

    const fetchResults = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await api.get("/academics/student/results/", {
          params: { term: selectedTerm, session: selectedSession },
        });
        setResult(res.data);
      } catch (err) {
        console.error("Error fetching results:", err);
        setResult(null);
        setError(err.response?.data?.detail || "No results found");
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [selectedTerm, selectedSession]);

  const downloadPDF = async () => {
  if (!selectedTerm || !selectedSession) return;

  try {
    const res = await api.get("/academics/student/results/download/", {
      params: { term: selectedTerm, session: selectedSession },
      responseType: "blob", // IMPORTANT
    });

    const url = window.URL.createObjectURL(new Blob([res.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "result.pdf");
    document.body.appendChild(link);
    link.click();
    link.remove();
  } catch (err) {
    console.error("Failed to download PDF:", err);
  }
};


  return (
    <div className="p-6 bg-white rounded shadow-md">
      <h2 className="text-2xl font-bold mb-2">
        Welcome to your student portal
      </h2>

      {/* Student info section */}
      {result && (
        <div className="mb-6 grid grid-cols-2 gap-4 bg-gray-100 p-4 rounded">
          <div>
            <p className="font-semibold">{result.student_name}</p>
            <p>Class: {result.class}</p>
            <p>Position: {ordinal(result.position)}</p>
          </div>
          <div className="text-right">
            <p>Admission No: {result.admission_number}</p>
            <p>Term: {result.term}</p>
            <p>Session: {result.session}</p>
          </div>
        </div>
      )}

      {/* Term & Session selectors */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <select
          value={selectedTerm}
          onChange={(e) => setSelectedTerm(e.target.value)}
          className="border px-3 py-2 rounded w-full"
        >
          <option value="">Select Term</option>
          {terms.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>

        <select
          value={selectedSession}
          onChange={(e) => setSelectedSession(e.target.value)}
          className="border px-3 py-2 rounded w-full"
        >
          <option value="">Select Session</option>
          {sessions.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      <button
        onClick={downloadPDF}
        className="mb-6 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        disabled={!result}
      >
        Download Result PDF
      </button>

      {loading && <p>Loading results...</p>}
      {error && <p className="text-red-600">{error}</p>}

      {result && (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border px-3 py-2">Subject</th>
                <th className="border px-3 py-2">CA</th>
                <th className="border px-3 py-2">Exam</th>
                <th className="border px-3 py-2">Total</th>
              </tr>
            </thead>
            <tbody>
              {result.subjects.map((sub, idx) => (
                <tr key={idx}>
                  <td className="border px-3 py-2">{sub.subject}</td>
                  <td className="border px-3 py-2">{sub.ca}</td>
                  <td className="border px-3 py-2">{sub.exam}</td>
                  <td className="border px-3 py-2">{sub.total}</td>
                </tr>
              ))}
              <tr className="font-bold bg-gray-50">
                <td className="border px-3 py-2 text-right" colSpan={3}>
                  Total Score:
                </td>
                <td className="border px-3 py-2">{result.total}</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
