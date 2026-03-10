import Link from "next/link"
import Image from "next/image"
import { TopBar } from "@/components/top-bar"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card } from "@/components/ui/card"
import { ConciergeBell } from "lucide-react"
import { getServicePages } from "@/services/api/analyticsApi"

export default async function XizmatlarPage() {
  let pages: Awaited<ReturnType<typeof getServicePages>> = []
  try {
    pages = await getServicePages()
  } catch {
    pages = []
  }

  return (
    <div className="min-h-screen bg-transparent">
      <TopBar />
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 pb-24">
        <nav className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-muted-foreground mb-4" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-primary transition-colors">Bosh sahifa</Link>
          <span>/</span>
          <span className="text-foreground">Xizmatlar</span>
        </nav>

        <h1
          className="text-xl sm:text-2xl font-bold text-foreground mb-2 sm:mb-3"
          style={{ fontFamily: "var(--font-apple)" }}
        >
          Xizmatlar
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground mb-5 sm:mb-6">
          Barcha xizmatlar ro&apos;yxati. O&apos;zingizga mos xizmatni tanlang.
        </p>

        {pages.length === 0 ? (
          <p className="text-muted-foreground">Hozircha xizmatlar ro&apos;yxati mavjud emas.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {pages.map((page) => {
              const cardImage = page.image ?? (page.images?.length ? page.images[0] : null)
              const plainText = page.content ? page.content.replace(/<[^>]*>/g, "") : ""
              const short = plainText ? plainText.slice(0, 80) + (plainText.length > 80 ? "…" : "") : ""
              return (
                <Link
                  key={page.id}
                  href={`/xizmatlar/${page.slug}`}
                  className="group rounded-2xl bg-card border border-border/60 hover:border-primary/60 transition-colors flex flex-col overflow-hidden h-full"
                >
                  <div className="relative w-full aspect-[4/3] bg-muted/40">
                    {cardImage ? (
                      <Image
                        src={cardImage}
                        alt={page.title}
                        fill
                        sizes="(max-width:768px) 50vw, (max-width:1024px) 33vw, 25vw"
                        className="object-cover md:group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                        unoptimized={cardImage.startsWith("http")}
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <ConciergeBell className="h-10 w-10 text-muted-foreground/60 group-hover:text-primary/70 transition-colors" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 flex flex-col px-3 pt-2.5 pb-3 sm:px-3.5 sm:pt-3 sm:pb-3.5">
                    <h2 className="text-xs sm:text-sm font-semibold text-foreground group-hover:text-primary transition-colors text-center line-clamp-2 leading-snug">
                      {page.title}
                    </h2>
                    {short && (
                      <p className="mt-1 text-[11px] sm:text-xs text-muted-foreground text-center line-clamp-2">
                        {short}
                      </p>
                    )}
                  </div>
                </Link>
              )
            })}
          </div>
        )}

        <Card className="mt-8 sm:mt-10 p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-[#0088cc]/30 bg-[#0088cc]/5">
          <div>
            <h2 className="text-base font-semibold text-foreground">Xizmat ko&apos;rsatish bo&apos;yicha takliflar uchun</h2>
            <p className="text-sm text-muted-foreground mt-1">Telegram orqali tez javob oling</p>
          </div>
          <a
            href="https://t.me/mu7alov"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 w-full sm:w-auto h-12 min-h-[44px] px-6 border-2 border-[#0088cc] bg-[#0088cc]/10 text-[#0088cc] rounded-md text-sm font-medium hover:bg-[#0088cc]/20 transition-colors shrink-0"
          >
            <svg className="h-5 w-5 shrink-0" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z" />
            </svg>
            Telegram orqali bog&apos;lanish
          </a>
        </Card>
      </main>

      <Footer />
    </div>
  )
}
