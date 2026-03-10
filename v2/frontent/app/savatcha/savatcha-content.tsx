"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { TopBar } from "@/components/top-bar"
import { Header } from "@/components/header"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { motion } from "motion/react"
import { ShoppingCart, ArrowRight, Minus, Plus, Trash2, CheckCircle2, Sparkles } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { getCartSessionId, resetCartSession } from "@/lib/cart-session"
import { getCart, updateCartItem, removeFromCart } from "@/services/api/cartApi"
import { createOrder } from "@/services/api/orderApi"
import type { CartItem as CartItemType } from "@/types/cart"
import { formatPrice } from "@/lib/utils"
import { useCartCount } from "@/contexts/cart-count-context"

function CartItemRow({
  item,
  onUpdate,
  onRemove,
  loading,
}: {
  item: CartItemType
  onUpdate: (productId: number, quantity: number) => void
  onRemove: (productId: number) => void
  loading: boolean
}) {
  const qty = item.quantity
  const lineTotal = typeof item.line_total === "string" ? parseFloat(item.line_total) : item.line_total
  const price = typeof item.product.price === "string" ? parseFloat(item.product.price) : item.product.price

  return (
    <div className="flex gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl border border-border bg-card">
      <Link
        href={`/product/${item.product.slug}`}
        className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-lg overflow-hidden shrink-0 bg-secondary/50"
      >
        <Image
          src={item.product.image || "https://placehold.co/200?text=Mahsulot"}
          alt={item.product.title}
          fill
          sizes="96px"
          className="object-cover"
          unoptimized={item.product.image?.startsWith("http")}
        />
      </Link>
      <div className="flex-1 min-w-0 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <Link
            href={`/product/${item.product.slug}`}
            className="font-medium text-foreground hover:text-primary line-clamp-2"
          >
            {item.product.title}
          </Link>
          <p className="text-sm font-semibold text-foreground mt-0.5">
            {formatPrice(price)} so&apos;m × {qty}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center border border-border rounded-lg overflow-hidden">
            <button
              onClick={() => onUpdate(item.product.id, Math.max(1, qty - 1))}
              disabled={loading || qty <= 1}
              className="w-9 h-9 flex items-center justify-center hover:bg-secondary disabled:opacity-50"
              aria-label="Kamaytirish"
            >
              <Minus className="h-4 w-4" />
            </button>
            <span className="w-8 text-center text-sm font-medium">{qty}</span>
            <button
              onClick={() => onUpdate(item.product.id, qty + 1)}
              disabled={loading}
              className="w-9 h-9 flex items-center justify-center hover:bg-secondary"
              aria-label="Oshirish"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
          <button
            onClick={() => onRemove(item.product.id)}
            disabled={loading}
            className="w-9 h-9 flex items-center justify-center text-destructive hover:bg-destructive/10 rounded-lg"
            aria-label="O'chirish"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
        <div className="text-sm font-semibold text-foreground sm:text-right">
          {formatPrice(lineTotal)} so&apos;m
        </div>
      </div>
    </div>
  )
}

export function SavatchaContent() {
  const router = useRouter()
  const { refreshCartCount } = useCartCount()
  const searchParams = useSearchParams()
  const ordered = searchParams.get("ordered") === "1"
  const [items, setItems] = useState<CartItemType[]>([])
  const [totalPrice, setTotalPrice] = useState("0")
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [orderModalOpen, setOrderModalOpen] = useState(false)
  const [orderName, setOrderName] = useState("")
  const [orderPhone, setOrderPhone] = useState("")
  const [orderAddress, setOrderAddress] = useState("")
  const [orderSubmitting, setOrderSubmitting] = useState(false)
  const [orderError, setOrderError] = useState<string | null>(null)

  const loadCart = async () => {
    const sessionId = getCartSessionId()
    if (!sessionId) {
      setLoading(false)
      return
    }
    try {
      setError(null)
      const res = await getCart(sessionId)
      setItems(res.items)
      setTotalPrice(res.total_price)
    } catch (e) {
      setError(e instanceof Error ? e.message : "Savat yuklanmadi")
      setItems([])
      setTotalPrice("0")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadCart()
  }, [])

  const handleUpdate = async (productId: number, quantity: number) => {
    const sessionId = getCartSessionId()
    if (!sessionId) return
    setActionLoading(true)
    try {
      const res = await updateCartItem(sessionId, productId, quantity)
      setItems(res.items)
      setTotalPrice(res.total_price)
      await refreshCartCount()
    } catch (e) {
      setError(e instanceof Error ? e.message : "Xatolik")
    } finally {
      setActionLoading(false)
    }
  }

  const handleRemove = async (productId: number) => {
    const sessionId = getCartSessionId()
    if (!sessionId) return
    setActionLoading(true)
    try {
      const res = await removeFromCart(sessionId, productId)
      setItems(res.items)
      setTotalPrice(res.total_price)
      await refreshCartCount()
    } catch (e) {
      setError(e instanceof Error ? e.message : "Xatolik")
    } finally {
      setActionLoading(false)
    }
  }

  const handleOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const sessionId = getCartSessionId()
    if (!sessionId) {
      setOrderError("Savat session topilmadi. Sahifani yangilang.")
      return
    }
    const name = orderName.trim()
    const phone = orderPhone.trim()
    const address = orderAddress.trim()
    if (!name || !phone) {
      setOrderError("Ism va telefon raqamini kiriting.")
      return
    }
    setOrderError(null)
    setOrderSubmitting(true)
    try {
      await createOrder({
        session_id: sessionId,
        name,
        phone,
        delivery_address: address,
      })
      resetCartSession()
      setItems([])
      setTotalPrice("0")
      await refreshCartCount()
      setOrderModalOpen(false)
      setOrderName("")
      setOrderPhone("")
      setOrderAddress("")
      router.push("/savatcha?ordered=1")
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Buyurtma yuborishda xatolik"
      setOrderError(msg)
    } finally {
      setOrderSubmitting(false)
    }
  }

  const hasItems = items.length > 0

  return (
    <div className="min-h-screen bg-transparent">
      <TopBar />
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 pb-24">
        <h1
          className="text-xl sm:text-2xl font-bold text-foreground mb-3 sm:mb-4"
          style={{ fontFamily: "var(--font-apple)" }}
        >
          Savatcha
        </h1>

        {ordered && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 24, delay: 0.1 }}
            className="mb-6 sm:mb-8"
          >
            <Card className="overflow-hidden border-primary/30 bg-gradient-to-b from-primary/15 to-primary/5">
              <div className="relative py-8 sm:py-10 px-4 sm:px-6 flex flex-col items-center text-center">
                {/* Decorative sparkles */}
                <motion.div
                  initial={{ opacity: 0, rotate: -20 }}
                  animate={{ opacity: 1, rotate: 0 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                  className="absolute top-4 right-6 text-primary/40"
                >
                  <Sparkles className="h-6 w-6" />
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, rotate: 20 }}
                  animate={{ opacity: 1, rotate: 0 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                  className="absolute top-6 left-6 text-primary/40"
                >
                  <Sparkles className="h-5 w-5" />
                </motion.div>
                {/* Icon */}
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 15, delay: 0.2 }}
                  className="mb-4 rounded-full bg-primary/20 p-4"
                >
                  <CheckCircle2 className="h-14 w-14 sm:h-16 sm:w-16 text-primary" />
                </motion.div>
                {/* Title */}
                <motion.h2
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35, duration: 0.4 }}
                  className="text-xl sm:text-2xl font-bold text-foreground mb-2"
                  style={{ fontFamily: "var(--font-apple)" }}
                >
                  Xaridingiz uchun rahmat!
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.4 }}
                  className="text-sm sm:text-base text-muted-foreground max-w-sm"
                >
                  Buyurtmangiz qabul qilindi. Tez orada siz bilan bog&apos;lanamiz.
                </motion.p>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7 }}
                  className="mt-5"
                >
                  <Button asChild size="sm" variant="outline" className="rounded-full">
                    <Link href="/">
                      Bosh sahifaga
                      <ArrowRight className="h-4 w-4 ml-1.5" />
                    </Link>
                  </Button>
                </motion.div>
              </div>
            </Card>
          </motion.div>
        )}

        {loading ? (
          <div className="py-12 text-center text-muted-foreground">Yuklanmoqda...</div>
        ) : error ? (
          <Card className="py-6 px-4 text-center">
            <p className="text-destructive mb-2">{error}</p>
            <Button variant="outline" onClick={() => loadCart()}>
              Qayta urinish
            </Button>
          </Card>
        ) : !hasItems ? (
          <Card className="py-8 px-4 sm:px-6 flex flex-col items-center justify-center text-center gap-3 sm:gap-4">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-primary/10 flex items-center justify-center mb-1">
              <ShoppingCart className="h-6 w-6 sm:h-7 sm:w-7 text-primary" />
            </div>
            <p className="text-sm sm:text-base font-semibold text-foreground">
              Savatchangiz hozircha bo&apos;sh
            </p>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-sm">
              Sevimli gullar, sovg&apos;alar va qo&apos;l ishlari mahsulotlarini savatchaga
              qo&apos;shing va bu yerda ko&apos;rishingiz mumkin bo&apos;ladi.
            </p>
            <Button asChild className="mt-1 h-11 min-h-[44px] px-5">
              <Link href="/">
                Sovg&apos;a tanlash
                <ArrowRight className="h-4 w-4 ml-1.5" />
              </Link>
            </Button>
          </Card>
        ) : (
          <div className="space-y-4 sm:space-y-6">
            <div className="space-y-3">
              {items.map((item) => (
                <CartItemRow
                  key={item.id}
                  item={item}
                  onUpdate={handleUpdate}
                  onRemove={handleRemove}
                  loading={actionLoading}
                />
              ))}
            </div>
            <Card className="p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <span className="text-muted-foreground">Jami: </span>
                <span className="text-xl font-bold text-foreground">
                  {formatPrice(totalPrice)} so&apos;m
                </span>
              </div>
              <Button
                onClick={() => setOrderModalOpen(true)}
                className="w-full sm:w-auto h-12 min-h-[44px] px-6"
              >
                Buyurtma berish
              </Button>
            </Card>

            <Dialog open={orderModalOpen} onOpenChange={setOrderModalOpen}>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Buyurtma berish</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleOrderSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="order-name">Ism</Label>
                    <Input
                      id="order-name"
                      value={orderName}
                      onChange={(e) => setOrderName(e.target.value)}
                      placeholder="Ismingiz"
                      className="h-11"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="order-phone">Telefon raqami</Label>
                    <Input
                      id="order-phone"
                      type="tel"
                      value={orderPhone}
                      onChange={(e) => setOrderPhone(e.target.value)}
                      placeholder="Telefon raqamingiz"
                      className="h-11"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="order-address">Mahsulot borish manzili</Label>
                    <Input
                      id="order-address"
                      value={orderAddress}
                      onChange={(e) => setOrderAddress(e.target.value)}
                      placeholder="Yetkazib berish manzili"
                      className="h-11"
                    />
                  </div>
                  {orderError && (
                    <p className="text-sm text-destructive">{orderError}</p>
                  )}
                  <DialogFooter>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setOrderModalOpen(false)}
                      disabled={orderSubmitting}
                    >
                      Bekor qilish
                    </Button>
                    <Button type="submit" disabled={orderSubmitting}>
                      {orderSubmitting ? "Yuborilmoqda..." : "Buyurtma berish"}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        )}
      </main>
    </div>
  )
}
