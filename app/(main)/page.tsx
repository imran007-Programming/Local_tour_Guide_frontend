import AboutSection from "@/components/home/AboutOurTours";
import FeaturedTours from "@/components/home/FeaturedTours";
import HeroSection from "@/components/home/HeroSection";
import HowItWorks from "@/components/home/HowItWorks";
import ClientsMarquee from "@/components/home/HeroMarquee";
import TopGuides from "@/components/home/TopGuides";
import Reviews from "@/components/home/Review";
import Faq from "@/components/home/Faq";
import CtaSection from "@/components/home/CtaSection";
import { getGuides, getLatestTours, getReviews, getTourCategories } from "@/lib/publicApi";

// Rebuild the cached page in the background at most every 5 minutes
export const revalidate = 300;

export default async function Homepage() {
  const [tours, guides, reviews, categories] = await Promise.all([
    getLatestTours(6),
    getGuides(),
    getReviews(),
    getTourCategories(),
  ]);

  return (
    <div>
      <HeroSection categories={categories} />
      <ClientsMarquee />
      <FeaturedTours tours={tours} />
      <HowItWorks />
      <AboutSection />
      <TopGuides guides={guides} />
      <Reviews reviews={reviews.slice(0, 6)} />
      <Faq />
      <CtaSection />
    </div>
  );
}
