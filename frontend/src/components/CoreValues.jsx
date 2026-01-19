export default function CoreValues() {
  return (
    <section className="relative bg-[#f2fbf8] py-32 overflow-hidden">
      {/* Heading */}
      <div className="text-center mb-20">
        <p className="text-sm tracking-widest text-gray-800 uppercase mb-6">
          Our Core Values
        </p>
        <h2 className="text-4xl md:text-5xl font-medium text-purple-700">
          What We Stand For
        </h2>
      </div>

      {/* Moving strip */}
      <div className="relative overflow-hidden">
        <div className="mx-auto max-w-5xl">
          <div className="bg-white/60 backdrop-blur-md rounded-xl py-8 shadow-sm overflow-hidden">
            <div
              className="flex w-max"
              style={{
                animation: "marquee 30s linear infinite",
              }}
            >
              {[
                "GRIT",
                "INNOVATION",
                "DISCIPLINE",
                "EXCELLENCE",
                "GRIT",
                "INNOVATION",
                "DISCIPLINE",
                "EXCELLENCE",
              ].map((item, i) => (
                <span
                  key={i}
                  className="flex items-center text-2xl md:text-3xl font-semibold tracking-[0.3em] text-purple-700 whitespace-nowrap mx-10"
                >
                  {item}
                  <span className="mx-8 text-purple-400 opacity-60">•</span>
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Inline keyframes */}
      <style>
        {`
          @keyframes marquee {
            0% {
              transform: translateX(0%);
            }
            100% {
              transform: translateX(-50%);
            }
          }
        `}
      </style>
    </section>
  );
}
