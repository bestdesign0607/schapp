import { useState, useEffect } from "react";

const testimonials = [
  {
    name: "Jane Okafor",
    role: "Parent",
    level: "Primary",
    image: "/jane.jpg",
    text:
      "RFA nurtures character and curiosity. Our child’s confidence and grades have soared, and the spiritual formation has been truly impactful. The teachers are attentive, the environment is safe, and the curriculum balances academics with faith.",
  },
  {
    name: "Samuel Johnson",
    role: "Student",
    level: "High School",
    image: "/chibu.jpg",
    text:
      "RFA has helped me grow academically and spiritually. The leadership programmes, clubs, and mentorship have shaped my confidence and vision for the future. I feel prepared for university and beyond.",
  },
  {
    name: "Mrs. Bello",
    role: "Parent",
    level: "Nursery",
    image: "/michel.jpg",
    text:
      "The teachers are caring, intentional, and spiritually grounded. My child loves school and looks forward to learning every day. The nurturing environment has made a huge difference in early development.",
  },

];

export default function TestimonialsSection() {
  const [index, setIndex] = useState(0);
  const [expanded, setExpanded] = useState(false);

  // Auto slide
  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % testimonials.length);
      setExpanded(false);
    }, 6000);

    return () => clearInterval(timer);
  }, []);

  const prev = () => {
    setIndex((index - 1 + testimonials.length) % testimonials.length);
    setExpanded(false);
  };

  const next = () => {
    setIndex((index + 1) % testimonials.length);
    setExpanded(false);
  };

  const item = testimonials[index];

  const shortText =
    item.text.length > 120
      ? item.text.slice(0, 120) + "..."
      : item.text;

  return (
    <section className="bg-[#f7f4fa] py-32 px-6">
      {/* Header */}
      <div className="text-center mb-20">
        <p className="text-sm tracking-widest uppercase text-gray-700 mb-4">
          Testimonials
        </p>
        <h2 className="text-4xl md:text-5xl font-medium text-purple-700 mb-4">
          What Our Community Says
        </h2>
        <p className="text-gray-600">
          Parents, students, and alumni share their RFA journey.
        </p>
      </div>

      {/* Carousel */}
      <div className="relative max-w-4xl mx-auto text-center">
        {/* Left Arrow */}
        <button
          onClick={prev}
          className="absolute left-0 top-1/2 -translate-y-1/2 text-purple-700 text-4xl hover:opacity-70"
        >
          ‹
        </button>

        {/* Content */}
        <div className="px-12 transition-all duration-500">
          <img
            src={item.image}
            alt={item.name}
            className="w-24 h-24 rounded-full object-cover mx-auto mb-6"
          />

          <h4 className="text-xl font-semibold mb-2">
            {item.name}
          </h4>

          <div className="flex justify-center items-center gap-2 mb-6">
            <span className="px-3 py-1 rounded-full border border-purple-300 text-purple-700 text-sm font-medium">
              {item.role}
            </span>
            <span className="text-gray-500">• {item.level}</span>
          </div>

          <p className="text-lg text-gray-800 max-w-2xl mx-auto mb-8">
            {expanded ? item.text : shortText}
          </p>

          <button
            onClick={() => setExpanded(!expanded)}
            className="border border-purple-400 text-purple-700 px-6 py-3 rounded-full font-semibold hover:bg-purple-50 transition"
          >
            {expanded ? "LESS" : "READ FULL"}
          </button>
        </div>

        {/* Right Arrow */}
        <button
          onClick={next}
          className="absolute right-0 top-1/2 -translate-y-1/2 text-purple-700 text-4xl hover:opacity-70"
        >
          ›
        </button>
      </div>
    </section>
  );
}
