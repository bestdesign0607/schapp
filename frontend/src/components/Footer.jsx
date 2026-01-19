import {
  FaInstagram,
  FaFacebookF,
  FaTwitter,
  FaLinkedinIn,
} from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-[#f8f7fb] border-t border-purple-200">
      {/* Top Border */}
      <div className="h-1 bg-purple-700" />

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-6 py-20 grid md:grid-cols-3 gap-16">
        {/* About */}
        <div>
          <h4 className="text-xl font-semibold text-purple-700 mb-6">
            About Royal Family Academy
          </h4>

          <p className="text-gray-700 leading-relaxed mb-10">
            Our school has been a beacon of excellence in education for over
            two decades, nurturing young minds from kindergarten through
            grade 12, and now the sixth form college.
          </p>

          <button className="bg-purple-700 hover:bg-purple-800 transition text-white px-8 py-4 rounded-xl font-semibold shadow-lg">
            Apply / Enrol Now
          </button>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-xl font-semibold text-purple-700 mb-6">
            Quick Links
          </h4>

          <ul className="space-y-4 text-gray-800 font-medium">
            <li><a href="/" className="hover:text-purple-700">Home</a></li>
            <li><a href="/about" className="hover:text-purple-700">About Us</a></li>
            <li><a href="/programmes" className="hover:text-purple-700">Programmes</a></li>
            <li><a href="/policies" className="hover:text-purple-700">Policies</a></li>
            <li><a href="/contact" className="hover:text-purple-700">Contact</a></li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="text-xl font-semibold text-purple-700 mb-6">
            Contact Us
          </h4>

          <div className="space-y-4 text-gray-800">
            <p>
              Plot 648 Idris Gidado Way,<br />
              Wuye, Abuja
            </p>

            <p>+234 818 253 5981</p>

            <p>
              <a
                href="mailto:info@royalfamilyacademy.org"
                className="hover:text-purple-700"
              >
                info@royalfamilyacademy.org
              </a>
            </p>
          </div>

          {/* Social Icons */}
          <div className="flex gap-4 mt-10">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="social-icon"
            >
              <FaInstagram />
            </a>

            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="social-icon"
            >
              <FaFacebookF />
            </a>

            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="social-icon"
            >
              <FaTwitter />
            </a>

            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="social-icon"
            >
              <FaLinkedinIn />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-purple-200">
        <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row justify-between items-center gap-4 text-gray-800">
          <p>
            © 2025 Royal Family Academy. All rights reserved.
          </p>

          <p className="text-sm tracking-wide">
            Excellence • Integrity • Innovation • Discipline • Hard Work
          </p>
        </div>
      </div>
    </footer>
  );
}
