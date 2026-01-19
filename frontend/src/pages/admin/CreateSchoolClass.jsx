import { useState } from "react";
import api from "../../api/axios";

export default function CreateSchoolClass() {
  const [name, setName] = useState("");
  const [section, setSection] = useState("");
  const [message, setMessage] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      await api.post("/academics/admin/classes/create/", { name, section });
      setMessage("Class created successfully");
      setName("");
      setSection("");
    } catch {
      setMessage("Failed to create class");
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md max-w-md">
      <h2 className="text-xl font-bold mb-4">Create Class</h2>

      {message && <p className="mb-3 text-sm">{message}</p>}

      <form onSubmit={submit} className="space-y-4">
        <input
          placeholder="Class (e.g JSS 1)"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg"
          required
        />
        <input
          placeholder="Section (e.g A)"
          value={section}
          onChange={(e) => setSection(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg"
          required
        />

        <button className="w-full py-2 bg-blue-600 text-white rounded-lg">
          Create Class
        </button>
      </form>
    </div>
  );
}
