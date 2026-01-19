// import { Routes, Route } from "react-router-dom";

// import MainLayout from "./layouts/MainLayout";
// import PortalLayout from "./layouts/PortalLayout";

// import Home from "./pages/Home";
// import CurriculumSupport from "./pages/CurriculumSupport";
// import LeadershipFAQ from "./pages/LeadershipFAQ";
// import Nursery from "./pages/academics/Nursery";
// import Primary from "./pages/academics/Primary";
// import HighSchool from "./pages/academics/HighSchool";
// import SixthForm from "./pages/academics/SixthForm";
// import PortalPage from "./pages/PortalPage";

// function App() {
//   return (
//     <Routes>

//       {/* MARKETING / WEBSITE PAGES */}
//       <Route element={<MainLayout />}>
//         <Route path="/" element={<Home />} />
//         <Route path="/curriculum-support" element={<CurriculumSupport />} />
//         <Route path="/leadership-faq" element={<LeadershipFAQ />} />
//         <Route path="/academics/nursery" element={<Nursery />} />
//         <Route path="/academics/primary" element={<Primary />} />
//         <Route path="/academics/secondary" element={<HighSchool />} />
//         <Route path="/academics/sixth-form" element={<SixthForm />} />
//       </Route>

//       {/* PORTAL */}
//       <Route element={<PortalLayout />}>
//         <Route path="/portal" element={<PortalPage />} />
//       </Route>

//     </Routes>
//   );
// }

// export default App;










import { Routes, Route } from "react-router-dom";

/* LAYOUTS */
import MainLayout from "./layouts/MainLayout";
import PortalLayout from "./layouts/PortalLayout";

/* WEBSITE PAGES */
import Home from "./pages/Home";
import CurriculumSupport from "./pages/CurriculumSupport";
import LeadershipFAQ from "./pages/LeadershipFAQ";
import Nursery from "./pages/academics/Nursery";
import Primary from "./pages/academics/Primary";
import HighSchool from "./pages/academics/HighSchool";
import SixthForm from "./pages/academics/SixthForm";

/* PORTAL PAGES */
import PortalPage from "./pages/PortalPage";

/* ADMIN PAGES */
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import TeacherDashboard from "./pages/teacher/TeacherDashboard";
import StudentDashboard from "./pages/student/StudentDashboard";
import ParentDashboard from "./pages/parent/ParentDashboard";

/* AUTH PORTALS */
// import StudentLogin from "./pages/portal/StudentLogin";
// import ParentLogin from "./pages/portal/ParentLogin";
// import TeacherLogin from "./pages/portal/TeacherLogin";

function App() {
  return (
    <Routes>

      {/* ===================== */}
      {/* MARKETING / WEBSITE */}
      {/* ===================== */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/curriculum-support" element={<CurriculumSupport />} />
        <Route path="/leadership-faq" element={<LeadershipFAQ />} />
        <Route path="/academics/nursery" element={<Nursery />} />
        <Route path="/academics/primary" element={<Primary />} />
        <Route path="/academics/secondary" element={<HighSchool />} />
        <Route path="/academics/sixth-form" element={<SixthForm />} />
      </Route>

      {/* ===================== */}
      {/* PORTAL LAYOUT */}
      {/* ===================== */}
      <Route element={<PortalLayout />}>

        {/* Portal landing */}
        <Route path="/portal" element={<PortalPage />} />

        {/* Teacher Dashboard */}
        <Route path="/portal/teacher" element={<TeacherDashboard />} />

        <Route path="/portal/student" element={<StudentDashboard />} />

        <Route path="/portal/parent" element={<ParentDashboard />} />

        {/* Role-based logins */}
        {/* <Route path="/portal/student" element={<StudentLogin />} />
        <Route path="/portal/parent" element={<ParentLogin />} />
        <Route path="/portal/teacher" element={<TeacherLogin />} /> */}

        {/* Admin */}
        <Route path="/portal/admin/login" element={<AdminLogin />} />
        <Route path="/portal/admin/dashboard" element={<AdminDashboard />} />

      </Route>

    </Routes>
  );
}

export default App;
