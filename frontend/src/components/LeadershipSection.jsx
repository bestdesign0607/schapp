import { useRef } from "react";

const leaders = [
  {
    name: "Dr. Ogundeyi Bickath",
    role: "Director",
    image: "/dr.png",
  },
  {
    name: "Ms. Aiyeni Olubunmi",
    role: "Head of School",
    image: "/ayeni.png",
  },
  {
    name: "Ms. Nwawui Pertha",
    role: "Academic Lead",
    image: "/bertha.png",
  },
  {
    name: "Mr. Onuoha Lotty",
    role: "Administrator",
    image: "/onuoha.png",
  },
];

export default function LeadershipSection() {
  const sliderRef = useRef(null);

  const scroll = (direction) => {
    sliderRef.current.scrollBy({
      left: direction === "left" ? -320 : 320,
      behavior: "smooth",
    });
  };

  return (
    <section className="bg-white py-32">
      {/* Header */}
      <div className="text-center mb-16">
        <p className="text-sm tracking-widest uppercase text-gray-700 mb-4">
          Our Leadership
        </p>
        <h2 className="text-4xl md:text-5xl font-medium text-purple-700">
          Guided by Experience & Character
        </h2>
      </div>

      {/* Slider */}
      <div className="relative max-w-7xl mx-auto px-6">
        {/* Left Arrow */}
        <button
          onClick={() => scroll("left")}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white border rounded-full p-3 shadow hover:bg-gray-50"
        >
          ◀
        </button>

        {/* Cards */}
        <div
          ref={sliderRef}
          className="flex gap-8 overflow-x-auto scroll-smooth scrollbar-hide px-10"
        >
          {leaders.map((leader, index) => (
            <div
              key={index}
              className="min-w-[260px] bg-white rounded-3xl border border-yellow-200 p-3"
            >
              <img
                src={leader.image}
                alt={leader.name}
                className="w-full h-[340px] object-cover rounded-2xl"
              />

              <div className="text-center mt-4">
                <h4 className="font-semibold text-gray-900">
                  {leader.name}
                </h4>
                <p className="text-sm text-gray-600">
                  {leader.role}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Right Arrow */}
        <button
          onClick={() => scroll("right")}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white border rounded-full p-3 shadow hover:bg-gray-50"
        >
          ▶
        </button>
      </div>
    </section>
  );
}
