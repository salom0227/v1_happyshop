import { TopBar } from "@/components/top-bar"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { CatalogListing } from "@/components/catalog-listing"
import { getPromoCategoryProducts, getPromoCategories } from "@/services/api"

export default async function GiftForPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  let products: Awaited<ReturnType<typeof getPromoCategoryProducts>> = []
  let title = slug
  try {
    products = await getPromoCategoryProducts(slug)
    const promos = await getPromoCategories()
    const promo = promos.find((p) => p.slug === slug)
    if (promo) title = promo.name
  } catch {
    products = []
  }

  return (
    <div className="min-h-screen bg-transparent transition-colors duration-500">
      <TopBar />
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 pb-24">
        <nav className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4" aria-label="Breadcrumb">
          <a href="/" className="hover:text-primary transition-colors">Bosh sahifa</a>
          <span>/</span>
          <a href="/" className="hover:text-primary transition-colors">Kimga sovg'a</a>
          <span>/</span>
          <span className="text-foreground">{title}</span>
        </nav>

        <CatalogListing slug={slug} products={products} categoryName={`${title} uchun sovg'alar`} />
      </main>

      <Footer />
    </div>
  )
}
