import Navbar from "../components/landing/Navbar";
import Hero from "../components/landing/Hero";
import Features from "../components/landing/Features";
import WhyFounderOS from "../components/landing/WhyFounderOS";
import Pricing from "../components/landing/Pricing";
import Testimonials from "../components/landing/Testimonials";
import CTA from "../components/landing/CTA";
import Footer from "../components/landing/Footer";

export default function Landing() {
  return (
    <main className="bg-[var(--bg)] text-[var(--text)] overflow-x-hidden">
      <Navbar />

      <Hero />

      <Features />

      <WhyFounderOS />

      <Pricing />

      <Testimonials />

      <CTA />

      <Footer />
    </main>
  );
}
