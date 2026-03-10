"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState, useEffect } from "react"
import { Home, Grid3X3, Heart, ShoppingCart, Phone, ChevronRight } from "lucide-react"
import { getCategoriesCached } from "@/lib/categories-client"
import type { Category } from "@/types/category"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { useCartCount } from "@/contexts/cart-count-context"

export function MobileNav() {
  const pathname = usePathname()
  const { cartCount } = useCartCount()
  const [catalogOpen, setCatalogOpen] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])

  useEffect(() => {
    getCategoriesCached().then(setCategories).catch(() => {})
  }, [])

  // Hide on desktop only (show on product page so user sees cart count)
  return (
    <>
      <nav className="fixed bottom-0 left-0 w-full min-h-[64px] pt-2 pb-4 rounded-t-3xl border-t border-white/20 dark:border-white/10 bg-card/95 backdrop-blur-xl flex items-center justify-around z-40 md:hidden shadow-[0_-8px_32px_rgba(0,0,0,0.08)] dark:shadow-[0_-8px_32px_rgba(0,0,0,0.25)]">
        <button
          type="button"
          onClick={() => setCatalogOpen(true)}
          className="flex flex-col items-center justify-center gap-1 text-xs font-medium min-w-[72px] min-h-[48px] rounded-2xl active:scale-95 transition-transform touch-manipulation text-foreground"
          aria-label="Katalog"
        >
          <Grid3X3 className="h-6 w-6" />
          <span>Katalog</span>
        </button>
        <Link
          href="/"
          className="flex flex-col items-center justify-center gap-1 text-xs font-medium min-w-[72px] min-h-[48px] rounded-2xl active:scale-95 transition-transform touch-manipulation text-foreground"
        >
          <Home className="h-6 w-6" />
          <span>Bosh sahifa</span>
        </Link>
        <Link
          href="/sevimlilar"
          className="flex flex-col items-center justify-center gap-1 text-xs font-medium min-w-[72px] min-h-[48px] rounded-2xl active:scale-95 transition-transform touch-manipulation text-foreground"
          aria-label="Sevimli mahsulotlar"
        >
          <Heart className="h-6 w-6" />
          <span>Sevimlilar</span>
        </Link>
        <Link
          href="/savatcha"
          className="relative flex flex-col items-center justify-center gap-1 text-xs font-medium min-w-[72px] min-h-[48px] rounded-2xl active:scale-95 transition-transform touch-manipulation text-foreground"
        >
          <ShoppingCart className="h-6 w-6" />
          <span>Savatcha</span>
          {cartCount > 0 && (
            <span className="absolute -top-0.5 right-3 sm:right-4 min-w-[18px] h-[18px] flex items-center justify-center rounded-full bg-primary text-primary-foreground text-[10px] font-bold px-1">
              {cartCount > 99 ? "99+" : cartCount}
            </span>
          )}
        </Link>
        <Link
          href="/aloqa"
          className="flex flex-col items-center justify-center gap-1 text-xs font-medium min-w-[72px] min-h-[48px] rounded-2xl active:scale-95 transition-transform touch-manipulation text-foreground"
        >
          <Phone className="h-6 w-6" />
          <span>Aloqa</span>
        </Link>
      </nav>

      <Sheet open={catalogOpen} onOpenChange={setCatalogOpen}>
        <SheetContent side="left" className="w-full max-w-[320px] sm:max-w-sm overflow-y-auto p-0">
          <SheetHeader className="border-b border-border p-4">
            <SheetTitle>Katalog</SheetTitle>
          </SheetHeader>
          <div className="py-2">
            {categories.map((cat) => (
              <div key={cat.id} className="border-b border-border/50 last:border-0">
                <Link
                  href={`/catalog/${cat.slug}`}
                  onClick={() => setCatalogOpen(false)}
                  className="flex items-center justify-between px-4 py-3.5 text-foreground hover:bg-secondary active:bg-secondary transition-colors"
                >
                  <span className="font-medium">{cat.name}</span>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </Link>
              </div>
            ))}
          </div>
        </SheetContent>
      </Sheet>
    </>
  )
}

