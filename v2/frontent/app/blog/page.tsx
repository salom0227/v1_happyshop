import Image from "next/image"
import Link from "next/link"
import { TopBar } from "@/components/top-bar"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card } from "@/components/ui/card"

const services = [
  {
    slug: "foto-xizmati",
    title: "Foto xizmati",
    description: "Professional suratga olish, mahsulot va tadbirlar uchun kreativ fotosessiyalar.",
    cover: "/images/hero-flowers.jpg",
  },
  {
    slug: "video-xizmati",
    title: "Video xizmati",
    description: "Reklama roliklari, lavhalar va kontent uchun sifatli video suratga olish va montaj.",
    cover: "/images/hero-gifts.jpg",
  },
  {
    slug: "coding-xizmati",
    title: "Coding xizmati",
    description: "Veb-saytlar, landing sahifalar va maxsus frontend yechimlar tayyorlash.",
    cover: "/images/prod-personalized.jpg",
  },
  {
    slug: "bezatish-xizmati",
    title: "Bezatish xizmati",
    description: "Tadbirlar, sovg‘a qadoqlash va dekor bezaklarini zamonaviy uslubda tayyorlash.",
    cover: "/images/cat-handmade.jpg",
  },
]

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-transparent transition-colors duration-500">
      <TopBar />
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 pb-24">
        <h1
          className="text-xl sm:text-2xl font-bold text-foreground mb-3 sm:mb-4"
          style={{ fontFamily: "var(--font-apple)" }}
        >
          Xizmat ko&apos;rsatish turlari
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground mb-6 sm:mb-8 max-w-2xl">
          Quyidagi premium xizmatlarimiz orqali sovg&apos;alar, tadbirlar va onlayn loyihalaringizni yanada
          chiroyli va esda qolarli qilamiz.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          {services.map((service) => (
            <Link key={service.slug} href={`/blog/${service.slug}`} className="group">
              <Card className="py-5 px-4 sm:px-5 flex items-start gap-3 sm:gap-4 bg-card/90 border-border/70 hover:border-primary/50 hover:shadow-lg transition-colors duration-300">
                <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden bg-primary/10 shrink-0">
                  <Image
                    src={service.cover}
                    alt={service.title}
                    fill
                    sizes="80px"
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="space-y-1.5">
                  <h2 className="text-sm sm:text-base font-semibold text-foreground">
                    {service.title}
                  </h2>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    {service.description}
                  </p>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  )
}

