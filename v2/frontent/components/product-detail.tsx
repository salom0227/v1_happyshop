"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { Heart, Share2, ShoppingCart, Truck, Shield, Minus, Plus, Gift, Clock } from "lucide-react"
import type { Product } from "@/types/product"
import { formatPrice } from "@/lib/utils"
import { getCartSessionId } from "@/lib/cart-session"
import { addToCart } from "@/services/api/cartApi"
import { recordProductView } from "@/services/api/productApi"
import { getWishlist, addToWishlist, removeFromWishlist } from "@/services/api/wishlistApi"
import { useCartCount } from "@/contexts/cart-count-context"
import { toast } from "sonner"

interface ProductDetailProps {
  product: Product | null
  slug: string
}

export function ProductDetail({ product, slug }: ProductDetailProps) {
  const { refreshCartCount } = useCartCount()
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [showAllSpecs, setShowAllSpecs] = useState(false)
  const [addingToCart, setAddingToCart] = useState(false)
  const [isInWishlist, setIsInWishlist] = useState(false)
  const [togglingLike, setTogglingLike] = useState(false)
  const [favoriteCount, setFavoriteCount] = useState<number>(() => product?.favorite_count ?? 0)
  const viewRecordedRef = useRef(false)

  useEffect(() => {
    if (!product?.id || viewRecordedRef.current) return
    viewRecordedRef.current = true
    recordProductView(product.id).catch(() => {})
  }, [product?.id])

  useEffect(() => {
    if (!product?.id) return
    setFavoriteCount(product.favorite_count ?? 0)
  }, [product?.id, product?.favorite_count])

  useEffect(() => {
    if (!product?.id) return
    const sessionId = getCartSessionId()
    if (!sessionId) return
    getWishlist(sessionId)
      .then(({ items }) => setIsInWishlist(items.some((i) => i.product.id === product.id)))
      .catch(() => setIsInWishlist(false))
  }, [product?.id])

  const handleLike = async () => {
    const sessionId = getCartSessionId()
    if (!sessionId || !product || togglingLike) return
    setTogglingLike(true)
    const wasInWishlist = isInWishlist
    try {
      if (wasInWishlist) {
        await removeFromWishlist(sessionId, product.id)
        setIsInWishlist(false)
        setFavoriteCount((c) => Math.max(0, c - 1))
      } else {
        await addToWishlist(sessionId, product.id)
        setIsInWishlist(true)
        setFavoriteCount((c) => c + 1)
      }
    } catch {
      // ignore
    } finally {
      setTogglingLike(false)
    }
  }

  const handleAddToCart = async () => {
    const sessionId = getCartSessionId()
    if (!sessionId) return
    setAddingToCart(true)
    try {
      await addToCart(sessionId, product.id, quantity)
      await refreshCartCount()
      toast.success("Savatchaga qo'shildi")
    } catch {
      toast.error("Qo'shishda xatolik")
    } finally {
      setAddingToCart(false)
    }
  }

  if (!product) {
    return (
      <div className="py-12 text-center">
        <p className="text-muted-foreground mb-4">Mahsulot topilmadi.</p>
        <a href="/" className="text-primary font-medium hover:underline">Bosh sahifaga qaytish</a>
      </div>
    )
  }

  const imageSrc = product.image || "https://placehold.co/600x600?text=Mahsulot"
  const images =
    product.images && product.images.length > 0
      ? product.images
      : [imageSrc]
  const specs = product.specs && product.specs.length > 0
    ? product.specs
    : (product.category?.name ? [{ key: "Kategoriya", value: product.category.name }] : [])
  const viewCount = product.view_count ?? 0
  const soldCount = product.sold_count ?? 0

  return (
    <div className="flex flex-col gap-6 sm:gap-8 pb-24 lg:pb-4">
      <div className="flex flex-col lg:flex-row gap-6 sm:gap-8">
        <div className="lg:w-[55%] flex flex-col gap-3 sm:gap-4">
          <div className="relative w-full aspect-square rounded-xl sm:rounded-2xl overflow-hidden bg-card border border-border/50">
            <Image
              src={images[selectedImage]}
              alt={product.title}
              fill
              priority
              sizes="(max-width:768px) 100vw, (max-width:1024px) 55vw, 480px"
              className="object-cover"
              unoptimized={images[selectedImage].startsWith("http")}
            />
            {product.is_featured && (
              <div className="absolute top-4 left-4">
                <span className="bg-primary text-primary-foreground text-xs font-bold px-3 py-1.5 rounded-lg">
                  Xit savdo
                </span>
              </div>
            )}
          </div>

          <div className="flex flex-row sm:flex-col gap-2 overflow-x-auto scrollbar-hide sm:overflow-visible pb-1 sm:pb-0">
            {images.map((img, i) => (
              <button
                key={i}
                onClick={() => setSelectedImage(i)}
                className={`shrink-0 w-16 h-16 sm:w-18 sm:h-18 rounded-lg sm:rounded-xl overflow-hidden border-2 transition-colors min-h-[44px] min-w-[44px] ${
                  selectedImage === i ? "border-primary" : "border-border"
                }`}
              >
                <div className="relative w-full h-full">
                  <Image
                    src={img}
                    alt={`View ${i + 1}`}
                    fill
                    sizes="64px"
                    loading="lazy"
                    className="object-cover"
                    unoptimized={img.startsWith("http")}
                  />
                </div>
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 sm:gap-3 mt-2 sm:mt-3" />
        </div>

        <div className="lg:w-[45%] flex flex-col gap-3 sm:gap-4">
          <div>
            <h1
              className="text-xl sm:text-2xl font-bold text-foreground mb-1"
              style={{ fontFamily: "var(--font-apple)" }}
            >
              {product.title}
            </h1>
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 mb-2 text-xs sm:text-sm">
              {viewCount > 0 && (
                <span className="text-muted-foreground">{viewCount} ko&apos;rilgan</span>
              )}
              {soldCount > 0 && (
                <span className="text-muted-foreground">{soldCount} sotilgan</span>
              )}
            </div>
          </div>

          <div className="bg-card rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-border/50">
            <div className="mb-3 sm:mb-4">
              {product.discount_price != null && product.discount_price !== "" ? (
                <div className="flex flex-wrap items-baseline gap-2">
                  <span className="text-lg sm:text-xl text-muted-foreground line-through">
                    {formatPrice(product.price)} so&apos;m
                  </span>
                  {product.discount_percent != null && product.discount_percent > 0 && (
                    <span className="text-sm font-semibold text-green-600 dark:text-green-400 bg-green-500/10 px-2 py-0.5 rounded">
                      −{product.discount_percent}%
                    </span>
                  )}
                  <div className="text-2xl sm:text-3xl font-bold text-foreground text-green-600 dark:text-green-400">
                    {formatPrice(product.discount_price)} <span className="text-lg sm:text-xl">{"so'm"}</span>
                  </div>
                </div>
              ) : (
                <div className="text-2xl sm:text-3xl font-bold text-foreground">
                  {formatPrice(product.price)} <span className="text-lg sm:text-xl">{"so'm"}</span>
                </div>
              )}
            </div>

            {product.description && (
              <p className="text-sm text-muted-foreground mb-4 sm:mb-6 leading-relaxed">
                {product.description}
              </p>
            )}

            <div className="flex items-center gap-3 mb-4 sm:mb-6">
              <span className="text-sm text-muted-foreground">Soni:</span>
              <div className="flex items-center border border-border rounded-xl overflow-hidden">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 min-h-[44px] min-w-[44px] flex items-center justify-center hover:bg-secondary active:bg-secondary transition-colors touch-manipulation"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-12 text-center font-semibold">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 min-h-[44px] min-w-[44px] flex items-center justify-center hover:bg-secondary active:bg-secondary transition-colors touch-manipulation"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              <div className="flex items-center gap-0.5 sm:gap-1">
                <button
                  onClick={handleLike}
                  disabled={togglingLike}
                  className="flex items-center justify-center text-sm text-muted-foreground hover:text-primary transition-colors min-h-[44px] w-11 touch-manipulation disabled:opacity-60"
                  aria-label={isInWishlist ? "Sevimlilardan olib tashlash" : "Sevimlilarga qo'shish"}
                >
                  <Heart
                    className={`h-5 w-5 ${isInWishlist ? "fill-primary text-primary" : ""}`}
                  />
                </button>
                {favoriteCount > 0 && (
                  <span className="text-xs sm:text-sm text-muted-foreground">
                    {favoriteCount} Like
                  </span>
                )}
              </div>
            </div>

            <div className="hidden lg:flex flex-col sm:flex-row gap-2 sm:gap-3 mb-4 sm:mb-6">
              <button
                onClick={handleAddToCart}
                disabled={addingToCart}
                className="flex-1 bg-primary text-primary-foreground font-semibold py-3.5 min-h-[48px] rounded-xl hover:bg-primary/90 active:scale-95 transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/20 touch-manipulation disabled:opacity-70 disabled:cursor-not-allowed"
              >
                <ShoppingCart className="h-5 w-5" />
                {addingToCart ? "Qo'shilmoqda..." : "Savatchaga"}
              </button>
              <Link
                href="/savatcha"
                className="flex-1 border-2 border-primary text-primary font-semibold py-3.5 min-h-[48px] rounded-xl hover:bg-primary/5 active:scale-95 transition-all touch-manipulation flex items-center justify-center"
              >
                Savatchani ko'rish
              </Link>
            </div>

          </div>
        </div>
      </div>

      {(specs.length > 0) && (
        <div className="mt-2 sm:mt-4">
          <h2
            className="text-lg sm:text-xl font-bold text-foreground mb-3 sm:mb-4"
            style={{ fontFamily: "var(--font-apple)" }}
          >
            Mahsulot xususiyatlari
          </h2>
          <div className="bg-card border border-border/50 rounded-xl sm:rounded-2xl overflow-hidden">
            {specs.slice(0, showAllSpecs ? specs.length : 5).map((spec, i) => (
              <div
                key={`${spec.key}-${i}`}
                className={`flex items-center ${i % 2 === 0 ? "bg-secondary/50" : "bg-card"}`}
              >
                <div className="flex-1 px-3 sm:px-5 py-3 sm:py-3.5 text-xs sm:text-sm text-muted-foreground min-w-0">
                  {spec.key}
                </div>
                <div className="flex-1 px-3 sm:px-5 py-3 sm:py-3.5 text-xs sm:text-sm text-foreground font-medium text-right sm:text-left">
                  {spec.value}
                </div>
              </div>
            ))}
          </div>
          {!showAllSpecs && specs.length > 5 && (
            <button
              onClick={() => setShowAllSpecs(true)}
              className="mt-3 text-primary text-sm font-medium hover:underline min-h-[44px] touch-manipulation"
            >
              {"Ko'proq ko'rsatish"}
            </button>
          )}
        </div>
      )}

      <div className="fixed bottom-0 left-0 w-full bg-card/95 backdrop-blur border-t border-border px-4 py-3 z-50 lg:hidden">
        <div className="max-w-7xl mx-auto flex items-center gap-3">
          <div className="flex-1">
            <div className="text-xs text-muted-foreground">Jami narx</div>
            <div className="text-base font-semibold text-foreground">
              {product.discount_price != null && product.discount_price !== ""
                ? formatPrice(product.discount_price)
                : formatPrice(product.price)}{" "}
              {"so'm"}
            </div>
          </div>
          <button
            onClick={handleAddToCart}
            disabled={addingToCart}
            className="flex-1 bg-primary text-primary-foreground font-semibold h-11 min-h-[44px] rounded-xl hover:bg-primary/90 active:scale-95 transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/20 touch-manipulation disabled:opacity-70 disabled:cursor-not-allowed"
          >
            <ShoppingCart className="h-5 w-5" />
            {addingToCart ? "Qo'shilmoqda..." : "Savatchaga"}
          </button>
        </div>
      </div>
    </div>
  )
}
