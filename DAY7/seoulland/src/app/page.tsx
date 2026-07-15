import Header from "@/components/layout/Header";
import SideNav from "@/components/layout/SideNav";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/sections/HeroSection";
import CompanionSection from "@/components/sections/CompanionSection";
import BenefitsSection from "@/components/sections/BenefitsSection";
import WelcomeCartSection from "@/components/sections/WelcomeCartSection";
import AttractionsSection from "@/components/sections/AttractionsSection";
import PerformanceSection from "@/components/sections/PerformanceSection";
import RiverDivider from "@/components/sections/RiverDivider";
import SnsSection from "@/components/sections/SnsSection";
import NoticeSection from "@/components/sections/NoticeSection";

export default function Home() {
  return (
    <div id="top" className="relative flex flex-1 flex-col">
      <Header />
      <SideNav />

      <main className="flex flex-1 flex-col">
        <HeroSection />
        <CompanionSection />
        <BenefitsSection />
        <WelcomeCartSection />
        <AttractionsSection />
        <PerformanceSection />
        <RiverDivider />
        <SnsSection />
        <NoticeSection />
      </main>

      <Footer />
    </div>
  );
}
