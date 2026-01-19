import { Link } from "react-router-dom";

const offerings = [
  {
    title: "Integrated Christian Curriculum",
    description:
      "Faith, ethics, and knowledge woven together for holistic growth.",
    color: "bg-purple-500",
  },
  {
    title: "Robust Co-curricular Programmes",
    description:
      "Sports, arts, clubs, and service—every student finds their spark.",
    color: "bg-yellow-500",
  },
  {
    title: "Christian Discipleship & Mentoring",
    description:
      "Guided faith journeys that shape values and character.",
    color: "bg-blue-600",
  },
  {
    title: "Career Development Programmes",
    description:
      "Pathways, internships, and counselling for confident next steps.",
    color: "bg-red-500",
  },
  {
    title: "National & International Languages",
    description:
      "Language learning that builds cultural awareness and communication.",
    color: "bg-emerald-500",
  },
  {
    title: "Special Educational Needs (Discovery Centre)",
    description:
      "Tailored support and resources so every learner thrives.",
    color: "bg-amber-500",
  },
];

export default function Offerings() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-20">
      {/* Header */}
      <div className="text-center mb-16">
        <p className="text-sm tracking-widest text-gray-500 uppercase">
          Distinctives
        </p>
        <h2 className="text-4xl font-bold text-purple-700 mt-4">
          What We Offer
        </h2>
        <p className="text-gray-600 mt-4">
          Programmes and support that develop both mind and character.
        </p>
      </div>

      {/* Cards */}
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {offerings.map((item, index) => (
          <div
            key={index}
            className={`${item.color} text-white rounded-2xl p-8 flex flex-col justify-between shadow-lg`}
          >
            <div>
              <h3 className="text-xl font-semibold mb-4">
                {item.title}
              </h3>
              <p className="opacity-90">
                {item.description}
              </p>
            </div>

            <Link
              to="/curriculum-support"
              className="mt-8 inline-flex items-center font-semibold hover:underline"
            >
              Learn more →
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}
