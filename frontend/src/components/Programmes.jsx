import { Link } from "react-router-dom";

const programmes = [
  {
    title: "Nursery School",
    age: "3 months – 4 years",
    image: "/nursery.png",
    description:
      "Fostering curiosity, foundational skills, and a love for learning in a nurturing environment.",
    path: "/academics/nursery",
  },
  {
    title: "Primary School",
    age: "5 – 11 years",
    image: "/pri.png",
    description:
      "A well-rounded education that builds strong academics, creativity, and character.",
    path: "/academics/primary",
  },
  {
    title: "High School",
    age: "11 – 17 years",
    image: "/high.jpg",
    description:
      "A rigorous curriculum that develops critical thinking, independence, and leadership.",
    path: "/academics/secondary",
  },
  {
    title: "Sixth Form College",
    age: "17+ years",
    image: "/six.png",
    description:
      "Advanced programmes and tailored support that prepare students for university and beyond.",
    path: "/academics/sixth-form",
  },
];

export default function Programmes() {
  return (
    <section className="bg-gray-50 py-20">
      <div className="container mx-auto px-6">
        {/* Heading */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <p className="uppercase tracking-widest text-sm mb-3">Explore</p>
          <h2 className="text-4xl md:text-5xl font-semibold mb-4">
            Our Programmes
          </h2>
          <div className="w-16 h-1 bg-gold mx-auto mb-6" />
          <p className="text-gray-600 text-lg">
            From early years to Sixth Form, each stage builds confidence,
            character, and competence.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {programmes.map((programme, index) => (
            <Link
              key={index}
              to={programme.path}
              className="group bg-white rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden"
            >
              {/* Image */}
              <div className="relative">
                <img
                  src={programme.image}
                  alt={programme.title}
                  className="h-56 w-full object-cover group-hover:scale-105 transition-transform duration-500"
                />

                {/* Age Badge */}
                <span className="absolute top-4 left-4 bg-white text-sm px-4 py-1 rounded-full shadow">
                  {programme.age}
                </span>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-3">
                  {programme.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {programme.description}
                </p>

                <div className="mt-6 font-semibold text-primary group-hover:underline">
                  Learn More →
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
