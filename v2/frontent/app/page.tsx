import { TopBar } from "@/components/top-bar"
import { Header } from "@/components/header"
import { HeroSlider } from "@/components/hero-slider"
import { CategoryIcons } from "@/components/category-icons"
import { ProductSection } from "@/components/product-section"
import { BlogSection } from "@/components/blog-section"
import { Footer } from "@/components/footer"
import { PromoBanner } from "@/components/promo-banner"
import { ScrollSqueezeSection } from "@/components/scroll-squeeze-section"
import {
  getFeaturedProducts,
  getNewProducts,
  getBestSellers,
  getPromoCategories,
  getBanners,
  getCategories,
} from "@/services/api"
import { getServicePages } from "@/services/api/analyticsApi"

export default async function HomePage() {
  let featuredProducts: Awaited<ReturnType<typeof getFeaturedProducts>> = []
  let newProducts: Awaited<ReturnType<typeof getNewProducts>> = []
  let promoCategories: Awaited<ReturnType<typeof getPromoCategories>> = []
  let banners: Awaited<ReturnType<typeof getBanners>> = []
  let bestSellers: Awaited<ReturnType<typeof getBestSellers>> = []
  let servicePages: Awaited<ReturnType<typeof getServicePages>> = []
  let categories: Awaited<ReturnType<typeof getCategories>> = []

  try {
    const [featured, newP, best, promo, bannerList, services, cats] = await Promise.all([
      getFeaturedProducts(),
      getNewProducts(),
      getBestSellers(),
      getPromoCategories(),
      getBanners(),
      getServicePages(),
      getCategories(),
    ])
    featuredProducts = featured
    newProducts = newP
    bestSellers = best
    promoCategories = promo
    banners = bannerList
    servicePages = services
    categories = cats
  } catch {
    // fallbacks already []
  }

  return (
    <div className="min-h-screen bg-transparent transition-colors duration-500">
      <TopBar />
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <ScrollSqueezeSection noSqueeze className="mt-4 sm:mt-6">
          <HeroSlider banners={banners} />
        </ScrollSqueezeSection>

        <ScrollSqueezeSection className="mt-6 sm:mt-8">
          <PromoBanner items={promoCategories} />
        </ScrollSqueezeSection>

        <ScrollSqueezeSection id="kategoriyalar" className="mt-8 sm:mt-10">
          <h2
            className="text-xl sm:text-2xl font-bold text-foreground mb-4 sm:mb-6"
            style={{ fontFamily: "var(--font-apple)" }}
          >
            Bo&apos;limlar
          </h2>
          <CategoryIcons initialCategories={categories} />
        </ScrollSqueezeSection>

        <ScrollSqueezeSection className="mt-8 sm:mt-12">
          <ProductSection
            title="XIT mahsulotlar"
            products={featuredProducts}
            viewAllLink="/catalog/xit-savdo"
          />
        </ScrollSqueezeSection>

        <ScrollSqueezeSection className="mt-8 sm:mt-12">
          <ProductSection
            title="Yangi mahsulotlar"
            products={newProducts}
            viewAllLink="/catalog/yangi-mahsulotlar"
          />
        </ScrollSqueezeSection>

        {bestSellers.length > 0 && (
          <ScrollSqueezeSection className="mt-8 sm:mt-12">
            <ProductSection
              title="Eng ko'p sotilganlar"
              products={bestSellers}
              viewAllLink="/catalog"
            />
          </ScrollSqueezeSection>
        )}

        <ScrollSqueezeSection className="mt-8 sm:mt-12 mb-6 sm:mb-8">
          <BlogSection services={servicePages} />
        </ScrollSqueezeSection>
      </main>

      <Footer />
    </div>
  )
}
