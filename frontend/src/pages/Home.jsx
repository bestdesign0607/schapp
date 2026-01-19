import CoreValues from "../components/CoreValues";
import Hero from "../components/Hero";
import LeadershipSection from "../components/LeadershipSection";
import NewsEventsSection from "../components/NewsEventsSection";
import Offerings from "../components/Offerings";
import Programmes from "../components/Programmes";
import TestimonialsSection from "../components/TestimonialsSection";

export default function Home() {
  return (
    <>
      <Hero />
      <Programmes />
      <Offerings />
      <CoreValues />
      <LeadershipSection />
      <TestimonialsSection />
      <NewsEventsSection />
    </>
  );
}
