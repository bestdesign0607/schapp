import { useState } from "react";

const posts = [
  {
    id: 1,
    category: "NEWS",
    tag: "Academics",
    date: "18 May 2025",
    title: "RFA Wins Regional Science Fair",
    excerpt:
      "Our students showcased innovation, teamwork, and grit—earning top honors among leading schools.",
    image: "/stud.jpg",
    instagramUrl: "https://www.instagram.com/yourpage/post1",
  },
  {
    id: 2,
    category: "NEWS",
    tag: "Campus",
    date: "29 Apr 2025",
    title: "New Library Wing Opens",
    excerpt:
      "A modern space for reading, research, and group study—built to inspire curiosity and focus.",
    image: "/gen.png",
    instagramUrl: "https://www.instagram.com/yourpage/post2",
  },
  {
    id: 3,
    category: "EVENTS",
    tag: "Co-curricular",
    date: "14 Mar 2025",
    title: "Arts & Sports Showcase",
    excerpt:
      "From orchestra to athletics—students demonstrated discipline, creativity, and joy.",
    image: "/ma.jpg",
    instagramUrl: "https://www.instagram.com/yourpage/post3",
  },
];

export default function NewsEventsSection() {
  const [activeTab, setActiveTab] = useState("NEWS");

  const filteredPosts = posts.filter(
    (post) => post.category === activeTab
  );

  return (
    <section className="py-28 px-6 bg-white">
      {/* Tabs */}
      <div className="flex justify-center gap-4 mb-16">
        {["NEWS", "EVENTS"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-8 py-3 rounded-full font-semibold border transition
              ${
                activeTab === tab
                  ? "border-purple-600 text-purple-700 bg-purple-50"
                  : "border-purple-200 text-purple-500 hover:bg-purple-50"
              }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Cards */}
      <div className="grid md:grid-cols-3 gap-10 max-w-7xl mx-auto">
        {filteredPosts.map((post) => (
          <a
            key={post.id}
            href={post.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group border border-purple-200 rounded-3xl overflow-hidden hover:shadow-xl transition"
          >
            {/* Image */}
            <img
              src={post.image}
              alt={post.title}
              className="w-full h-56 object-cover"
            />

            {/* Content */}
            <div className="p-8">
              <div className="flex items-center gap-3 mb-4">
                <span className="px-3 py-1 rounded-full border border-purple-300 text-purple-700 text-sm font-medium">
                  {post.tag}
                </span>
                <span className="text-gray-500 text-sm">{post.date}</span>
              </div>

              <h3 className="text-2xl font-semibold mb-4 text-gray-900 group-hover:text-purple-700 transition">
                {post.title}
              </h3>

              <p className="text-gray-700 mb-6">
                {post.excerpt}
              </p>

              <span className="text-purple-700 font-semibold inline-flex items-center gap-2">
                Read more on Instagram →
              </span>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
