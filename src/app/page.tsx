import { BestSellerSection } from "@/components/home/best-seller-section";
import { BrandPromiseStrip } from "@/components/home/brand-promise-strip";
import { CommunityStrip } from "@/components/home/community-strip";
import { HeroCategoryGrid } from "@/components/home/hero-category-grid";
import { HeroPromoSlider } from "@/components/home/hero-promo-slider";
import { NewArrivals } from "@/components/home/new-arrivals";
import { RoutineBanner } from "@/components/home/routine-banner";
import { ShopByConcern } from "@/components/home/shop-by-concern";
import { SocialProof } from "@/components/home/social-proof";

export default function HomePage() {
  return (
    <main>
      <HeroPromoSlider />
      <HeroCategoryGrid />
      <BestSellerSection />
      <BrandPromiseStrip />
      <ShopByConcern />
      <NewArrivals />
      <RoutineBanner />
      <SocialProof />
      <CommunityStrip />
    </main>
  );
}
