import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { TopBar } from "@/components/top-bar"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card } from "@/components/ui/card"
import { ServiceGallery } from "@/components/service-gallery"
import { ServiceContactButton } from "@/components/service-contact-button"
import { getServicePage, getServicePages } from "@/services/api/analyticsApi"
import { getSiteUrl } from "@/lib/site-url"

type Props = { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  try {
    const pages = await getServicePages()
    return pages.map((p) => ({ slug: p.slug }))
  } catch {
    return []
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  try {
    const page = await getServicePage(slug)
    return {
      title: page.title,
      description: page.content?.replace(/<[^>]*>/g, "").slice(0, 160),
      openGraph: { title: page.title, url: `${getSiteUrl()}/xizmatlar/${slug}` },
    }
  } catch {
    return { title: "Xizmat" }
  }
}

export default async function XizmatDetailPage({ params }: Props) {
  const { slug } = await params
  let page: Awaited<ReturnType<typeof getServicePage>> | null = null
  try {
    page = await getServicePage(slug)
  } catch {
    page = null
  }

  if (!page) {
    return (
      <div className="min-h-screen bg-transparent">
        <TopBar />
        <Header />
        <main className="max-w-7xl mx-auto px-4 py-12 text-center">
          <p className="text-muted-foreground mb-4">Sahifa topilmadi.</p>
          <Link href="/xizmatlar" className="text-primary font-medium hover:underline">
            Xizmatlar ro&apos;yxatiga qaytish
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
        <nav className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-muted-foreground mb-4" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-primary transition-colors">Bosh sahifa</Link>
          <span>/</span>
          <Link href="/xizmatlar" className="hover:text-primary transition-colors">Xizmatlar</Link>
          <span>/</span>
          <span className="text-foreground">{page.title}</span>
        </nav>

        <article>
          <h1
            className="text-xl sm:text-2xl font-bold text-foreground mb-6"
            style={{ fontFamily: "var(--font-apple)" }}
          >
            {page.title}
          </h1>

          {(page.image || (page.images?.length ?? 0) > 0) && (
            <div className="mb-6 sm:mb-8 rounded-xl sm:rounded-2xl overflow-hidden border border-border/50">
              <div className="relative w-full aspect-[16/10] sm:aspect-[2/1] bg-muted/30">
                <Image
                  src={page.image || page.images![0]}
                  alt={page.title}
                  fill
                  priority
                  sizes="(max-width:768px) 100vw, 1024px"
                  className="object-cover"
                  unoptimized={(page.image || page.images![0]).startsWith("http")}
                />
              </div>
            </div>
          )}

          {page.content && (
            <div
              className="prose prose-neutral dark:prose-invert max-w-none text-foreground mb-8"
              dangerouslySetInnerHTML={{ __html: page.content }}
            />
          )}

          {page.gallery && page.gallery.length > 0 && (
            <ServiceGallery
              images={page.gallery.map((img) => ({ src: img.image, caption: img.caption }))}
              title={page.title}
            />
          )}

          <Card className="mt-8 sm:mt-10 p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-[#0088cc]/30 bg-[#0088cc]/5">
            <div>
              <h2 className="text-base font-semibold text-foreground">Xizmatdan foydalanish uchun</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Telegram, telefon yoki email orqali bog&apos;lanishingiz mumkin.
              </p>
              <div className="mt-2 space-y-1 text-sm text-muted-foreground">
                <p>
                  Telegram:{" "}
                  <span className="font-medium text-foreground">@username</span>
                </p>
                <p>
                  Telefon:{" "}
                  <span className="font-medium text-foreground">Telefon raqami</span>
                </p>
                <p>
                  Email:{" "}
                  <span className="font-medium text-foreground">email@example.com</span>
                </p>
              </div>
            </div>
            <ServiceContactButton
              serviceSlug={page.slug}
              serviceTitle={page.title}
              telegramUrl={`https://t.me/username?text=${encodeURIComponent(
                `Assalomu alaykum, «${page.title}» xizmati haqida ma'lumot olmoqchiman.`
              )}`}
            >
              <svg className="h-5 w-5 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z" />
              </svg>
              Telegram orqali bog&apos;lanish
            </ServiceContactButton>
          </Card>
        </article>
      </main>

      <Footer />
    </div>
  )
}
