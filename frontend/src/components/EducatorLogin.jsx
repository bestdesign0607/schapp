import { useState } from "react";
import {
  FiUser,
  FiUsers,
  FiBookOpen,
  FiLock,
  FiLogIn,
  FiCalendar,
  FiCreditCard,
  FiEye,
  FiEyeOff,
} from "react-icons/fi";
import { HiAcademicCap } from "react-icons/hi";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function EducatorLogin() {
  const navigate = useNavigate();

  const [role, setRole] = useState("teacher");
  const [identifier, setIdentifier] = useState(""); // staff_id or admission_number
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const roleConfig = {
    student: {
      title: "Student Login",
      subtitle: "Access your learning dashboard",
      placeholder: "Enter your Admission Number",
      icon: <FiUsers />,
    },
    parent: {
      title: "Parent Login",
      subtitle: "Access your child's academic records",
      placeholder: "Enter your Child's Admission Number",
      icon: <FiUser />,
    },
    teacher: {
      title: "Teacher Login",
      subtitle: "Access your teaching dashboard",
      placeholder: "Enter your Staff ID",
      icon: <FiBookOpen />,
    },
  };

  const current = roleConfig[role];

  // const handleLogin = async (e) => {
  //   e.preventDefault();
  //   setError("");
  //   setLoading(true);

  //   try {
  //     const payload = { identifier, password, role };

  //     const res = await api.post("/accounts/login/", payload);
  //     const { access, refresh, role: userRole } = res.data;

  //     // Store tokens
  //     const storage = remember ? localStorage : sessionStorage;
  //     storage.setItem("access", access);
  //     storage.setItem("refresh", refresh);
  //     storage.setItem("role", userRole);

  //     // Redirect
  //     if (userRole === "teacher") navigate("/portal/teacher");
  //     else if (userRole === "student") navigate("/portal/student");
  //     else if (userRole === "parent") navigate("/portal/parent");
  //     else navigate("/");

  //   } catch (err) {
  //     console.error("Login error response:", err.response);

  //     // Extract backend error messages intelligently
  //     let message = "Invalid login credentials";

  //     if (err.response) {
  //       const data = err.response.data;

  //       if (data.detail) message = data.detail;                // DRF detail message
  //       else if (data.non_field_errors?.length) message = data.non_field_errors[0];
  //       else if (data.identifier?.length) message = data.identifier[0];  // serializer field errors
  //       else if (data.password?.length) message = data.password[0];
  //     } else if (err.message) {
  //       message = err.message; // network error
  //     }

  //     setError(message);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleLogin = async (e) => {
  e.preventDefault();
  setError("");
  setLoading(true);

  try {
    const payload = { identifier, password, role };

    const res = await api.post("/accounts/login/", payload);
    const { access, refresh, role: userRole } = res.data;

    // Store tokens
    const storage = remember ? localStorage : sessionStorage;
    storage.setItem("access", access);
    storage.setItem("refresh", refresh);
    storage.setItem("role", userRole);

    // ✅ Use backend role for redirect, NOT frontend selected role
    switch (userRole) {
      case "teacher":
        navigate("/portal/teacher");
        break;
      case "student":
        navigate("/portal/student");
        break;
      case "parent":
        navigate("/portal/parent");
        break;
      default:
        navigate("/");
    }

  } catch (err) {
    console.error("Login error response:", err.response);

    let message = "Invalid login credentials";

    if (err.response) {
      const data = err.response.data;
      if (data.detail) message = data.detail;
      else if (data.non_field_errors?.length) message = data.non_field_errors[0];
      else if (data.identifier?.length) message = data.identifier[0];
      else if (data.password?.length) message = data.password[0];
    } else if (err.message) {
      message = err.message;
    }

    setError(message);
  } finally {
    setLoading(false);
  }
};




  return (
    <div className="container mx-auto px-6 py-16">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

        {/* LEFT SIDE */}
        <div className="bg-white rounded-2xl p-10 shadow-sm">
          <h1 className="text-4xl font-bold text-gray-900">
            AI-powered Digital <span className="text-gold">Infrastructure</span>
          </h1>
          <p className="mt-4 text-gray-600">
            AI-powered education platform that revolutionises learning, administration, and finance.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
            <Link to="/portal/student" className="border rounded-xl p-5 flex gap-4 hover:shadow-md">
              <HiAcademicCap className="text-gold text-2xl" />
              <div>
                <h3 className="font-semibold">AI Student Tutor</h3>
                <p className="text-sm text-gray-500">Personalized learning</p>
              </div>
            </Link>

            <Link to="/portal/cbt" className="border rounded-xl p-5 flex gap-4 hover:shadow-md">
              <FiBookOpen className="text-gold text-2xl" />
              <div>
                <h3 className="font-semibold">CBT Platform</h3>
                <p className="text-sm text-gray-500">Computer-based tests</p>
              </div>
            </Link>

            <Link to="/portal/fees" className="border rounded-xl p-5 flex gap-4 hover:shadow-md md:col-span-2">
              <FiCreditCard className="text-gold text-2xl" />
              <div>
                <h3 className="font-semibold">Fee Payment</h3>
                <p className="text-sm text-gray-500">Secure payments</p>
              </div>
            </Link>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="bg-white rounded-2xl p-10 shadow-sm">
          <div className="text-center mb-6">
            <img src="/schlogo.png" alt="RFA" className="h-12 mx-auto mb-4" />
            <h2 className="text-2xl font-bold flex justify-center items-center gap-2">
              {current.icon} {current.title}
            </h2>
            <p className="text-gray-500 text-sm">{current.subtitle}</p>
          </div>

          {/* ROLE SWITCH */}
          <div className="flex justify-center gap-2 mb-6">
            {["student", "parent", "teacher"].map((r) => (
              <button
                key={r}
                onClick={() => setRole(r)}
                className={`px-4 py-2 rounded-full text-sm border ${role === r ? "bg-gold text-black" : "hover:bg-gray-50"
                  }`}
              >
                {r.charAt(0).toUpperCase() + r.slice(1)}
              </button>
            ))}
          </div>

          {/* LOGIN FORM */}
          <form onSubmit={handleLogin} className="space-y-5">
            <div className="relative">
              <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder={current.placeholder}
                className="w-full border rounded-lg pl-11 pr-4 py-3"
                required
              />
            </div>

            <div className="relative">
              <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full border rounded-lg pl-11 pr-12 py-3"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>

            {error && <p className="text-red-600 text-sm">{error}</p>}

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                />
                Remember me
              </label>

              <Link to="/forgot-password" className="text-gold">
                Forgot Password?
              </Link>
            </div>

            <button
              disabled={loading}
              className="w-full bg-gold py-3 rounded-lg font-semibold flex items-center justify-center gap-2"
            >
              <FiLogIn />
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <Link to="/tour" className="mt-6 border rounded-xl py-3 flex justify-center gap-2 hover:bg-gray-50">
            <FiCalendar />
            Book a Tour
          </Link>
        </div>
      </div>
    </div>
  );
}
