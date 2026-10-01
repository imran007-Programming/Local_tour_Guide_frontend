import AboutSection from "@/components/home/AboutOurTours";
import FeaturedDestinations from "@/components/home/FeaturedDestinations";
import FeaturedTours from "@/components/home/FeaturedTours";
import HeroSection from "@/components/home/HeroSection";
import PlanTrip from "@/components/home/PlanTrip";
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

  const cities = [...new Set(tours.map((t) => t.city).filter(Boolean))];

  return (
    // The giant watermark words may be wider than small screens
    <div className="overflow-x-clip">
      <HeroSection categories={categories} />
      <ClientsMarquee />
      <FeaturedDestinations tours={tours} />
      <FeaturedTours tours={tours} />
      <PlanTrip categories={categories} cities={cities} />
      <AboutSection />
      <TopGuides guides={guides} />
      <Reviews reviews={reviews.slice(0, 6)} />
      <Faq />
      <CtaSection />
    </div>
  );
}
