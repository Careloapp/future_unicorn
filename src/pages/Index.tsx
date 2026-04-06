import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import PainBar from "@/components/PainBar";
import HowItWorks from "@/components/HowItWorks";
import MeetMirrinVoice from "@/components/MeetMirrinVoice";
import Industries from "@/components/Industries";
import Proof from "@/components/Proof";
import Pricing from "@/components/Pricing";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--bg-base)" }}>
      <div className="grain-overlay" />
      <Navbar />
      <HeroSection />
      <PainBar />
      <HowItWorks />
      <MeetMirrinVoice />
      <Industries />
      <Proof />
      <Pricing />
      <Contact />
      <Footer />
    </div>
  );
};

export default Index;
