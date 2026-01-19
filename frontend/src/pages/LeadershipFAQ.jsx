import LeadershipSection from "../components/LeadershipSection";

export default function LeadershipFAQ() {
    const scrollTo = (id) => {
        document.getElementById(id)?.scrollIntoView({
            behavior: "smooth",
        });
    };

    return (
        <main className="bg-white">
            {/* HERO */}
            <section className="relative bg-gradient-to-r from-purple-800 via-purple-700 to-yellow-700 text-white py-28 px-6">
                <div className="max-w-6xl mx-auto text-center">
                    <h1 className="text-5xl md:text-6xl font-serif font-bold mb-4">
                        Leadership & FAQ
                    </h1>

                    <p className="opacity-90 mb-12">
                        Home &nbsp;›&nbsp; About Us &nbsp;›&nbsp; Leadership & FAQ
                    </p>

                    <div className="flex flex-wrap justify-center gap-6">
                        <button
                            onClick={() => scrollTo("leadership")}
                            className="bg-yellow-500 hover:bg-yellow-400 transition px-8 py-4 rounded-full font-semibold text-white"
                        >
                            Our Leadership Team
                        </button>

                        <button
                            onClick={() => scrollTo("faq")}
                            className="bg-yellow-500 hover:bg-yellow-400 transition px-8 py-4 rounded-full font-semibold text-white"
                        >
                            Frequently Asked Questions
                        </button>
                    </div>
                </div>
            </section>

            {/* LEADERSHIP */}
            <section
                id="leadership"
                className="max-w-7xl mx-auto px-6 py-10 grid lg:grid-cols-2 gap-20 items-center"
            >
                {/* Image */}
                <div className="relative">
                    <img
                        src="/director.jpg"
                        alt="Director"
                        className="rounded-3xl shadow-xl w-full object-cover"
                    />

                    <span className="absolute bottom-6 left-6 bg-yellow-500 text-black px-5 py-2 rounded-full font-semibold text-sm">
                        Director
                    </span>
                </div>

                {/* Text */}
                <div>
                    <p className="tracking-widest text-sm text-gray-600 uppercase mb-4">
                        Welcome From The Director
                    </p>

                    <h2 className="text-4xl md:text-5xl font-medium text-purple-700 mb-8 leading-tight">
                        Welcome to Royal Family Academy
                    </h2>

                    <div className="space-y-6 text-gray-700 text-lg leading-relaxed">
                        <p>
                            Welcome and thank you for your interest in Royal Family Academy. I
                            am grateful you are considering partnering with us for the
                            education of your child/children. We look forward to working with
                            you each step of the way!
                        </p>

                        <p>
                            Royal Family Academy is a Christian school that provides an
                            individualistic and nurturing learning environment where learners
                            can receive holistic instruction in a serene environment.
                        </p>

                        <p>
                            Our qualified teachers and staff are trained to ensure that each
                            pupil/student is nurtured to excel academically, spiritually, and
                            socially.
                        </p>
                    </div>
                </div>
            </section>

            <LeadershipSection />

            {/* FAQ */}
            <section
                id="faq"
                className="bg-[#faf7f2] py-28 px-6"
            >
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-4xl font-medium text-purple-700 text-center mb-16">
                        Frequently Asked Questions
                    </h2>

                    <div className="space-y-6">
                        {[
                            {
                                q: "Is Royal Family Academy a Christian school?",
                                a: "Yes. RFA is a Christian school committed to biblical values, character development, and academic excellence.",
                            },
                            {
                                q: "What classes and levels do you offer?",
                                a: "We offer Nursery, Primary, High School, and Sixth Form College programmes.",
                            },
                            {
                                q: "How do I apply or enrol?",
                                a: "You can apply online via our Apply / Enrol Now button or contact our admissions office directly.",
                            },
                            {
                                q: "Do you offer extracurricular activities?",
                                a: "Yes. We offer sports, arts, leadership programmes, clubs, and spiritual formation activities.",
                            },
                        ].map((item, index) => (
                            <details
                                key={index}
                                className="bg-white rounded-2xl shadow-md p-6 cursor-pointer"
                            >
                                <summary className="font-semibold text-lg text-purple-700">
                                    {item.q}
                                </summary>
                                <p className="mt-4 text-gray-700 leading-relaxed">
                                    {item.a}
                                </p>
                            </details>
                        ))}
                    </div>
                </div>
            </section>
        </main>
    );
}
