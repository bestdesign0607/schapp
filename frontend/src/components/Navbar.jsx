import { useState } from "react";
import { FiMenu, FiX, FiChevronDown } from "react-icons/fi";
import { Link } from "react-router-dom";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [dropdown, setDropdown] = useState(null);

  const navLinks = [
    {
      name: "About RFA",
      path: "/about",
      items: [
        { label: "Leadership & FAQ", path: "/leadership-faq" },
        { label: "History & Milestones", path: "/history-milestones" },
        { label: "Who We Are", path: "/who-we-are" },
      ],
    },
    {
      name: "Academics",
      path: "/academics",
      items: [
        { label: "Nursery", path: "/academics/nursery" },
        { label: "Primary", path: "/academics/primary" },
        { label: "Secondary", path: "/academics/secondary" },
        { label: "Sixth Form", path: "/academics/sixth-form" },
      ],
    },
    {
      name: "Student Life",
      path: "/student-life",
      items: [
        { label: "Clubs & Societies", path: "/student-life/clubs" },
        { label: "Sports", path: "/student-life/sports" },
        { label: "Spiritual Life", path: "/student-life/spiritual" },
      ],
    },
    {
      name: "Admissions",
      path: "/admissions",
      items: [
        { label: "How to Apply", path: "/admissions/apply" },
        { label: "Tuition & Fees", path: "/admissions/fees" },
        { label: "Scholarships", path: "/admissions/scholarships" },
      ],
    },
    {
      name: "Contact",
      path: "/contact",
      items: null,
    },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <img
              src="schlogo.png"
              alt="Royal Family Academy"
              className="h-10 w-auto"
            />
            <div className="leading-tight">
              <h1 className="text-primary font-bold text-sm md:text-base">
                ROYAL FAMILY ACADEMY
              </h1>
              <p className="text-xs text-gray-500">Wuye, Abuja</p>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link, index) => (
              <div
                key={index}
                className="relative"
                onMouseEnter={() => setDropdown(index)}
                onMouseLeave={() => setDropdown(null)}
              >
                <Link
                  to={link.path}
                  className="flex items-center gap-1 text-gray-800 hover:text-primary font-medium"
                >
                  {link.name}
                  {link.items && <FiChevronDown size={16} />}
                </Link>

                {link.items && dropdown === index && (
                  <div className="absolute top-full mt-3 bg-white shadow-lg rounded-lg w-56 py-2">
                    {link.items.map((item, i) => (
                      <Link
                        key={i}
                        to={item.path}
                        className="block px-4 py-2 text-sm hover:bg-gray-100"
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Portal Button */}
          <div className="hidden md:block">
            <Link
              to="/portal"
              className="bg-gold text-black px-6 py-3 rounded-full font-semibold hover:opacity-90 transition"
            >
              Portal Login
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden text-gray-800"
          >
            {open ? <FiX size={28} /> : <FiMenu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden bg-white border-t">
          <div className="px-6 py-4 space-y-4">
            {navLinks.map((link, index) => (
              <div key={index}>
                <button
                  onClick={() =>
                    setDropdown(dropdown === index ? null : index)
                  }
                  className="flex w-full justify-between items-center font-medium text-gray-800"
                >
                  {link.name}
                  {link.items && <FiChevronDown size={16} />}
                </button>

                {link.items && dropdown === index && (
                  <div className="mt-2 ml-4 space-y-2">
                    {link.items.map((item, i) => (
                      <Link
                        key={i}
                        to={item.path}
                        onClick={() => setOpen(false)}
                        className="block text-sm text-gray-600"
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}

            <Link
              to="/portal"
              onClick={() => setOpen(false)}
              className="block text-center bg-gold text-black py-3 rounded-full font-semibold"
            >
              Portal Login
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
