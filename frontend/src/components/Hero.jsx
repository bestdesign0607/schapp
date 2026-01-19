import { useEffect, useState } from "react";

const slides = [
  {
    image: "/sts.jpg",
    title: "Raising Distinguished Leaders",
    subtitle:
      "From Nursery to Sixth Form, we nurture curious minds, strong values, and lifelong confidence.",
  },
  {
    image: "/sts1.jpg",
    title: "Nurturing Godly Character",
    subtitle:
      "A Christ-centered education that builds excellence and purpose.",
  },
  {
    image: "/sts2.jpg",
    title: "Academic Excellence & Discipline",
    subtitle:
      "Preparing students for global opportunities and leadership.",
  },
];

export default function Hero() {
  const [current, setCurrent] = useState(0);
  const [animate, setAnimate] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimate(false);
      setTimeout(() => {
        setCurrent((prev) => (prev + 1) % slides.length);
        setAnimate(true);
      }, 300);
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative h-screen w-full overflow-hidden">
      {/* Background Slides */}
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ${
            index === current ? "opacity-100" : "opacity-0"
          }`}
          style={{ backgroundImage: `url(${slide.image})` }}
        >
          <div className="absolute inset-0 bg-black/50" />
        </div>
      ))}

      {/* Content */}
      <div className="relative z-10 flex h-full items-center justify-center text-center md:text-left">
        <div className="container mx-auto px-6 md:px-12 max-w-4xl">
          <div
            className={`text-white transition-all duration-700 ${
              animate
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-6"
            }`}
          >
            <p className="uppercase tracking-widest text-sm mb-4 text-gray-200">
              Nurturing Godly Character & Excellence
            </p>

            <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
              {slides[current].title}
            </h1>

            <p className="text-lg md:text-xl text-gray-200 mb-10">
              {slides[current].subtitle}
            </p>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4">
              <button className="group relative overflow-hidden bg-gold text-black px-8 py-3 rounded-full font-semibold transition-transform duration-300 hover:scale-105">
                <span className="relative z-10 bg-gray-800 text-white px-8 py-8 rounded-md">Apply Now</span>
                <span className="absolute inset-0 bg-yellow-400 opacity-0 group-hover:opacity-30 transition" />
              </button>

              <button className="group relative overflow-hidden bg-white text-primary px-8 py-3 rounded-full font-semibold transition-transform duration-300 hover:scale-105">
                <span className="relative z-10 text-gray-800">Book a Campus Visit</span>
                <span className="absolute inset-0 bg-gray-200 opacity-0 group-hover:opacity-40 transition" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
