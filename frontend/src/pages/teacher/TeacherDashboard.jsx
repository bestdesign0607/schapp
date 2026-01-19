import { useState } from "react";
import EnterResult from "./EnterResult";
// import ApproveResult from "./ApproveResult";

import ViewResults from "./ViewResults";
import MarkAttendance from "./MarkAttendance";
import ViewAttendance from "./ViewAttendance";

export default function TeacherDashboard() {
  const [activeSection, setActiveSection] = useState("enterResult");

  const menuBtn = (key, label) => (
    <button
      onClick={() => setActiveSection(key)}
      className={`mb-3 py-2 px-4 rounded-lg text-left w-full ${
        activeSection === key
          ? "bg-blue-600 text-white"
          : "bg-gray-200 text-gray-800 hover:bg-gray-300"
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg p-6 flex flex-col">
        <h2 className="text-xl font-bold mb-6">Teacher Menu</h2>

        {menuBtn("enterResult", "Enter Result")}
        {menuBtn("viewAttendance", "View Attendance")}
        {menuBtn("markAttendance", "Mark Attendance")}
        {menuBtn("viewResults", "View Results")}
      </div>

      {/* Main content */}
      <div className="flex-1 p-8">
        {activeSection === "enterResult" && (
          <div className="bg-white p-6 rounded-lg shadow-md max-w-3xl">
            <h2 className="text-2xl font-bold mb-4">Enter Student Results</h2>
            <EnterResult />
          </div>
        )}

        {activeSection === "viewAttendance" && (
          <div className="bg-white p-6 rounded-lg shadow-md max-w-3xl">
            <h2 className="text-2xl font-bold mb-4">View Attendance</h2>
            <ViewAttendance />
          </div>
        )}

        {activeSection === "markAttendance" && (
          <div className="bg-white p-6 rounded-lg shadow-md max-w-3xl">
            <h2 className="text-2xl font-bold mb-4">Mark Attendance</h2>
            <MarkAttendance />
          </div>
        )}

        {activeSection === "viewResults" && (
          <div className="bg-white p-6 rounded-lg shadow-md max-w-3xl">
            <h2 className="text-2xl font-bold mb-4">View Results</h2>
            <ViewResults />
          </div>
        )}
      </div>
    </div>
  );
}
