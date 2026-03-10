"use client"

import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { TopBar } from "@/components/top-bar"
import { Header } from "@/components/header"
import { searchProducts } from "@/services/api/productApi"
import type { SearchProductResult } from "@/types/product"
import { Loader2 } from "lucide-react"

export function QidiruvContent() {
  const searchParams = useSearchParams()
  const q = searchParams.get("q")?.trim() ?? ""
  const [results, setResults] = useState<SearchProductResult[]>([])
  const [loading, setLoading] = useState(!!q)

  useEffect(() => {
    if (!q) {
      setResults([])
      setLoading(false)
      return
    }
    setLoading(true)
    searchProducts(q)
      .then((data) => setResults(Array.isArray(data) ? data : []))
      .catch(() => setResults([]))
      .finally(() => setLoading(false))
  }, [q])

  return (
    <div className="min-h-screen bg-transparent transition-colors duration-500">
      <TopBar />
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 pb-24">
        <nav
          className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4"
          aria-label="Breadcrumb"
        >
          <Link href="/" className="hover:text-primary transition-colors">
            Bosh sahifa
          </Link>
          <span>/</span>
          <span className="text-foreground">Qidiruv</span>
          {q && (
            <>
              <span>/</span>
              <span className="text-foreground">&quot;{q}&quot;</span>
            </>
          )}
        </nav>

        <h1
          className="text-xl sm:text-2xl font-bold text-foreground mb-4 sm:mb-6"
          style={{ fontFamily: "var(--font-apple)" }}
        >
          {q ? `"${q}" bo'yicha natijalar` : "Qidiruv"}
        </h1>

        {!q ? (
          <p className="text-muted-foreground">Qidirish uchun yuqoridagi qidiruv maydonidan foydalaning.</p>
        ) : loading ? (
          <div className="flex items-center justify-center gap-2 py-16 text-muted-foreground">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span>Qidirilmoqda...</span>
          </div>
        ) : results.length === 0 ? (
          <p className="py-8 text-center text-muted-foreground">Mahsulot topilmadi.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {results.map((product) => (
              <Link
                key={product.id}
                href={`/product/${product.slug}`}
                className="group block rounded-2xl border border-border bg-card overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="relative aspect-square bg-muted/50">
                  {product.image ? (
                    <Image
                      src={product.image}
                      alt={product.title}
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      unoptimized={product.image.startsWith("http")}
                    />
                  ) : (
                    <span className="absolute inset-0 flex items-center justify-center text-4xl">📦</span>
                  )}
                </div>
                <div className="p-3 sm:p-4">
                  <h2 className="font-medium text-foreground line-clamp-2 text-sm sm:text-base group-hover:text-primary transition-colors">
                    {product.title}
                  </h2>
                  <p className="mt-1 text-sm font-semibold text-primary">
                    {typeof product.price === "number"
                      ? `${product.price.toLocaleString()} so'm`
                      : `${Number(product.price).toLocaleString()} so'm`}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
