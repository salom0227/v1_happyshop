import Image from "next/image"
import { TopBar } from "@/components/top-bar"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Phone, Send } from "lucide-react"

const services = [
  {
    slug: "foto-xizmati",
    title: "Foto xizmati",
    description:
      "Professional foto xizmati: mahsulot suratlari, tadbirlar, studiya va outdoor fotosessiyalar. Premium uskunalar va kreativ yondashuv orqali har bir kadrni esda qolarli qilamiz.",
    images: ["/images/hero-flowers.jpg", "/images/cat-bouquets.jpg", "/images/prod-vase.jpg"],
  },
  {
    slug: "video-xizmati",
    title: "Video xizmati",
    description:
      "Reklama roliklari, short videolar va tadbirlar uchun video suratga olish va montaj xizmati. Kontentingizni ijtimoiy tarmoqlar va reklama platformalariga moslab tayyorlaymiz.",
    images: ["/images/hero-gifts.jpg", "/images/prod-gift-set.jpg", "/images/prod-basket.jpg"],
  },
  {
    slug: "coding-xizmati",
    title: "Coding xizmati",
    description:
      "Frontend va UI development xizmati: landing sahifalar, promo saytlar va maxsus UI komponentlar. Zamonaviy texnologiyalar va responsiv dizayn asosida ishlab chiqamiz.",
    images: ["/images/prod-personalized.jpg", "/images/prod-candle.jpg"],
  },
  {
    slug: "bezatish-xizmati",
    title: "Bezatish xizmati",
    description:
      "Tadbirlar, sovg‘a qadoqlash va dekor ishlarini bezatish xizmati. Floristika, dekor elementlar va yorug‘lik bilan uyg‘unlashtirilgan ajoyib kompozitsiyalar tayyorlaymiz.",
    images: ["/images/cat-handmade.jpg", "/images/prod-dried-flowers.jpg", "/images/prod-teddy.jpg"],
  },
]

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const service = services.find((s) => s.slug === slug) ?? services[0]

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
          <a href="/blog" className="hover:text-primary transition-colors">
            Xizmatlar
          </a>
          <span>/</span>
          <span className="text-foreground">{service.title}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-[1.2fr,0.8fr] gap-5 sm:gap-8 items-start">
          <div className="space-y-4 sm:space-y-6">
            <div className="relative w-full h-[220px] sm:h-[280px] md:h-[320px] rounded-2xl overflow-hidden bg-muted">
              <Image
                src={service.images[0]}
                alt={service.title}
                fill
                sizes="(max-width:768px) 100vw, (max-width:1024px) 60vw, 720px"
                className="object-cover"
              />
            </div>

            {service.images.length > 1 && (
              <div className="grid grid-cols-3 gap-2 sm:gap-3">
                {service.images.slice(1).map((img) => (
                  <div key={img} className="relative h-20 sm:h-24 md:h-28 rounded-xl overflow-hidden bg-muted">
                    <Image
                      src={img}
                      alt={service.title}
                      fill
                      sizes="(max-width:768px) 30vw, 240px"
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          <Card className="py-5 px-4 sm:px-6 bg-card/90 border-border/70 space-y-3 sm:space-y-4">
            <h1
              className="text-lg sm:text-xl font-bold text-foreground"
              style={{ fontFamily: "var(--font-apple)" }}
            >
              {service.title}
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              {service.description}
            </p>
            <ul className="mt-2 space-y-1.5 text-xs sm:text-sm text-muted-foreground">
              <li>- Individual yondashuv va konsultatsiya</li>
              <li>- Oldindan reja tuzish va tafsilotlarni kelishish</li>
              <li>- Sifatli natija va o‘z vaqtida yetkazib berish</li>
            </ul>
          </Card>
        </div>

        <div className="mt-6 flex flex-col sm:flex-row gap-2 sm:gap-3 justify-center">
          <Button asChild className="flex-1 sm:flex-none sm:min-w-[200px] h-11 min-h-[44px]">
            <a href="tel:">
              <Phone className="h-4 w-4 mr-1.5" />
              Qo&apos;ng&apos;iroq qilish
            </a>
          </Button>
          <Button
            asChild
            variant="outline"
            className="flex-1 sm:flex-none sm:min-w-[200px] h-11 min-h-[44px]"
          >
            <a
              href="https://t.me/username"
              target="_blank"
              rel="noreferrer"
            >
              <Send className="h-4 w-4 mr-1.5" />
              Telegramdan yozish
            </a>
          </Button>
        </div>
      </main>

      <Footer />
    </div>
  )
}

