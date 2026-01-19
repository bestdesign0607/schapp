// import { useState, useEffect } from "react";
// import api from "../../api/axios"; // adjust path

// export default function MarkAttendance() {
//   const [classes, setClasses] = useState([]);
//   const [students, setStudents] = useState([]);
//   const [selectedClass, setSelectedClass] = useState("");
//   const [date, setDate] = useState(new Date().toISOString().split("T")[0]); // default today
//   const [period, setPeriod] = useState("morning");
//   const [attendanceData, setAttendanceData] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [success, setSuccess] = useState("");
//   const [error, setError] = useState("");

//   // Fetch classes teacher manages
//   useEffect(() => {
//     const fetchClasses = async () => {
//       try {
//         const res = await api.get("/academics/teacher/assignments/"); // returns assignments with class info
//         const uniqueClasses = [
//           ...new Map(res.data.map(a => [a.school_class.id, a.school_class])).values(),
//         ];
//         setClasses(uniqueClasses);
//       } catch (err) {
//         console.error(err);
//         setError("Failed to load your classes");
//       }
//     };
//     fetchClasses();
//   }, []);

//   // Fetch students when class changes
//   useEffect(() => {
//     if (!selectedClass) {
//       setStudents([]);
//       setAttendanceData([]);
//       return;
//     }

//     const fetchStudents = async () => {
//       try {
//         const res = await api.get("/academics/teacher/students/"); // adjust URL if needed
//         const filtered = res.data.students.filter(s =>
//           s.school_classes.includes(Number(selectedClass))
//         );
//         setStudents(filtered);

//         // Initialize attendance data for each student
//         setAttendanceData(
//           filtered.map(s => ({
//             student: s.id,
//             school_class: Number(selectedClass),
//             date,
//             period,
//             status: "present",
//             reason: "",
//           }))
//         );
//       } catch (err) {
//         console.error(err);
//         setError("Failed to load students");
//       }
//     };
//     fetchStudents();
//   }, [selectedClass, date, period]);

//   // Handle status / reason change
//   const handleChange = (index, field, value) => {
//     const updated = [...attendanceData];
//     updated[index][field] = value;
//     setAttendanceData(updated);
//   };

//   // Submit attendance
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");
//     setSuccess("");
//     setLoading(true);

//     try {
//       await api.post("/academics/class-teacher/attendance/create/", attendanceData);
//       setSuccess("Attendance marked successfully!");
//     } catch (err) {
//       console.error(err.response || err);
//       setError(err.response?.data?.detail || "Failed to mark attendance");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
//       <h2 className="text-2xl font-bold mb-4">Mark Attendance</h2>

//       {error && <p className="text-red-600 mb-2">{error}</p>}
//       {success && <p className="text-green-600 mb-2">{success}</p>}

//       <form onSubmit={handleSubmit} className="space-y-4">
//         {/* Class */}
//         <div>
//           <label className="block font-medium mb-1">Class</label>
//           <select
//             value={selectedClass}
//             onChange={e => setSelectedClass(e.target.value)}
//             className="w-full border px-3 py-2 rounded-lg"
//             required
//           >
//             <option value="">Select Class</option>
//             {classes.map(c => (
//               <option key={c.id} value={c.id}>
//                 {c.name} {c.section && `(${c.section})`}
//               </option>
//             ))}
//           </select>
//         </div>

//         {/* Date */}
//         <div>
//           <label className="block font-medium mb-1">Date</label>
//           <input
//             type="date"
//             value={date}
//             onChange={e => setDate(e.target.value)}
//             className="w-full border px-3 py-2 rounded-lg"
//             required
//           />
//         </div>

//         {/* Period */}
//         <div>
//           <label className="block font-medium mb-1">Period</label>
//           <select
//             value={period}
//             onChange={e => setPeriod(e.target.value)}
//             className="w-full border px-3 py-2 rounded-lg"
//             required
//           >
//             <option value="morning">Morning</option>
//             <option value="afternoon">Afternoon</option>
//           </select>
//         </div>

//         {/* Students */}
//         <div>
//           <label className="block font-medium mb-2">Students</label>
//           <div className="space-y-2 max-h-96 overflow-y-auto border rounded-lg p-2">
//             {attendanceData.map((att, idx) => {
//               const student = students.find(s => s.id === att.student);
//               return (
//                 <div key={att.student} className="flex items-center gap-4">
//                   <span className="flex-1">{student?.full_name}</span>
//                   <select
//                     value={att.status}
//                     onChange={e => handleChange(idx, "status", e.target.value)}
//                     className="border px-2 py-1 rounded-lg"
//                   >
//                     <option value="present">Present</option>
//                     <option value="absent">Absent</option>
//                   </select>
//                   {att.status === "absent" && (
//                     <input
//                       type="text"
//                       placeholder="Reason"
//                       value={att.reason}
//                       onChange={e => handleChange(idx, "reason", e.target.value)}
//                       className="border px-2 py-1 rounded-lg flex-1"
//                       required
//                     />
//                   )}
//                 </div>
//               );
//             })}
//           </div>
//         </div>

//         <button
//           type="submit"
//           disabled={loading}
//           className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
//         >
//           {loading ? "Submitting..." : "Mark Attendance"}
//         </button>
//       </form>
//     </div>
//   );
// }















import { useState, useEffect } from "react";
import api from "../../api/axios";

export default function MarkAttendance() {
    const [classes, setClasses] = useState([]);
    const [students, setStudents] = useState([]);
    const [selectedClass, setSelectedClass] = useState("");
    const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
    const [period, setPeriod] = useState("morning");
    const [attendanceRecords, setAttendanceRecords] = useState([]);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");

    // Fetch classes for the teacher
    useEffect(() => {
        const fetchClasses = async () => {
            try {
                const res = await api.get("/academics/teacher/assignments/");
                const uniqueClasses = [
                    ...new Map(res.data.map((a) => [a.school_class.id, a.school_class]))
                        .values(),
                ];
                setClasses(uniqueClasses);
            } catch (err) {
                console.error(err);
                setError("Failed to load your classes");
            }
        };
        fetchClasses();
    }, []);

    // Fetch students when a class is selected
    // useEffect(() => {
    //     if (!selectedClass) return;

    //     const fetchStudents = async () => {
    //         try {
    //             const res = await api.get("/academics/teacher/students/");
    //             const allStudents = res.data.students;

    //             const filtered = allStudents.filter(
    //                 (s) =>
    //                     s.school_class &&
    //                     s.school_class.id === Number(selectedClass) // match student's class
    //             );

    //             setStudents(filtered);

    //             // Initialize attendance records
    //             setAttendanceRecords(
    //                 filtered.map((s) => ({
    //                     student: s.id,
    //                     school_class: Number(selectedClass),
    //                     status: "present",
    //                     period,
    //                     reason: "",
    //                     date,
    //                 }))
    //             );
    //         } catch (err) {
    //             console.error(err);
    //             setError("Failed to load students");
    //         }
    //     };

    //     fetchStudents();
    // }, [selectedClass, period, date]);


    useEffect(() => {
  if (!selectedClass) return;

  const fetchStudents = async () => {
    try {
      const res = await api.get(
        `/academics/class-teacher/classes/${selectedClass}/students/`
      );

      setStudents(res.data);

      setAttendanceRecords(
        res.data.map((s) => ({
          student: s.id,
          school_class: Number(selectedClass),
          date,
          period,
          status: "present",
          reason: "",
        }))
      );
    } catch (err) {
      console.error(err);
      setError("Failed to load students for this class");
    }
  };

  fetchStudents();
}, [selectedClass, date, period]);





    // Update individual student attendance
    const updateRecord = (index, field, value) => {
        setAttendanceRecords((prev) =>
            prev.map((r, i) => (i === index ? { ...r, [field]: value } : r))
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setSuccess("");

        try {
            await api.post("/academics/class-teacher/attendance/create/", attendanceRecords);
            setSuccess("Attendance marked successfully!");
        } catch (err) {
            console.error(err.response?.data || err);
            setError(err.response?.data?.detail || "Failed to mark attendance");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4">Mark Attendance</h2>

            {error && <p className="text-red-600 mb-2">{error}</p>}
            {success && <p className="text-green-600 mb-2">{success}</p>}

            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Class selection */}
                <div>
                    <label className="block font-medium mb-1">Class</label>
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

                {/* Date */}
                <div>
                    <label className="block font-medium mb-1">Date</label>
                    <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="w-full border px-3 py-2 rounded-lg"
                        required
                    />
                </div>

                {/* Period */}
                <div>
                    <label className="block font-medium mb-1">Period</label>
                    <select
                        value={period}
                        onChange={(e) => setPeriod(e.target.value)}
                        className="w-full border px-3 py-2 rounded-lg"
                        required
                    >
                        <option value="morning">Morning</option>
                        <option value="afternoon">Afternoon</option>
                    </select>
                </div>

                {/* Students list */}
                <div>
                    <h3 className="font-semibold mb-2">Students</h3>
                    {students.map((s, index) => (
                        <div
                            key={s.id}
                            className="flex items-center space-x-3 border-b py-2"
                        >
                            <span className="flex-1">{s.full_name}</span>

                            <select
                                value={attendanceRecords[index]?.status}
                                onChange={(e) =>
                                    updateRecord(index, "status", e.target.value)
                                }
                                className="border px-2 py-1 rounded"
                            >
                                <option value="present">Present</option>
                                <option value="absent">Absent</option>
                            </select>

                            {attendanceRecords[index]?.status === "absent" && (
                                <input
                                    type="text"
                                    placeholder="Reason"
                                    value={attendanceRecords[index]?.reason}
                                    onChange={(e) => updateRecord(index, "reason", e.target.value)}
                                    className="border px-2 py-1 rounded flex-1"
                                    required
                                />
                            )}
                        </div>
                    ))}
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
                >
                    {loading ? "Submitting..." : "Submit Attendance"}
                </button>
            </form>
        </div>
    );
}
