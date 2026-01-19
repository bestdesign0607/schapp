import { Link } from "react-router-dom";

const sixthFormClasses = [
  { className: "Year 12", minAge: "17 years", asAt: "September" },
  { className: "Year 13", minAge: "18 years", asAt: "September" },
];

export default function SixthForm() {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-purple-900 via-purple-700 to-yellow-700 text-white py-28 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Sixth Form College Admissions
        </h1>

        <p className="text-gray-200 mb-8">
          <Link to="/" className="hover:underline">Home</Link> ›{" "}
          <Link to="/admissions" className="hover:underline">Admissions</Link> › Sixth Form Admissions
        </p>

        <span className="inline-block bg-yellow-500 text-black px-8 py-3 rounded-full font-semibold">
          17 Years +
        </span>
      </section>

      {/* Content */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6 max-w-5xl">
          <h2 className="text-4xl font-semibold text-purple-700 text-center mb-4">
            Sixth Form College
          </h2>

          <p className="text-center text-gray-600 text-lg mb-10">
            Admission is based on age, academic performance and programme suitability.
          </p>

          {/* Note */}
          <p className="text-gray-700 text-lg mb-12">
            <strong>Age and academic readiness are strictly considered</strong> to
            ensure students are well-prepared for advanced studies and future
            university or career pathways.
          </p>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white rounded-xl border border-gray-200 shadow-sm">
              <thead className="bg-[#f6f1e5]">
                <tr>
                  <th className="py-4 px-6 text-left font-semibold">Class</th>
                  <th className="py-4 px-6 text-left font-semibold">Minimum Age</th>
                  <th className="py-4 px-6 text-left font-semibold">As at</th>
                </tr>
              </thead>
              <tbody>
                {sixthFormClasses.map((item, index) => (
                  <tr key={index} className="border-t hover:bg-gray-50">
                    <td className="py-4 px-6">{item.className}</td>
                    <td className="py-4 px-6">{item.minAge}</td>
                    <td className="py-4 px-6">{item.asAt}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
}
