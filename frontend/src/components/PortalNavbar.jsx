import { Link } from "react-router-dom";
import { FiUsers, FiUser, FiBookOpen } from "react-icons/fi";

export default function PortalNavbar() {
  return (
    <header className="bg-white border-b">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <img
              src="/schlogo.png"
              alt="Royal Family Academy"
              className="h-10 w-auto"
            />
            <div className="leading-tight">
              <h1 className="text-primary font-bold text-sm md:text-base">
                ROYAL FAMILY ACADEMY
              </h1>
              <p className="text-xs text-gray-500">Powered by BAMITECH</p>
            </div>
          </Link>

          {/* Portal Links */}
          <nav className="flex items-center gap-8 text-sm font-medium">
            <Link
              to="/portal/student"
              className="flex items-center gap-2 hover:text-primary"
            >
              <FiUsers />
              Students
            </Link>

            <Link
              to="/portal/parent"
              className="flex items-center gap-2 hover:text-primary"
            >
              <FiUser />
              Parents
            </Link>

            <Link
              to="/portal/educator"
              className="flex items-center gap-2 hover:text-primary"
            >
              <FiBookOpen />
              Educators
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
