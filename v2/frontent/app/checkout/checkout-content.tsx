"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { TopBar } from "@/components/top-bar"
import { Header } from "@/components/header"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { getCartSessionId } from "@/lib/cart-session"
import { getCart } from "@/services/api/cartApi"
import { createOrder } from "@/services/api/orderApi"
import { formatPrice } from "@/lib/utils"
import type { CartItem } from "@/types/cart"

export function CheckoutContent() {
  const router = useRouter()
  const [items, setItems] = useState<CartItem[]>([])
  const [totalPrice, setTotalPrice] = useState("0")
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [sessionId, setSessionId] = useState<string | null>(null)

  useEffect(() => {
    const sid = getCartSessionId()
    if (!sid) {
      setLoading(false)
      return
    }
    setSessionId(sid)
    getCart(sid)
      .then((res) => {
        setItems(res.items)
        setTotalPrice(res.total_price)
      })
      .catch(() => setError("Savat yuklanmadi"))
      .finally(() => setLoading(false))
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const sid = sessionId || getCartSessionId()
    if (!sid) {
      setError("Savat topilmadi. Sahifani yangilab qaytadan urinib ko'ring.")
      return
    }
    if (!name.trim() || !phone.trim()) {
      setError("Ism va telefonni to'ldiring.")
      return
    }
    if (items.length === 0) {
      setError("Savatcha bo'sh. Avval mahsulot qo'shing.")
      return
    }
    setSubmitting(true)
    setError(null)
    try {
      await createOrder({ session_id: sid, name: name.trim(), phone: phone.trim() })
      router.push("/savatcha?ordered=1")
    } catch (e) {
      setError(e instanceof Error ? e.message : "Buyurtma yuborilmadi")
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-transparent">
        <TopBar />
        <Header />
        <main className="max-w-7xl mx-auto px-4 py-12 text-center text-muted-foreground">
          Yuklanmoqda...
        </main>
      </div>
    )
  }

  if (items.length === 0 && !error) {
    return (
      <div className="min-h-screen bg-transparent">
        <TopBar />
        <Header />
        <main className="max-w-7xl mx-auto px-4 py-12 text-center">
          <p className="text-muted-foreground mb-4">Savatchangiz bo&apos;sh.</p>
          <Button asChild>
            <a href="/">Bosh sahifaga</a>
          </Button>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-transparent">
      <TopBar />
      <Header />

      <main className="max-w-2xl mx-auto px-4 sm:px-6 py-6 sm:py-8 pb-24">
        <h1
          className="text-xl sm:text-2xl font-bold text-foreground mb-6"
          style={{ fontFamily: "var(--font-apple)" }}
        >
          Buyurtma berish
        </h1>

        <Card className="p-4 sm:p-6 mb-6">
          <div className="text-sm text-muted-foreground mb-2">
            Mahsulotlar soni: {items.length}
          </div>
          <div className="text-lg font-bold text-foreground">
            Jami: {formatPrice(totalPrice)} so&apos;m
          </div>
        </Card>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Ism</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ismingiz"
              className="mt-1"
              required
            />
          </div>
          <div>
            <Label htmlFor="phone">Telefon</Label>
            <Input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Telefon raqamingiz"
              className="mt-1"
              required
            />
          </div>
          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}
          <Button type="submit" className="w-full h-12" disabled={submitting}>
            {submitting ? "Yuborilmoqda..." : "Buyurtmani tasdiqlash"}
          </Button>
        </form>
      </main>
    </div>
  )
}
