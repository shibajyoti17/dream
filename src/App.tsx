import { CatApiSection } from "./components/CatApiSection";
import { DailyWhisker } from "./components/DailyWhisker";
import { Footer } from "./components/Footer";
import { Hero } from "./components/Hero";
import { MemoryTimeline } from "./components/MemoryTimeline";
import { VaultGate } from "./components/VaultGate";
export default function App() {
  return (
    <VaultGate>
      <>
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <main id="main">
          <Hero />
          <CatApiSection />
          <DailyWhisker />
          <MemoryTimeline />
        </main>
        <Footer />
      </>
    </VaultGate>
  );
}
