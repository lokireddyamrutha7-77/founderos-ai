import HeroContent from "./HeroContent";
import Dashboard from "./Dashboard";
import FeaturePanel from "./FeaturePanel";

export default function Hero() {
  return (
    <section className="max-w-[1400px] mx-auto px-6 pt-4 pb-6">
      <div className="grid lg:grid-cols-12 gap-6 items-center">

        <div className="lg:col-span-4">
          <HeroContent />
        </div>

        <div className="lg:col-span-5 flex justify-center">
          <Dashboard />
        </div>

        <div className="lg:col-span-3 flex justify-center">
          <FeaturePanel />
        </div>

      </div>
    </section>
  );
}