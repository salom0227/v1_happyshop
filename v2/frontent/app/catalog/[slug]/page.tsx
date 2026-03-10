import type { Metadata } from "next"
import { TopBar } from "@/components/top-bar"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { CatalogListing } from "@/components/catalog-listing"
import { getCategoryProducts, getCategories } from "@/services/api"
import { getSiteUrl } from "@/lib/site-url"

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  let categoryName = slug
  try {
    const categories = await getCategories()
    const cat = categories.find((c) => c.slug === slug)
    if (cat) categoryName = cat.name
  } catch {
    /* use slug as fallback */
  }
  const canonical = `${getSiteUrl()}/catalog/${slug}`
  return {
    title: categoryName,
    description: `${categoryName} - mahsulotlar katalogi. Happy Shop`,
    alternates: { canonical },
    openGraph: { title: categoryName, url: canonical },
  }
}

export default async function CatalogPage({ params }: Props) {
  const { slug } = await params
  let products: Awaited<ReturnType<typeof getCategoryProducts>> = []
  let categoryName = slug
  try {
    products = await getCategoryProducts(slug)
    const categories = await getCategories()
    const cat = categories.find((c) => c.slug === slug)
    if (cat) categoryName = cat.name
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
          <a href="/" className="hover:text-primary transition-colors">Katalog</a>
          <span>/</span>
          <span className="text-foreground">{categoryName}</span>
        </nav>

        <CatalogListing slug={slug} products={products} categoryName={categoryName} />
      </main>

      <Footer />
    </div>
  )
}
