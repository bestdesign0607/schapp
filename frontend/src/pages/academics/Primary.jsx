import { Link } from "react-router-dom";

const primaryClasses = [
  { className: "1st Grade", minAge: "5.4 years", asAt: "September" },
  { className: "2nd Grade", minAge: "6.4 years", asAt: "September" },
  { className: "3rd Grade", minAge: "7.4 years", asAt: "September" },
  { className: "4th Grade", minAge: "8.4 years", asAt: "September" },
  { className: "5th Grade", minAge: "9.4 years", asAt: "September" },
  { className: "6th Grade", minAge: "10.4 years", asAt: "September" },
];

export default function Primary() {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-purple-900 via-purple-700 to-yellow-700 text-white py-28 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Primary Admissions
        </h1>

        <p className="text-gray-200 mb-8">
          <Link to="/" className="hover:underline">Home</Link> ›{" "}
          <Link to="/admissions" className="hover:underline">Admissions</Link> › Primary Admissions
        </p>

        <span className="inline-block bg-yellow-500 text-black px-8 py-3 rounded-full font-semibold">
          Grades 1–6
        </span>
      </section>

      {/* Content Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6 max-w-6xl">
          {/* Heading */}
          <h2 className="text-4xl font-semibold text-purple-700 text-center mb-4">
            Grades 1–6
          </h2>

          <p className="text-center text-gray-600 text-lg mb-10">
            Placement is based on minimum ages “as at September” and readiness.
          </p>

          {/* Age Appropriateness Note */}
          <div className="mb-12">
            <p className="text-gray-700 text-lg leading-relaxed">
              <strong>Age appropriateness is strictly adhered to</strong> so
              learners are physically, mentally, socially and emotionally ready
              for class placement.
            </p>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white rounded-xl border border-gray-200 shadow-sm">
              <thead className="bg-[#f6f1e5] text-left">
                <tr>
                  <th className="py-4 px-6 text-gray-700 font-semibold">
                    Class
                  </th>
                  <th className="py-4 px-6 text-gray-700 font-semibold">
                    Minimum Age
                  </th>
                  <th className="py-4 px-6 text-gray-700 font-semibold">
                    As at
                  </th>
                </tr>
              </thead>

              <tbody>
                {primaryClasses.map((item, index) => (
                  <tr
                    key={index}
                    className="border-t border-gray-200 hover:bg-gray-50 transition"
                  >
                    <td className="py-4 px-6 text-gray-700">
                      {item.className}
                    </td>
                    <td className="py-4 px-6 text-gray-700">
                      {item.minAge}
                    </td>
                    <td className="py-4 px-6 text-gray-700">
                      {item.asAt}
                    </td>
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
