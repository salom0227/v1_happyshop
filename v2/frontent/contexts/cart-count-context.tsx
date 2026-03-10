"use client"

import { createContext, useContext, useState, useCallback, useEffect } from "react"
import { getCartSessionId } from "@/lib/cart-session"
import { getCart } from "@/services/api/cartApi"

type CartCountContextValue = {
  cartCount: number
  refreshCartCount: () => void
}

const CartCountContext = createContext<CartCountContextValue | null>(null)

export function CartCountProvider({ children }: { children: React.ReactNode }) {
  const [cartCount, setCartCount] = useState(0)

  const refreshCartCount = useCallback(async () => {
    if (typeof window === "undefined") return
    const sessionId = getCartSessionId()
    if (!sessionId) {
      setCartCount(0)
      return
    }
    try {
      const res = await getCart(sessionId)
      const total = (res.items || []).reduce((sum, item) => sum + (item.quantity || 0), 0)
      setCartCount(total)
    } catch {
      setCartCount(0)
    }
  }, [])

  useEffect(() => {
    refreshCartCount()
  }, [refreshCartCount])

  return (
    <CartCountContext.Provider value={{ cartCount, refreshCartCount }}>
      {children}
    </CartCountContext.Provider>
  )
}

export function useCartCount(): CartCountContextValue {
  const ctx = useContext(CartCountContext)
  if (!ctx) {
    return {
      cartCount: 0,
      refreshCartCount: () => {},
    }
  }
  return ctx
}
