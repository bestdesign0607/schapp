import { useState } from "react";
import api from "../../api/axios";

export default function CreateSubject() {
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [message, setMessage] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      await api.post("/academics/admin/subjects/create/", { name, code });
      setMessage("Subject created successfully");
      setName("");
      setCode("");
    } catch {
      setMessage("Failed to create subject");
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md max-w-md">
      <h2 className="text-xl font-bold mb-4">Create Subject</h2>

      {message && <p className="mb-3 text-sm">{message}</p>}

      <form onSubmit={submit} className="space-y-4">
        <input
          placeholder="Subject name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg"
          required
        />
        <input
          placeholder="Subject code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg"
          required
        />

        <button className="w-full py-2 bg-blue-600 text-white rounded-lg">
          Create Subject
        </button>
      </form>
    </div>
  );
}
