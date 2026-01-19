import { useState, useEffect } from "react";
import api from "../../api/axios";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function CreateUser({ accountType }) {
  const [formData, setFormData] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  // Reset form fields on account type change
  useEffect(() => {
    switch (accountType) {
      case "teacher":
        setFormData({
          full_name: "",
          email: "",
          staff_id: "",
          phone: "",
          state_of_origin: "",
        });
        break;
      case "student":
        setFormData({
          admission_number: "",
          full_name: "",
          state_of_origin: "",
        });
        break;
      case "parent":
        setFormData({
          admission_number: "",
          full_name: "",
          state_of_origin: "",
          religion: "",
          phone: "",
        });
        break;
      default:
        setFormData({});
    }

    setMessage("");
    setShowPassword(false);
  }, [accountType]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      let endpoint = "";
      if (accountType === "teacher") endpoint = "/accounts/teachers/create/";
      if (accountType === "student") endpoint = "/accounts/students/create/";
      if (accountType === "parent") endpoint = "/accounts/parents/create/";

      // Add password field dynamically using state_of_origin
      let payload = { ...formData };
      if (accountType === "teacher") payload.password = formData.state_of_origin;
      if (accountType === "student") payload.password = formData.state_of_origin;
      if (accountType === "parent") payload.password = formData.state_of_origin;

      const res = await api.post(endpoint, payload);

      setMessage(res.data.message || "User created successfully");

      // Reset form
      setFormData(
        Object.fromEntries(
          Object.keys(formData).map((key) => [key, ""])
        )
      );
      setShowPassword(false);
    } catch (err) {
      setMessage(
        err.response?.data?.message ||
          err.response?.data?.detail ||
          "An error occurred"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {Object.keys(formData).map((key) => {
        const isPassword = key === "password" || key === "state_of_origin";

        return (
          <div key={key} className="relative">
            <input
              type={
                isPassword
                  ? showPassword
                    ? "text"
                    : "password"
                  : key === "email"
                  ? "email"
                  : "text"
              }
              name={key}
              value={formData[key]}
              onChange={handleChange}
              placeholder={key.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
              className="w-full px-4 py-2 border rounded pr-10"
              required
            />

            {isPassword && (
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            )}
          </div>
        );
      })}

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={rememberMe}
          onChange={(e) => setRememberMe(e.target.checked)}
        />
        <span className="text-sm">Remember me</span>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-60"
      >
        {loading ? "Submitting..." : "Submit"}
      </button>

      <p
        className={`mt-2 text-sm ${
          message.toLowerCase().includes("error") ? "text-red-600" : "text-green-600"
        }`}
      >
        {message}
      </p>
    </form>
  );
}
