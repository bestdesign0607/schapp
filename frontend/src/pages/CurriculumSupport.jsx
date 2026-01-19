export default function CurriculumSupport() {
    const scrollTo = (id) => {
        document.getElementById(id)?.scrollIntoView({
            behavior: "smooth",
        });
    };

    return (
        <main className="bg-[#faf7f2]">
            {/* HERO */}
            <section className="relative bg-gradient-to-r from-purple-900 via-purple-700 to-yellow-700 text-white py-28 px-6">
                <div className="max-w-6xl mx-auto text-center">
                    <h1 className="text-5xl md:text-6xl font-bold mb-4">
                        Curriculum & Learning
                    </h1>
                    <p className="text-sm opacity-90">
                        Home &nbsp;›&nbsp; Academics &nbsp;›&nbsp; Curriculum & Learning
                    </p>

                    {/* Pills */}
                    <div className="flex flex-wrap justify-center gap-4 mt-10">
                        {[
                            ["SEND / Discovery Centre", "send"],
                            ["Spiritual Formation", "spiritual"],
                            ["Chaplaincy", "chaplaincy"],
                            ["Leadership Curriculum", "leadership"],
                            ["RFA e-Library", "library"],
                            ["Curricular Activities", "curricular"],
                        ].map(([label, id]) => (
                            <button
                                key={id}
                                onClick={() => scrollTo(id)}
                                className="bg-yellow-600 hover:bg-yellow-500 transition px-6 py-3 rounded-full font-semibold"
                            >
                                {label}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* CONTENT */}
            <section className="max-w-6xl mx-auto px-6 py-20 space-y-24">
                {/* SEND */}
                <div id="send">
                    <h2 className="text-3xl font-bold mb-4">
                        Special Education Needs (SEND) — Discovery Centre
                    </h2>
                    <p className="text-lg mb-6">
                        Inclusive, individualized support so every learner can thrive.
                    </p>
                    <p className="mb-6">
                        Our Discovery Centre serves pupils/students whose challenges interfere
                        with learning—providing advanced support beyond the general curriculum.
                    </p>

                    <h4 className="font-semibold mb-2">Approaches & Services</h4>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>Speech & language development</li>
                        <li>Autism management & strategies</li>
                        <li>IEP design, assessment & evaluation</li>
                        <li>Parental support & counselling</li>
                        <li>Occupational therapy & daily living skills</li>
                        <li>
                            Individualized learning, resource room, one-on-one support & learning aids
                        </li>
                        <li>
                            NILD Educational Therapy (licensed): addressing underlying causes of learning
                            difficulties and building independent learning tools
                        </li>
                    </ul>
                </div>

                {/* SPIRITUAL FORMATION */}
                <div id="spiritual">
                    <h2 className="text-3xl font-bold mb-4">Spiritual Formation</h2>
                    <p className="mb-6">
                        Bible-centred formation woven into everyday school life.
                    </p>
                    <p className="mb-6">
                        Daily devotion, Bible study, Chapel, whole-school fasting and
                        Discipleship Training shape our learners. Weekly gatherings include
                        prayer, praise, worship and the Word.
                    </p>
                    <p>
                        High School Mentorship Groups (teacher-led) create safe spaces for
                        reflection and growth. Participation in curricular, co-curricular,
                        and spiritual formation activities is expected of all students.
                    </p>
                </div>

                {/* CHAPLAINCY */}
                <div id="chaplaincy">
                    <h2 className="text-3xl font-bold mb-4">The Chaplaincy</h2>
                    <p className="mb-6">
                        Stewarding Christian values and spiritual atmosphere across the school.
                    </p>
                    <p className="mb-6">
                        The Chaplain works with section heads and reports to the Director,
                        coordinating spiritual programmes to promote Christian virtues and values.
                    </p>

                    <h4 className="font-semibold mb-2">What the Chaplaincy Coordinates</h4>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>Chapel activities & personal devotion</li>
                        <li>Outreaches / missionary activities</li>
                        <li>Parenting Institute & prayer meetings</li>
                        <li>Discipleship training</li>
                        <li>Leadership & mentorship programmes</li>
                    </ul>

                    <p className="mt-4">
                        These programmes are statutory for maintaining the school’s spiritual atmosphere.
                    </p>
                </div>

                {/* LEADERSHIP */}
                <div id="leadership">
                    <h2 className="text-3xl font-bold mb-4">RFA Leadership Curriculum</h2>
                    <p>
                        Developing distinguished leaders with integrity, critical thinking and service.
                    </p>
                    <p className="mt-4">
                        As a Christian leadership school, RFA equips learners through structured
                        leadership courses and well-planned activities that prepare them for school,
                        career and life.
                    </p>
                </div>

                {/* LIBRARY */}
                <div id="library">
                    <h2 className="text-3xl font-bold mb-4">RFA e-Library</h2>
                    <p className="mb-4">
                        Anytime, anywhere access to safe, relevant learning content.
                    </p>
                    <p>
                        The e-Library hosts books, magazines and video resources in digital form,
                        enabling remote access beyond the classroom. A key resource is Scholastic
                        Literacy Pro for literacy development at every level. Students receive
                        secure logins for tailored materials.
                    </p>
                </div>

                {/* CURRICULAR */}
                {/* CURRICULAR */}
                <div id="curricular">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold mb-4">Curricular Activities</h2>
                        <p className="text-gray-600">
                            Core subjects by school section.
                        </p>
                    </div>

                    <div className="grid gap-10 md:grid-cols-2">
                        {/* Nursery */}
                        <div className="bg-white rounded-2xl border shadow-sm p-8">
                            <h4 className="text-xl font-semibold mb-4">Nursery</h4>
                            <ul className="list-disc pl-5 space-y-3 text-gray-700">
                                <li>Literacy & Numeracy</li>
                                <li>General Knowledge & Science</li>
                                <li>Bible Studies & Rhymes</li>
                                <li>Music & Fine Arts</li>
                                <li>Nigerian Languages (intro)</li>
                                <li>Physical & Health Education</li>
                            </ul>
                        </div>

                        {/* Primary */}
                        <div className="bg-white rounded-2xl border shadow-sm p-8">
                            <h4 className="text-xl font-semibold mb-4">Primary</h4>
                            <ul className="list-disc pl-5 space-y-3 text-gray-700">
                                <li>Literacy, Numeracy & English Studies</li>
                                <li>Science & Social Studies / Civic Education</li>
                                <li>Bible Studies & Christian Religious Studies</li>
                                <li>ICT & Nigerian Languages</li>
                                <li>
                                    French, <em>Spanish (Grade 1 & 2)</em>
                                </li>
                                <li>Music, Fine Arts & Physical Education</li>
                            </ul>
                        </div>

                        {/* High School Junior */}
                        <div className="bg-white rounded-2xl border shadow-sm p-8">
                            <h4 className="text-xl font-semibold mb-4">
                                High School (Junior)
                            </h4>
                            <ul className="list-disc pl-5 space-y-3 text-gray-700">
                                <li>English Language & Mathematics</li>
                                <li>Basic Science & Basic Technology</li>
                                <li>Business Studies & ICT</li>
                                <li>Social Studies & Civic Education</li>
                                <li>Christian Religious Studies & Agricultural Science</li>
                                <li>Arts, Nigerian Languages & French</li>
                                <li>History & Physical Education</li>
                            </ul>
                        </div>

                        {/* High School Senior */}
                        <div className="bg-white rounded-2xl border shadow-sm p-8">
                            <h4 className="text-xl font-semibold mb-4">
                                High School (Senior)
                            </h4>
                            <ul className="list-disc pl-5 space-y-3 text-gray-700">
                                <li>English Language & Literature-in-English</li>
                                <li>General & Further Mathematics</li>
                                <li>Biology, Chemistry, Physics & Technical Drawing</li>
                                <li>Geography, Government & Economics</li>
                                <li>Accounting & Commerce</li>
                                <li>ICT, Nigerian Languages, French & Mandarin</li>
                                <li>
                                    Trade / Entrepreneurship (Fishery, Dyeing & Bleaching,
                                    Bricklaying)
                                </li>
                            </ul>
                        </div>
                    </div>

                    <p className="text-center text-gray-600 mt-10 italic">
                        Detailed subject handbooks are available for Primary and High School.
                    </p>
                </div>

            </section>
        </main>
    );
}
