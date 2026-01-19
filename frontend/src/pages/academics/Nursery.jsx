// import { Link } from "react-router-dom";

// const nurseryClasses = [
//   { className: "Crèche", minAge: "3 months", asAt: "September" },
//   { className: "Playgroup", minAge: "1.4 years", asAt: "September" },
//   { className: "Pre-School", minAge: "2.4 years", asAt: "September" },
//   { className: "Pre-Kindergarten", minAge: "3.4 years", asAt: "September" },
//   { className: "Kindergarten", minAge: "4.4 years", asAt: "September" },
// ];

// export default function Nursery() {
//   return (
//     <div>
//       {/* Hero Section */}
//       <section className="relative bg-gradient-to-r from-purple-800 to-yellow-700 text-white py-24 text-center">
//         <h1 className="text-4xl md:text-5xl font-bold mb-4">
//           Nursery Admissions
//         </h1>
//         <p className="mb-6 text-gray-200">
//           <Link to="/" className="hover:underline">Home</Link> ›{" "}
//           <Link to="/admissions" className="hover:underline">Admissions</Link> › Nursery Admissions
//         </p>
//         <button className="bg-gold text-black px-8 py-3 rounded-full font-semibold hover:scale-105 transition-transform duration-300">
//           Crèche – Kindergarten (3.1)
//         </button>
//       </section>

//       {/* Table Section */}
//       <section className="py-20 bg-gray-50">
//         <div className="container mx-auto px-6">
//           <h2 className="text-3xl font-semibold text-center text-purple-700 mb-4">
//             Crèche – Kindergarten
//           </h2>
//           <p className="text-center text-gray-600 mb-10">
//             Minimum entry ages are measured as at <em>September</em> of the year of admission.
//           </p>

//           <div className="overflow-x-auto">
//             <table className="min-w-full bg-white rounded-xl shadow-md">
//               <thead className="bg-yellow-100 text-left">
//                 <tr>
//                   <th className="py-3 px-6">Class</th>
//                   <th className="py-3 px-6">Minimum Age</th>
//                   <th className="py-3 px-6">As at</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {nurseryClasses.map((item, index) => (
//                   <tr
//                     key={index}
//                     className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
//                   >
//                     <td className="py-4 px-6">{item.className}</td>
//                     <td className="py-4 px-6">{item.minAge}</td>
//                     <td className="py-4 px-6">{item.asAt}</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       </section>
//     </div>
//   );
// }













import { Link } from "react-router-dom";

const nurseryClasses = [
  { className: "Crèche", minAge: "3 months", asAt: "September" },
  { className: "Playgroup", minAge: "1.4 years", asAt: "September" },
  { className: "Pre-School", minAge: "2.4 years", asAt: "September" },
  { className: "Pre-Kindergarten", minAge: "3.4 years", asAt: "September" },
  { className: "Kindergarten", minAge: "4.4 years", asAt: "September" },
];

export default function Nursery() {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-purple-800 to-yellow-700 text-white py-24 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Nursery Admissions
        </h1>
        <p className="mb-6 text-gray-200">
          <Link to="/" className="hover:underline">Home</Link> ›{" "}
          <Link to="/admissions" className="hover:underline">Admissions</Link> › Nursery Admissions
        </p>
        <button className="bg-yellow-400 text-black px-8 py-3 rounded-full font-semibold hover:scale-105 transition-transform duration-300">
          Crèche – Kindergarten (3.1)
        </button>
      </section>

      {/* Table Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-semibold text-center text-purple-700 mb-4">
            Crèche – Kindergarten
          </h2>
          <p className="text-center text-gray-600 mb-10">
            Minimum entry ages are measured as at <em>September</em> of the year of admission.
          </p>

          <div className="overflow-x-auto mb-12">
            <table className="min-w-full bg-white rounded-xl shadow-md">
              <thead className="bg-yellow-100 text-left">
                <tr>
                  <th className="py-3 px-6">Class</th>
                  <th className="py-3 px-6">Minimum Age</th>
                  <th className="py-3 px-6">As at</th>
                </tr>
              </thead>
              <tbody>
                {nurseryClasses.map((item, index) => (
                  <tr
                    key={index}
                    className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                  >
                    <td className="py-4 px-6">{item.className}</td>
                    <td className="py-4 px-6">{item.minAge}</td>
                    <td className="py-4 px-6">{item.asAt}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Highlight Info Box */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 mb-16">
            <p className="text-gray-700 leading-relaxed">
              The Nursery section comprises four classes (Playgroup, Pre-school,
              Pre-Kindergarten and Kindergarten), and{" "}
              <strong>age appropriateness is strictly adhered to</strong> to ensure
              pupils are ready physically, mentally, socially and emotionally.
            </p>
          </div>

          {/* Admissions Process */}
          <div className="mb-16">
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">
              Admissions Process
            </h3>
            <ol className="list-decimal list-inside space-y-3 text-gray-700">
              <li>Age check against the table above.</li>
              <li>
                Admissions decision is based on age appropriateness and the
                outcome of an academic assessment.
              </li>
              <li>
                Upon successful offer, complete registration and onboarding
                with the Nursery office.
              </li>
            </ol>
          </div>

          {/* Contact Card */}
          <div className="bg-white rounded-xl shadow-md p-8 max-w-2xl">
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">
              Questions? Contact Nursery Admissions
            </h3>

            <p className="text-gray-700 mb-3">
              <strong>Nursery/Primary:</strong>{" "}
              <a href="tel:+2348182535981" className="text-purple-700 hover:underline">
                +234 818 253 5981
              </a>{" "}
              /{" "}
              <a href="tel:+2348187111069" className="text-purple-700 hover:underline">
                +234 818 711 1069
              </a>
            </p>

            <p className="text-gray-700">
              <strong>Email:</strong>{" "}
              <a
                href="mailto:info@royalfamilyacademy.org"
                className="text-purple-700 hover:underline"
              >
                info@royalfamilyacademy.org
              </a>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
