"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion } from "motion/react"
import { ShoppingCart, Heart } from "lucide-react"
import type { Product } from "@/types/product"
import { formatPrice } from "@/lib/utils"
import { getCartSessionId } from "@/lib/cart-session"
import { addToCart } from "@/services/api/cartApi"
import { addToWishlist, removeFromWishlist } from "@/services/api/wishlistApi"
import { useCartCount } from "@/contexts/cart-count-context"
import { toast } from "sonner"

interface ProductCardProps {
  product: Product
  isInWishlist?: boolean
  onWishlistChange?: () => void
}

export function ProductCard({ product, isInWishlist = false, onWishlistChange }: ProductCardProps) {
  const { refreshCartCount } = useCartCount()
  const [adding, setAdding] = useState(false)
  const [liked, setLiked] = useState(isInWishlist)
  const [togglingLike, setTogglingLike] = useState(false)
  const imageSrc = product.image || "https://placehold.co/400x400?text=Mahsulot"
  const showLiked = liked || isInWishlist
  const favoriteCount = product.favorite_count ?? 0
  const soldCount = product.sold_count ?? 0
  const isBestseller = soldCount >= 5

  const handleLike = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    const sessionId = getCartSessionId()
    if (!sessionId || togglingLike) return
    setTogglingLike(true)
    try {
      if (showLiked) {
        await removeFromWishlist(sessionId, product.id)
        setLiked(false)
      } else {
        await addToWishlist(sessionId, product.id)
        setLiked(true)
      }
      onWishlistChange?.()
    } catch {
      // ignore
    } finally {
      setTogglingLike(false)
    }
  }

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
      {/* Badges */}
      <div className="flex flex-wrap gap-0.5 sm:gap-1 absolute top-2 left-2 sm:top-3 sm:left-3 z-10">
        {product.discount_percent != null && product.discount_percent > 0 && (
          <span className="text-[10px] sm:text-[11px] font-semibold px-2 py-0.5 rounded-md bg-green-600 text-white">
            −{product.discount_percent}%
          </span>
        )}
        {isBestseller && (
          <span className="text-[10px] sm:text-[11px] font-semibold px-2 py-0.5 rounded-md bg-amber-500 text-white">
            Bestseller
          </span>
        )}
        {product.is_featured && (
          <span className="text-[10px] sm:text-[11px] font-semibold px-2 py-0.5 rounded-md bg-primary text-primary-foreground">
            Xit mahsulot
          </span>
        )}
      </div>

      {/* Image + Like / Sevimlilarga */}
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
        <div className="absolute bottom-2 right-2 z-10">
          <button
            onClick={handleLike}
            disabled={togglingLike}
            className="glass-btn-float w-8 h-8 sm:w-8 sm:h-8 min-h-[32px] min-w-[32px] flex items-center justify-center rounded-full text-muted-foreground hover:text-primary opacity-100 sm:opacity-0 sm:group-hover:opacity-100 touch-manipulation disabled:opacity-60 transition-opacity"
            aria-label={showLiked ? "Sevimlilardan olib tashlash" : "Sevimlilarga qo'shish"}
          >
            <Heart
              className={`h-3.5 w-3.5 sm:h-3.5 sm:w-3.5 ${showLiked ? "fill-primary text-primary" : ""}`}
            />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col">
        <h3 className="text-sm sm:text-base font-medium text-foreground mb-1 sm:mb-1.5 line-clamp-2 leading-snug group-hover:text-primary transition-colors">
          {product.title}
        </h3>
        {favoriteCount > 0 && (
          <p className="text-[10px] sm:text-xs text-muted-foreground mb-2">
            {favoriteCount} kishi yoqtirdi
          </p>
        )}

        <div className="mb-3" />

        {/* Price */}
        <div className="mt-auto flex items-center justify-between">
          <div className="min-w-0 flex flex-col items-start gap-0.5">
            {product.discount_price != null && product.discount_price !== "" ? (
              <>
                <span className="text-[11px] sm:text-xs text-muted-foreground line-through">
                  {formatPrice(product.price)} so&apos;m
                </span>
                <span className="text-base sm:text-lg font-bold text-foreground text-green-600 dark:text-green-400">
                  {formatPrice(product.discount_price)} so&apos;m
                </span>
              </>
            ) : (
              <span className="text-base sm:text-lg font-bold text-foreground">
                {formatPrice(product.price)} so&apos;m
              </span>
            )}
          </div>
          <button
            onClick={handleAddToCart}
            disabled={adding}
            className="btn btn-primary h-10 min-h-[44px] w-10 p-0 flex items-center justify-center rounded-full touch-manipulation disabled:opacity-70 disabled:cursor-not-allowed transition-transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl text-primary-foreground"
            aria-label="Savatchaga qo'shish"
          >
            <ShoppingCart className="h-5 w-5 shrink-0" aria-hidden />
          </button>
        </div>
      </div>
    </Link>
    </motion.div>
  )
}
