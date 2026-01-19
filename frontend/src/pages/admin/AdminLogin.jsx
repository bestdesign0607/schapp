// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import api from "../../api/axios";
// import { FaEye, FaEyeSlash } from "react-icons/fa";

// const AdminLogin = () => {
//   const [staffId, setStaffId] = useState("");
//   const [password, setPassword] = useState("");
//   const [showPassword, setShowPassword] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   const navigate = useNavigate();

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     setError("");
//     setLoading(true);

//     try {
//       const res = await api.post("/accounts/login/", {
//         staff_id: staffId,
//         password,
//       });

//       // Save tokens and role
//       localStorage.setItem("access", res.data.access);
//       localStorage.setItem("refresh", res.data.refresh);
//       localStorage.setItem("role", res.data.role);

//       console.log("Admin logged in:", res.data);

//       // Navigate to admin dashboard
//       if (res.data.role === "admin") {
//         navigate("/portal/admin/dashboard");
//       } else {
//         setError("You are not authorized as admin.");
//       }
//     } catch (err) {
//       console.error(err);
//       setError(
//         err.response?.data?.detail ||
//         err.response?.data?.non_field_errors?.[0] ||
//         "Invalid staff ID or password"
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
//       <form
//         onSubmit={handleLogin}
//         className="bg-white w-full max-w-md p-8 rounded-2xl shadow-lg"
//       >
//         <h2 className="text-2xl font-bold mb-6 text-center">
//           Admin Login
//         </h2>

//         {error && (
//           <p className="bg-red-100 text-red-600 p-3 rounded mb-4 text-sm">
//             {error}
//           </p>
//         )}

//         {/* Staff ID */}
//         <div className="mb-4">
//           <label className="block text-sm font-medium mb-1">Staff ID</label>
//           <input
//             type="text"
//             value={staffId}
//             onChange={(e) => setStaffId(e.target.value)}
//             required
//             className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
//           />
//         </div>

//         {/* Password */}
//         <div className="mb-6 relative">
//           <label className="block text-sm font-medium mb-1">Password</label>
//           <input
//             type={showPassword ? "text" : "password"}
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             required
//             className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none pr-10"
//           />
//           <button
//             type="button"
//             onClick={() => setShowPassword(!showPassword)}
//             className="absolute right-3 top-9 text-gray-500 hover:text-gray-700"
//           >
//             {showPassword ? <FaEyeSlash /> : <FaEye />}
//           </button>
//         </div>

//         <button
//           type="submit"
//           disabled={loading}
//           className="w-full py-3 rounded-lg font-semibold bg-blue-600 text-white hover:bg-blue-700 transition disabled:opacity-60"
//         >
//           {loading ? "Logging in..." : "Login"}
//         </button>
//       </form>
//     </div>
//   );
// };

// export default AdminLogin;












import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const AdminLogin = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await api.post("/accounts/admin/login/", {
        username,
        password,
      });

      const { access, refresh, role } = res.data;

      // Save tokens
      localStorage.setItem("access", access);
      localStorage.setItem("refresh", refresh);
      localStorage.setItem("role", role);

      // Redirect admin
      navigate("/portal/admin/dashboard");

    } catch (err) {
      console.error(err.response?.data);
      setError(
        err.response?.data?.detail ||
        err.response?.data?.non_field_errors?.[0] ||
        "Invalid admin credentials"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <form
        onSubmit={handleLogin}
        className="bg-white w-full max-w-md p-8 rounded-2xl shadow-lg"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">
          Admin Login
        </h2>

        {error && (
          <p className="bg-red-100 text-red-600 p-3 rounded mb-4 text-sm">
            {error}
          </p>
        )}

        {/* Username */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">
            Admin Username
          </label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        {/* Password */}
        <div className="mb-6 relative">
          <label className="block text-sm font-medium mb-1">
            Password
          </label>
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none pr-10"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-9 text-gray-500 hover:text-gray-700"
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-lg font-semibold bg-blue-600 text-white hover:bg-blue-700 transition disabled:opacity-60"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
};

export default AdminLogin;
