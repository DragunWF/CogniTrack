import { HeroSection } from "./components/HeroSection";
import { ProblemStatement } from "./components/ProblemStatement";
import { CoreConcept } from "./components/CoreConcept";
import { FeaturesGrid } from "./components/FeaturesGrid";
import { HowItWorks } from "./components/HowItWorks";
import { AIShowcase } from "./components/AIShowcase";
import { TechStack } from "./components/TechStack";
import { AccessSection } from "./components/AccessSection";
import { Footer } from "./components/Footer";
import "./App.css";

function App() {
  return (
    <div className="app">
      <HeroSection />
      <ProblemStatement />
      <CoreConcept />
      <FeaturesGrid />
      <HowItWorks />
      <AIShowcase />
      <TechStack />
      <AccessSection />
      <Footer />
    </div>
  );
}

export default App;
