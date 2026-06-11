import { BestSellerSection } from "@/components/home/best-seller-section";
import { BrandPromiseStrip } from "@/components/home/brand-promise-strip";
import { CommunityStrip } from "@/components/home/community-strip";
import { HeroCategoryGrid } from "@/components/home/hero-category-grid";
import { HeroPromoSlider } from "@/components/home/hero-promo-slider";
import { NewArrivals } from "@/components/home/new-arrivals";
import { RoutineBanner } from "@/components/home/routine-banner";
import { ShopByConcern } from "@/components/home/shop-by-concern";
import { SocialProof } from "@/components/home/social-proof";
import { getPublicCategories } from "@/features/public/api";
import type { Category } from "@/lib/admin-types";

export default async function HomePage() {
  let categories: Category[] = [];
  try {
    categories = await getPublicCategories();
  } catch {
    categories = [];
  }

  return (
    <main>
      <HeroPromoSlider />
      <HeroCategoryGrid categories={categories} />
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
