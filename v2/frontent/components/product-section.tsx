"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import type { Product } from "@/types/product"
import { ProductCard } from "./product-card"
import { getWishlist } from "@/services/api/wishlistApi"
import { getCartSessionId } from "@/lib/cart-session"
import GradientText from "./GradientText"

interface ProductSectionProps {
  title: string
  products: Product[]
  viewAllLink?: string
}

export function ProductSection({ title, products, viewAllLink }: ProductSectionProps) {
  const [wishlistIds, setWishlistIds] = useState<Set<number>>(new Set())

  const loadWishlist = useCallback(async () => {
    const sessionId = getCartSessionId()
    if (!sessionId) return
    try {
      const { items } = await getWishlist(sessionId)
      setWishlistIds(new Set(items.map((i) => i.product.id)))
    } catch {
      setWishlistIds(new Set())
    }
  }, [])

  useEffect(() => {
    loadWishlist()
  }, [loadWishlist])

  return (
    <section>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4 sm:mb-6">
        {title === "XIT mahsulotlar" ? (
          <GradientText
            colors={["#5227FF", "#FF9FFC", "#B19EEF"]}
            animationSpeed={3.5}
            showBorder={false}
            className="text-xl sm:text-2xl font-bold font-sans !m-0 self-start"
          >
            {title}
          </GradientText>
        ) : (
          <h2
            className="text-xl sm:text-2xl font-bold text-foreground"
            style={{ fontFamily: "var(--font-apple)" }}
          >
            {title}
          </h2>
        )}
        {viewAllLink && products.length > 0 && (
          <Link
            href={viewAllLink}
            className="flex items-center gap-1.5 text-primary font-semibold text-sm hover:underline shrink-0 min-h-[44px] items-center"
          >
            {"Barchasini ko'rish"}
            <ArrowRight className="h-4 w-4" />
          </Link>
        )}
      </div>
      {products.length === 0 ? (
        <p className="text-sm text-muted-foreground py-4">Mahsulotlar topilmadi.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              isInWishlist={wishlistIds.has(product.id)}
              onWishlistChange={loadWishlist}
            />
          ))}
        </div>
      )}
    </section>
  )
}
