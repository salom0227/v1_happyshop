import { TopBar } from "@/components/top-bar"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { getPromoCategories } from "@/services/api"
import Link from "next/link"
import Image from "next/image"

export default async function PromotionsPage() {
  let promos: Awaited<ReturnType<typeof getPromoCategories>> = []
  try {
    promos = await getPromoCategories()
  } catch {
    promos = []
  }

  return (
    <div className="min-h-screen bg-transparent transition-colors duration-500">
      <TopBar />
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 pb-24">
        <nav className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4" aria-label="Breadcrumb">
          <a href="/" className="hover:text-primary transition-colors">Bosh sahifa</a>
          <span>/</span>
          <span className="text-foreground">Aksiyalar va chegirmalar</span>
        </nav>

        <h1 className="text-xl sm:text-2xl font-bold text-foreground mb-4 sm:mb-6">
          Aksiyadagi mahsulotlar va chegirmalar Toshkentda
        </h1>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {promos.length === 0 ? (
            <p className="col-span-full text-sm text-muted-foreground py-8">Aksiyalar topilmadi.</p>
          ) : (
            promos.map((promo) => (
              <Link
                key={promo.id}
                href={promo.link || `/gift-for/${promo.slug}`}
                className="group block active:scale-[0.99] transition-transform touch-manipulation"
              >
                <div className="rounded-xl overflow-hidden mb-2 sm:mb-3 h-[200px] sm:h-[240px] bg-secondary relative">
                  {promo.image ? (
                    <Image
                      src={promo.image}
                      alt={promo.name}
                      fill
                      sizes="(max-width:768px) 50vw, (max-width:1024px) 33vw, 25vw"
                      className="object-cover md:group-hover:scale-105 transition-transform duration-300"
                      unoptimized={promo.image.startsWith("http")}
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-4xl">🎁</div>
                  )}
                </div>
                <h3 className="text-xs sm:text-sm font-bold text-foreground group-hover:text-primary transition-colors mb-1 line-clamp-2">
                  {promo.name}
                </h3>
              </Link>
            ))
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
