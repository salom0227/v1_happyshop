import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { TopBar } from "@/components/top-bar"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ProductDetail } from "@/components/product-detail"
import { ProductSection } from "@/components/product-section"
import { getProduct, getProducts } from "@/services/api"
import { getSiteUrl } from "@/lib/site-url"

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  let product: Awaited<ReturnType<typeof getProduct>> | null = null
  try {
    product = await getProduct(slug)
  } catch {
    product = null
  }
  if (!product) {
    return { title: "Mahsulot topilmadi" }
  }
  const siteUrl = getSiteUrl()
  const canonical = `${siteUrl}/product/${slug}`
  const image = product.image || product.images?.[0]
  const description =
    product.description?.replace(/<[^>]*>/g, "").slice(0, 160) ||
    `${product.title} - Happy Shop`

  return {
    title: product.title,
    description,
    alternates: { canonical },
    openGraph: {
      title: product.title,
      description,
      url: canonical,
      type: "website",
      images: image ? [{ url: image, width: 800, height: 800, alt: product.title }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: product.title,
      description,
      images: image ? [image] : undefined,
    },
  }
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params
  let product: Awaited<ReturnType<typeof getProduct>> | null = null
  let suggestedProducts: Awaited<ReturnType<typeof getProducts>> = []
  try {
    product = await getProduct(slug)
  } catch {
    product = null
  }
  if (!product) {
    notFound()
  }
  try {
    const all = await getProducts()
    suggestedProducts = all.filter((p) => p.slug !== slug).slice(0, 5)
  } catch {
    suggestedProducts = []
  }

  const catalogSlug = product?.category?.slug ?? "katalog"
  const categoryName = product?.category?.name ?? "Katalog"

  return (
    <div className="min-h-screen bg-transparent transition-colors duration-500">
      {product && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Product",
              name: product.title,
              description: product.description?.replace(/<[^>]*>/g, "").slice(0, 500) || product.title,
              image: product.images?.length ? product.images : product.image ? [product.image] : [],
              sku: String(product.id),
              offers: {
                "@type": "Offer",
                url: `${getSiteUrl()}/product/${product.slug}`,
                priceCurrency: "UZS",
                price: parseFloat(product.price) || 0,
                availability: "https://schema.org/InStock",
              },
            }),
          }}
        />
      )}
      <TopBar />
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 pb-28">
        <nav className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-muted-foreground mb-4 sm:mb-6" aria-label="Breadcrumb">
          <a href="/" className="hover:text-primary transition-colors">Bosh sahifa</a>
          <span>/</span>
          <a href="/catalog" className="hover:text-primary transition-colors">Katalog</a>
          <span>/</span>
          <a href={`/catalog/${catalogSlug}`} className="hover:text-primary transition-colors">{categoryName}</a>
          <span>/</span>
          <span className="text-foreground">{product?.title ?? "Mahsulot"}</span>
        </nav>

        <ProductDetail product={product} slug={slug} />

        <section className="mt-12">
          <ProductSection
            title="Sizga yoqishi mumkin"
            products={suggestedProducts}
          />
        </section>
      </main>

      <Footer />
    </div>
  )
}
