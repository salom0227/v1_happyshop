"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { Search, Menu, X, ChevronRight, Gift, Home, Tags, Phone, ShoppingCart, FileText } from "lucide-react"
import { FlyingIcons } from "@/components/flying-icons"
import { Sheet, SheetContent, SheetTitle, SheetHeader } from "@/components/ui/sheet"
import { ThemeToggle } from "@/components/theme-toggle"
import { getCategoriesCached } from "@/lib/categories-client"
import type { Category } from "@/types/category"
import { ProductSearchBar } from "@/components/product-search-bar"
import { useCartCount } from "@/contexts/cart-count-context"

function LogoIcon() {
  return (
    <Link href="/" className="flex items-center gap-1 shrink-0 min-h-[40px] items-center">
      <Gift className="h-5 w-5 sm:h-6 sm:w-6 text-primary shrink-0" />
      <span
        className="text-lg sm:text-xl font-black tracking-tight text-foreground leading-none"
        style={{ fontFamily: "var(--font-apple)" }}
      >
        Happy
      </span>
      <span
        className="text-lg sm:text-xl font-black text-primary leading-none"
        style={{ fontFamily: "var(--font-apple)" }}
      >
        Shop
      </span>
    </Link>
  )
}

export function Header() {
  const { cartCount } = useCartCount()
  const [categories, setCategories] = useState<Category[]>([])
  const [categoriesError, setCategoriesError] = useState(false)
  const [catalogOpen, setCatalogOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [mobileCatalogOpen, setMobileCatalogOpen] = useState(false)
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const catalogRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const threshold = 24
    const onScroll = () => setScrolled(window.scrollY > threshold)
    onScroll() // initial
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  useEffect(() => {
    getCategoriesCached()
      .then((data) => {
        if (data.length > 0) {
          setCategories(data)
        } else {
          // Fallback: statik kategoriyalar (header katalog bo'sh qolmasligi uchun)
          setCategories([
            { id: 1, name: "Gullar va buketlar", slug: "gullar-va-buketlar", image: null },
            { id: 2, name: "Sovg'a to'plamlari", slug: "sovga-toplamlari", image: null },
            { id: 3, name: "Shirinliklar", slug: "shirinliklar", image: null },
            { id: 4, name: "O'yinchoqlar", slug: "oyinchoqlar", image: null },
            { id: 5, name: "Qo'l ishlari", slug: "qol-ishlari", image: null },
            { id: 6, name: "Shamlar", slug: "shamlar", image: null },
          ] as any)
        }
      })
      .catch(() => setCategoriesError(true))
  }, [])

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (catalogRef.current && !catalogRef.current.contains(event.target as Node)) {
        setCatalogOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const navCategories = [
    ...categories.map((c) => ({ name: c.name.toUpperCase(), slug: c.slug, highlight: false })),
    { name: "Kim uchun sovg'a olamiz", slug: "aksiyalar", highlight: true },
  ]

  return (
    <header
      className={`header-scroll-over sticky top-0 z-50 w-full rounded-b-2xl sm:rounded-b-3xl transition-all duration-300 ease-out ${
        scrolled
          ? "backdrop-blur-xl bg-white/60 dark:bg-white/15 border border-white/20 shadow-xl"
          : "backdrop-blur-xl bg-white/25 dark:bg-white/10 border border-white/20 shadow-lg"
      }`}
    >
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-1.5 py-1.5 sm:py-0 sm:flex-row sm:items-center sm:gap-3 min-h-[50px] sm:h-[64px] overflow-visible">
        {/* Uchib yuruvchi dekorativ ikonkalar — xilma-xil xizmatlar */}
        <FlyingIcons count={8} variant="header" />
        {/* Top row: logo + catalog + quick actions */}
        <div className="flex w-full items-center justify-between gap-2 relative z-10">
          <div className="flex items-center gap-2">
            <LogoIcon />
            {/* Desktop catalog button+mega menu right next to logo */}
            <div ref={catalogRef} className="relative hidden lg:flex items-center gap-1">
              <button
                onClick={() => setCatalogOpen(!catalogOpen)}
                className="flex items-center gap-2 btn-primary font-semibold px-5 py-2.5 rounded-full"
                aria-label="Katalog"
              >
                {catalogOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                <span>Katalog</span>
              </button>

              {catalogOpen && (
                <div className="absolute top-full left-0 mt-2 rounded-2xl border border-border/60 z-50 animate-fade-in min-w-[280px] py-2 bg-background shadow-xl">
                  <div className="w-[280px] py-2">
                    {categories.length === 0 && !categoriesError && (
                      <div className="px-4 py-3 text-sm text-muted-foreground">Yuklanmoqda...</div>
                    )}
                    {categoriesError && (
                      <div className="px-4 py-3 text-sm text-muted-foreground">Kategoriyalar yuklanmadi</div>
                    )}
                    {categories.map((cat) => (
                      <Link
                        key={cat.id}
                        href={`/catalog/${cat.slug}`}
                        onClick={() => setCatalogOpen(false)}
                        className="w-full flex items-center justify-between px-4 py-2.5 text-sm text-left text-foreground hover:bg-secondary transition-colors"
                      >
                        <span>{cat.name}</span>
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <Link
              href="/savatcha"
              className="relative flex items-center justify-center w-9 h-9 rounded-full glass-btn-float text-foreground touch-manipulation"
              aria-label="Savatcha"
            >
              <ShoppingCart className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] flex items-center justify-center rounded-full bg-primary text-primary-foreground text-[10px] font-bold px-1">
                  {cartCount > 99 ? "99+" : cartCount}
                </span>
              )}
            </Link>
            <button
              onClick={() => setMobileSearchOpen(true)}
              className="lg:hidden flex items-center justify-center w-9 h-9 rounded-full glass-btn-float text-foreground touch-manipulation"
              aria-label="Qidirish"
            >
              <Search className="h-5 w-5" />
            </button>
            <ThemeToggle />
            <Link
              href="/aloqa"
              className="hidden sm:flex items-center justify-center w-9 h-9 rounded-full glass-btn-float text-foreground hover:bg-white/30 dark:hover:bg-white/15 transition-colors"
              aria-label="Aloqa"
            >
              <Phone className="h-5 w-5 text-foreground" />
            </Link>
          </div>
        </div>

        {/* Second row: desktop search */}
        <div className="flex w-full items-center gap-2 sm:gap-3 relative z-10">
          <div className="hidden lg:block flex-1 relative min-w-0">
            <ProductSearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Gullar, sovg'alar, qo'l ishlari..."
              variant="desktop"
            />
          </div>
        </div>
      </div>

      {/* Mobile Catalog Sheet */}
      <Sheet open={mobileCatalogOpen} onOpenChange={setMobileCatalogOpen}>
        <SheetContent side="left" className="w-full max-w-[320px] sm:max-w-sm overflow-y-auto p-0">
          <SheetHeader className="border-b border-border p-4">
            <SheetTitle>Katalog</SheetTitle>
          </SheetHeader>
          <div className="py-2">
            {categories.length === 0 && !categoriesError && (
              <div className="px-4 py-3 text-sm text-muted-foreground">Yuklanmoqda...</div>
            )}
            {categories.map((cat) => (
              <div key={cat.id} className="border-b border-border/50 last:border-0">
                <Link
                  href={`/catalog/${cat.slug}`}
                  onClick={() => setMobileCatalogOpen(false)}
                  className="flex items-center justify-between px-4 py-3.5 text-foreground hover:bg-secondary active:bg-secondary transition-colors"
                >
                  <span className="font-medium">{cat.name}</span>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </Link>
              </div>
            ))}
            <Link
              href="/aksiyalar"
              onClick={() => setMobileCatalogOpen(false)}
              className="flex items-center justify-between px-4 py-3.5 text-primary font-medium hover:bg-primary/10 active:bg-primary/10"
            >
              Kim uchun sovg'a olamiz
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        </SheetContent>
      </Sheet>

      {/* Mobile Search Sheet — katalog uslubida qidiruv natijalari */}
      <Sheet open={mobileSearchOpen} onOpenChange={setMobileSearchOpen}>
        <SheetContent side="top" className="h-[85vh] max-h-[85vh] flex flex-col rounded-b-2xl overflow-hidden p-0 gap-0">
          <SheetHeader className="px-4 pt-4 pb-2 shrink-0">
            <SheetTitle className="sr-only">Qidirish</SheetTitle>
          </SheetHeader>
          <div className="flex-1 flex flex-col min-h-0 px-4 pb-4 overflow-hidden">
            <ProductSearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              onSelect={() => setMobileSearchOpen(false)}
              placeholder="Gullar, sovg'alar, qo'l ishlari..."
              variant="mobile"
              autoFocus
            />
          </div>
        </SheetContent>
      </Sheet>

      {/* Nav Categories — MobileNav bilan bir xil: bg-card/95, backdrop-blur, border-t */}
      <div className="nav-glass-window rounded-b-2xl sm:rounded-b-3xl bg-card/95 backdrop-blur border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-0.5">
          <nav className="flex items-center gap-0 overflow-x-auto scrollbar-hide -mb-px" aria-label="Kategoriyalar">
            {navCategories.map((cat) => (
              <Link
                key={cat.slug}
                href={cat.slug === "aksiyalar" ? "/aksiyalar" : `/catalog/${cat.slug}`}
                className={`whitespace-nowrap px-2.5 py-0.5 text-[11px] font-medium transition-colors shrink-0 flex items-center rounded-md hover:bg-white/25 dark:hover:bg-white/15 ${
                  cat.highlight
                    ? "text-primary hover:text-primary/90"
                    : "text-foreground hover:text-primary"
                }`}
              >
                {cat.name}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* Mobile full-screen menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[60] bg-background/95 backdrop-blur-sm lg:hidden">
          <div className="flex h-full flex-col">
            <div className="flex items-center justify-between px-4 pt-4 pb-2">
              <LogoIcon />
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="w-9 h-9 flex items-center justify-center rounded-xl border border-border bg-card text-foreground hover:bg-secondary transition-colors"
                aria-label="Menyuni yopish"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <nav className="flex-1 px-4 pb-8 pt-4 space-y-2 overflow-y-auto">
              <Link
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between rounded-2xl bg-card px-4 py-3 text-base font-semibold text-foreground active:scale-95 transition-all min-h-[56px]"
              >
                <span className="flex items-center gap-3">
                  <Home className="h-5 w-5 text-primary" />
                  Bosh sahifa
                </span>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </Link>
              <Link
                href="/catalog/gullar"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between rounded-2xl bg-card px-4 py-3 text-base font-semibold text-foreground active:scale-95 transition-all min-h-[56px]"
              >
                <span className="flex items-center gap-3">
                  <Menu className="h-5 w-5 text-primary" />
                  Katalog
                </span>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </Link>
              <Link
                href="#kategoriyalar"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between rounded-2xl bg-card px-4 py-3 text-base font-semibold text-foreground active:scale-95 transition-all min-h-[56px]"
              >
                <span className="flex items-center gap-3">
                  <Tags className="h-5 w-5 text-primary" />
                  Kategoriyalar
                </span>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </Link>
              <Link
                href="/aksiyalar"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between rounded-2xl bg-card px-4 py-3 text-base font-semibold text-foreground active:scale-95 transition-all min-h-[56px]"
              >
                <span className="flex items-center gap-3">
                  <Gift className="h-5 w-5 text-primary" />
                  Kim uchun sovg'a olamiz
                </span>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </Link>
              <Link
                href="/savatcha"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between rounded-2xl bg-card px-4 py-3 text-base font-semibold text-foreground active:scale-95 transition-all min-h-[56px]"
              >
                <span className="flex items-center gap-3">
                  <ShoppingCart className="h-5 w-5 text-primary" />
                  Savatcha
                  {cartCount > 0 && (
                    <span className="min-w-[22px] h-[22px] flex items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">
                      {cartCount > 99 ? "99+" : cartCount}
                    </span>
                  )}
                </span>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </Link>
              <Link
                href="/xizmatlar"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between rounded-2xl bg-card px-4 py-3 text-base font-semibold text-foreground active:scale-95 transition-all min-h-[56px]"
              >
                <span className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-primary" />
                  Xizmatlar
                </span>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </Link>
              <Link
                href="#contact"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between rounded-2xl bg-card px-4 py-3 text-base font-semibold text-foreground active:scale-95 transition-all min-h-[56px]"
              >
                <span className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-primary" />
                  Aloqa
                </span>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </Link>
            </nav>
          </div>
        </div>
      )}
    </header>
  )
}
