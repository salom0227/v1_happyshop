"use client"

import { useEffect, useState } from "react"
import { TopBar } from "@/components/top-bar"
import { Header } from "@/components/header"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Heart, ArrowRight, Trash2, ShoppingCart } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { motion } from "motion/react"
import { getCartSessionId } from "@/lib/cart-session"
import { getWishlist, removeFromWishlist } from "@/services/api/wishlistApi"
import { addToCart } from "@/services/api/cartApi"
import type { WishlistItem } from "@/services/api/wishlistApi"
import { formatPrice } from "@/lib/utils"
import { useCartCount } from "@/contexts/cart-count-context"
import { toast } from "sonner"

function WishlistProductCard({
  item,
  onRemove,
  loading,
}: {
  item: WishlistItem
  onRemove: (productId: number) => void
  loading: boolean
}) {
  const { refreshCartCount } = useCartCount()
  const product = item.product
  const price = typeof product.price === "string" ? parseFloat(product.price) : product.price
  const imageSrc = product.image || "https://placehold.co/400x400?text=Mahsulot"
  const [adding, setAdding] = useState(false)

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    const sessionId = getCartSessionId()
    if (!sessionId) return
    setAdding(true)
    try {
      await addToCart(sessionId, product.id, 1)
      await refreshCartCount()
      toast.success("Savatchaga qo'shildi")
    } catch {
      toast.error("Qo'shishda xatolik")
    } finally {
      setAdding(false)
    }
  }

  const handleRemove = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    onRemove(product.id)
  }

  return (
    <motion.div
      className="h-full"
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
    >
      <Link
        href={`/product/${product.slug}`}
        className="group product-card-glass p-3 sm:p-4 flex flex-col relative touch-manipulation h-full rounded-2xl"
      >
        {/* Sevimlilardan o'chirish */}
        <div className="absolute top-2 right-2 sm:top-3 sm:right-3 z-10">
          <button
            onClick={handleRemove}
            disabled={loading}
            className="glass-btn-float w-10 h-10 sm:w-9 sm:h-9 min-h-[44px] min-w-[44px] sm:min-h-0 sm:min-w-0 flex items-center justify-center rounded-full fill-primary text-primary opacity-100 hover:opacity-90 touch-manipulation disabled:opacity-60 transition-opacity"
            aria-label="Sevimlilardan o'chirish"
          >
            <Heart className="h-4 w-4 sm:h-4 sm:w-4" />
          </button>
        </div>

        {/* Rasm */}
        <div className="relative mb-2 sm:mb-3 overflow-hidden rounded-xl aspect-square bg-secondary/40">
          <Image
            src={imageSrc}
            alt={product.title}
            fill
            sizes="(max-width:768px) 50vw, (max-width:1024px) 33vw, 25vw"
            loading="lazy"
            className="object-cover md:group-hover:scale-105 transition-transform duration-500"
            unoptimized={imageSrc?.startsWith("http")}
          />
        </div>

        {/* Kontent */}
        <div className="flex-1 flex flex-col">
          <h3 className="text-sm sm:text-base font-medium text-foreground mb-1.5 sm:mb-2 line-clamp-2 leading-snug group-hover:text-primary transition-colors">
            {product.title}
          </h3>
          <div className="mb-3" />
          <div className="mt-auto flex items-center justify-between gap-2">
            <span className="text-base sm:text-lg font-bold text-foreground">
              {formatPrice(price)} so&apos;m
            </span>
            <button
              onClick={handleAddToCart}
              disabled={adding}
              className="btn btn-primary h-10 min-h-[44px] w-10 p-0 flex items-center justify-center rounded-full touch-manipulation disabled:opacity-70 shrink-0"
              aria-label="Savatchaga qo'shish"
            >
              <ShoppingCart className="h-5 w-5" aria-hidden />
            </button>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

export function SevimlilarContent() {
  const [items, setItems] = useState<WishlistItem[]>([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadWishlist = async () => {
    const sessionId = getCartSessionId()
    if (!sessionId) {
      setLoading(false)
      return
    }
    try {
      setError(null)
      const res = await getWishlist(sessionId)
      setItems(res.items ?? [])
    } catch (e) {
      setError(e instanceof Error ? e.message : "Sevimlilar ro'yxati yuklanmadi")
      setItems([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadWishlist()
  }, [])

  const handleRemove = async (productId: number) => {
    const sessionId = getCartSessionId()
    if (!sessionId) return
    setActionLoading(true)
    try {
      const res = await removeFromWishlist(sessionId, productId)
      setItems(res.items ?? [])
    } catch (e) {
      setError(e instanceof Error ? e.message : "Xatolik")
    } finally {
      setActionLoading(false)
    }
  }

  const hasItems = items.length > 0

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
          <span className="text-foreground">Sevimlilar</span>
        </nav>

        <h1
          className="text-xl sm:text-2xl font-bold text-foreground mb-3 sm:mb-4"
          style={{ fontFamily: "var(--font-apple)" }}
        >
          Sevimli mahsulotlar
        </h1>

        {loading ? (
          <div className="py-12 text-center text-muted-foreground">Yuklanmoqda...</div>
        ) : error ? (
          <Card className="py-6 px-4 text-center">
            <p className="text-destructive mb-2">{error}</p>
            <Button variant="outline" onClick={() => loadWishlist()}>
              Qayta urinish
            </Button>
          </Card>
        ) : !hasItems ? (
          <Card className="py-8 px-4 sm:px-6 flex flex-col items-center justify-center text-center gap-3 sm:gap-4">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-primary/10 flex items-center justify-center mb-1">
              <Heart className="h-6 w-6 sm:h-7 sm:w-7 text-primary" />
            </div>
            <p className="text-sm sm:text-base font-semibold text-foreground">
              Sevimlilar ro&apos;yxati hozircha bo&apos;sh
            </p>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-sm">
              Mahsulotlar sahifasida yurakcha tugmasini bosib sevimlilarga qo&apos;shing va bu yerda
              ko&apos;rishingiz mumkin.
            </p>
            <Button asChild className="mt-1 h-11 min-h-[44px] px-5">
              <Link href="/">
                Mahsulotlar
                <ArrowRight className="h-4 w-4 ml-1.5" />
              </Link>
            </Button>
          </Card>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {items.map((item) => (
              <WishlistProductCard
                key={item.id}
                item={item}
                onRemove={handleRemove}
                loading={actionLoading}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
