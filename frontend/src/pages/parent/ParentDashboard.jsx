// import { useEffect, useState } from "react";
// import api from "../../api/axios";

// export default function ParentDashboard() {
//   const [children, setChildren] = useState([]);
//   const [selectedChild, setSelectedChild] = useState(null);
//   const [term, setTerm] = useState("");
//   const [session, setSession] = useState("");
//   const [result, setResult] = useState(null);
//   const [attendance, setAttendance] = useState({});
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   const terms = ["First Term", "Second Term", "Third Term"];

//   // Fetch children of parent
//   useEffect(() => {
//     const fetchChildren = async () => {
//       try {
//         const res = await api.get("/academics/parent/children/");
//         setChildren(res.data);
//       } catch (err) {
//         console.error("Error fetching children:", err);
//         setError("Failed to load children");
//       }
//     };
//     fetchChildren();
//   }, []);

//   // Fetch result & attendance when child + term + session are selected
//   useEffect(() => {
//     if (!selectedChild || !term || !session) return;

//     const fetchResult = async () => {
//       setLoading(true);
//       setError("");
//       try {
//         const res = await api.get(
//           `/academics/parent/child/${selectedChild.id}/result/`,
//           { params: { term, session } }
//         );
//         setResult(res.data);

//         const attRes = await api.get(
//           `/academics/parent/child/${selectedChild.id}/attendance/`
//         );
//         setAttendance(attRes.data);
//       } catch (err) {
//         console.error("Error fetching child data:", err);
//         setResult(null);
//         setAttendance({});
//         setError(err.response?.data?.detail || "No data found");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchResult();
//   }, [selectedChild, term, session]);

//   const downloadPDF = () => {
//     if (!selectedChild || !term || !session) return;
//     const url = `/academics/parent/child/${selectedChild.id}/result/download/?term=${encodeURIComponent(
//       term
//     )}&session=${encodeURIComponent(session)}`;
//     window.open(url, "_blank");
//   };

//   return (
//     <div className="p-6 bg-white rounded shadow-md">
//       <h2 className="text-2xl font-bold mb-4">
//         Welcome to your portal, {children.length > 0 ? children[0].parent_name : "Parent"}
//       </h2>

//       {/* Child selector */}
//       <div className="mb-4">
//         <label>Select Child:</label>
//         <select
//           className="border px-3 py-2 rounded w-full"
//           value={selectedChild?.id || ""}
//           onChange={(e) => {
//             const child = children.find(c => c.id === parseInt(e.target.value));
//             setSelectedChild(child);
//             setResult(null);
//             setAttendance({});
//           }}
//         >
//           <option value="">Select Child</option>
//           {children.map((c) => (
//             <option key={c.id} value={c.id}>
//               {c.full_name} ({c.admission_number})
//             </option>
//           ))}
//         </select>
//       </div>

//       {/* Term & Session selectors */}
//       <div className="grid grid-cols-2 gap-4 mb-4">
//         <select value={term} onChange={(e) => setTerm(e.target.value)} className="border px-3 py-2 rounded w-full">
//           <option value="">Select Term</option>
//           {terms.map(t => <option key={t} value={t}>{t}</option>)}
//         </select>
//         <input
//           type="text"
//           placeholder="Session (e.g. 2024/2025)"
//           value={session}
//           onChange={(e) => setSession(e.target.value)}
//           className="border px-3 py-2 rounded w-full"
//         />
//       </div>

//       <button
//         onClick={downloadPDF}
//         className="mb-6 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
//         disabled={!result}
//       >
//         Download Result PDF
//       </button>

//       {loading && <p>Loading...</p>}
//       {error && <p className="text-red-600">{error}</p>}

//       {result && (
//         <div className="overflow-x-auto">
//           <div className="mb-2">
//             <p className="font-semibold">Student: {result.student_name}</p>
//             <p>Admission No: {result.admission_number}</p>
//             <p>Class: {result.school_class}</p>
//             <p>Position: {result.position}</p>
//           </div>
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

//           {/* Attendance */}
//           <div className="mt-6">
//             <h3 className="font-semibold mb-2">Attendance Overview</h3>
//             <table className="w-full border-collapse border border-gray-300">
//               <thead>
//                 <tr className="bg-gray-100">
//                   <th className="border px-2 py-1">Date</th>
//                   <th className="border px-2 py-1">Morning</th>
//                   <th className="border px-2 py-1">Afternoon</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {Object.entries(attendance).map(([date, periods]) => (
//                   <tr key={date}>
//                     <td className="border px-2 py-1">{date}</td>
//                     <td className="border px-2 py-1">{periods.morning}</td>
//                     <td className="border px-2 py-1">{periods.afternoon}</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }









import { useEffect, useState } from "react";
import api from "../../api/axios";

/* 🔹 Helper: generate academic sessions */
const generateSessions = (yearsBack = 6) => {
  const currentYear = new Date().getFullYear();
  const sessions = [];

  for (let i = 0; i < yearsBack; i++) {
    const start = currentYear - i - 1;
    const end = currentYear - i;
    sessions.push(`${start}/${end}`);
  }
  return sessions;
};

export default function ParentDashboard() {
  const [children, setChildren] = useState([]);
  const [selectedChild, setSelectedChild] = useState(null);
  const [term, setTerm] = useState("");
  const [session, setSession] = useState("");
  const [result, setResult] = useState(null);
  const [attendance, setAttendance] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const terms = ["First Term", "Second Term", "Third Term"];
  const sessions = generateSessions(6);

  /* 🔹 Fetch children of parent */
  useEffect(() => {
    const fetchChildren = async () => {
      try {
        const res = await api.get("/academics/parent/children/");
        setChildren(res.data);
      } catch (err) {
        console.error("Error fetching children:", err);
        setError("Failed to load children");
      }
    };
    fetchChildren();
  }, []);

  /* 🔹 Fetch result & attendance */
  useEffect(() => {
    if (!selectedChild || !term || !session) return;

    const fetchData = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await api.get(
          `/academics/parent/child/${selectedChild.id}/results/`,
          { params: { term, session } }
        );
        setResult(res.data);

        const attRes = await api.get(
          `/academics/parent/child/${selectedChild.id}/attendance/`
        );
        setAttendance(attRes.data);
      } catch (err) {
        console.error("Error fetching child data:", err);
        setResult(null);
        setAttendance({});
        setError(err.response?.data?.detail || "No data found");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedChild, term, session]);

  /* 🔹 Download PDF */
  const downloadPDF = async () => {
  if (!selectedChild || !term || !session) return;

  try {
    const res = await api.get(
      `/academics/parent/child/${selectedChild.id}/results/download/`,
      {
        params: { term, session },
        responseType: "blob", // 👈 IMPORTANT
      }
    );

    const file = new Blob([res.data], { type: "application/pdf" });
    const fileURL = window.URL.createObjectURL(file);

    const link = document.createElement("a");
    link.href = fileURL;
    link.download = `${selectedChild.full_name}_${term}_${session}.pdf`;
    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
    window.URL.revokeObjectURL(fileURL);
  } catch (err) {
    console.error("PDF download failed:", err);
    setError("Failed to download PDF");
  }
};


  return (
    <div className="p-6 bg-white rounded shadow-md">
      <h2 className="text-2xl font-bold mb-4">
        Welcome to your portal,{" "}
        {children.length > 0 ? children[0].parent_name : "Parent"}
      </h2>

      {/* 🔹 Child selector */}
      <div className="mb-4">
        <label className="block mb-1 font-medium">Select Child</label>
        <select
          className="border px-3 py-2 rounded w-full"
          value={selectedChild?.id || ""}
          onChange={(e) => {
            const child = children.find(
              (c) => c.id === parseInt(e.target.value)
            );
            setSelectedChild(child);
            setResult(null);
            setAttendance({});
          }}
        >
          <option value="">Select Child</option>
          {children.map((c) => (
            <option key={c.id} value={c.id}>
              {c.full_name} ({c.admission_number})
            </option>
          ))}
        </select>
      </div>

      {/* 🔹 Term & Session selectors */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <select
          value={term}
          onChange={(e) => setTerm(e.target.value)}
          className="border px-3 py-2 rounded w-full"
        >
          <option value="">Select Term</option>
          {terms.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>

        {/* ✅ SESSION DROPDOWN */}
        <select
          value={session}
          onChange={(e) => setSession(e.target.value)}
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

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-600">{error}</p>}

      {/* 🔹 Result Table */}
      {result && (
        <div className="overflow-x-auto">
          <div className="mb-2">
            <p className="font-semibold">Student: {result.student_name}</p>
            <p>Admission No: {result.admission_number}</p>
            <p>Class: {result.school_class}</p>
            <p>Position: {result.position}</p>
          </div>

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

          {/* 🔹 Attendance */}
          <div className="mt-6">
            <h3 className="font-semibold mb-2">Attendance Overview</h3>
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border px-2 py-1">Date</th>
                  <th className="border px-2 py-1">Morning</th>
                  <th className="border px-2 py-1">Afternoon</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(attendance).map(([date, periods]) => (
                  <tr key={date}>
                    <td className="border px-2 py-1">{date}</td>
                    <td className="border px-2 py-1">{periods.morning}</td>
                    <td className="border px-2 py-1">{periods.afternoon}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
