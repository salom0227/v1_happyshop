import type { Metadata } from "next"
import { TopBar } from "@/components/top-bar"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ProductCard } from "@/components/product-card"
import { getBannerProducts } from "@/services/api/productApi"
import { getBanners } from "@/services/api"

type Props = { params: Promise<{ id: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const bannerId = Number(id)
  let title = "Banner mahsulotlari"
  try {
    const banners = await getBanners()
    const banner = banners.find((b) => b.id === bannerId)
    if (banner) {
      title = banner.title
    }
  } catch {
    /* ignore */
  }
  return {
    title,
    description: `${title} uchun tanlangan sovg'alar va mahsulotlar.`,
  }
}

export default async function BannerProductsPage({ params }: Props) {
  const { id } = await params
  const bannerId = Number(id)
  let products: Awaited<ReturnType<typeof getBannerProducts>> = []
  let bannerTitle = "Banner mahsulotlari"

  try {
    const [bannerProducts, banners] = await Promise.all([
      getBannerProducts(bannerId),
      getBanners(),
    ])
    products = bannerProducts
    const banner = banners.find((b) => b.id === bannerId)
    if (banner) {
      bannerTitle = banner.title
    }
  } catch {
    products = []
  }

  return (
    <div className="min-h-screen bg-transparent transition-colors duration-500">
      <TopBar />
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 pb-24">
        <nav
          className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4"
          aria-label="Breadcrumb"
        >
          <a href="/" className="hover:text-primary transition-colors">
            Bosh sahifa
          </a>
          <span>/</span>
          <span className="text-foreground">{bannerTitle}</span>
        </nav>

        <h1
          className="text-xl sm:text-2xl font-bold text-foreground mb-1 sm:mb-2"
          style={{ fontFamily: "var(--font-apple)" }}
        >
          {bannerTitle}
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground mb-4 sm:mb-6">
          Ushbu banner uchun tanlab olingan sovg&apos;alar va mahsulotlar.
        </p>

        {products.length === 0 ? (
          <p className="text-muted-foreground">
            Hozircha bu banner uchun mahsulot biriktirilmagan.
          </p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                isInWishlist={false}
                onWishlistChange={() => {}}
              />
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}

