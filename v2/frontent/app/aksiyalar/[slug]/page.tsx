import { TopBar } from "@/components/top-bar"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ProductSection } from "@/components/product-section"
import { getPromoCategories, getPromoCategoryProducts, getProducts } from "@/services/api"
import Image from "next/image"
import Link from "next/link"

export default async function PromotionDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  let promos: Awaited<ReturnType<typeof getPromoCategories>> = []
  let products: Awaited<ReturnType<typeof getPromoCategoryProducts>> = []
  let recentProducts: Awaited<ReturnType<typeof getProducts>> = []
  try {
    const [promoList, promoProds, all] = await Promise.all([
      getPromoCategories(),
      getPromoCategoryProducts(slug),
      getProducts(),
    ])
    promos = promoList
    products = promoProds
    recentProducts = all.slice(0, 4)
  } catch {
    promos = []
    products = []
    recentProducts = []
  }

  const promo = promos.find((p) => p.slug === slug) ?? null

  if (!promo) {
    return (
      <div className="min-h-screen bg-transparent">
        <TopBar />
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 pb-24">
          <p className="text-muted-foreground">Aksiya topilmadi.</p>
          <Link href="/aksiyalar" className="text-primary font-medium hover:underline mt-2 inline-block">
            Aksiyalar sahifasiga qaytish
          </Link>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-transparent">
      <TopBar />
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 pb-24">
        <nav className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-primary transition-colors">Bosh sahifa</Link>
          <span>/</span>
          <Link href="/aksiyalar" className="hover:text-primary transition-colors">Aksiyalar va chegirmalar</Link>
          <span>/</span>
          <span className="text-foreground line-clamp-1">{promo.name}</span>
        </nav>

        <div className="flex flex-col lg:flex-row gap-6 sm:gap-8">
          <div className="flex-1 min-w-0">
            <h1 className="text-xl sm:text-2xl font-bold text-foreground mb-3 sm:mb-4">{promo.name}</h1>

            {promo.image && (
              <div className="rounded-xl overflow-hidden mb-6 sm:mb-8 h-[220px] sm:h-[300px] relative">
                <Image
                  src={promo.image}
                  alt={promo.name}
                  fill
                  sizes="(max-width:768px) 100vw, (max-width:1024px) 70vw, 800px"
                  className="object-cover"
                  unoptimized={promo.image?.startsWith("http")}
                />
              </div>
            )}

            <section className="mt-8 sm:mt-10">
              <ProductSection
                title={`${promo.name} uchun mahsulotlar`}
                products={products}
              />
            </section>

            <section className="mt-8 sm:mt-10">
              <ProductSection
                title="Yaqinda ko'rib chiqilgan mahsulotlar"
                products={recentProducts}
              />
            </section>
          </div>

          <aside className="lg:w-[300px] shrink-0">
            <h3 className="text-sm sm:text-base font-bold text-foreground mb-3 sm:mb-4">Aksiyalar</h3>
            <div className="flex flex-col gap-2 sm:gap-3">
              {promos.slice(0, 6).map((p) => (
                <Link
                  key={p.id}
                  href={p.link || `/gift-for/${p.slug}`}
                  className="text-sm text-foreground hover:text-primary transition-colors py-2 min-h-[44px] flex flex-col justify-center"
                >
                  <span className="font-medium line-clamp-2">{p.name}</span>
                </Link>
              ))}
              <Link href="/aksiyalar" className="text-sm text-primary font-medium hover:underline mt-2 min-h-[44px] flex items-center">
                Barcha aksiyalar va chegirmalar
              </Link>
            </div>
          </aside>
        </div>
      </main>

      <Footer />
    </div>
  )
}
