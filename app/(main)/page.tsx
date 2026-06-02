import AboutSection from "@/components/home/AboutOurTours";
import FeaturedTours from "@/components/home/FeaturedTours";
import HeroSection from "@/components/home/HeroSection";
import HowItWorks from "@/components/home/HowItWorks";
import HeroParalax from "@/components/home/HeroParalax";
import TopGuides from "@/components/home/TopGuides";
import Reviews from "@/components/home/Review";
import Faq from "@/components/home/Faq";

export default function Homepage() {
  return (
    <div>
      <HeroSection />
      <FeaturedTours />
      <HowItWorks />
      <AboutSection />
      <TopGuides />
      <HeroParalax />
      <Reviews />
      <Faq />
    </div>
  );
}
