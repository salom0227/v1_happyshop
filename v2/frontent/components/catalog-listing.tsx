"use client"

import { useState, useEffect, useCallback } from "react"
import { ChevronDown, Grid3X3, List, SlidersHorizontal } from "lucide-react"
import type { Product } from "@/types/product"
import { ProductCard } from "./product-card"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { getWishlist } from "@/services/api/wishlistApi"
import { getCartSessionId } from "@/lib/cart-session"

const filterBrands: { name: string; count: number }[] = []

const subcatLinks: string[] = []

interface CatalogListingProps {
  slug: string
  products: Product[]
  categoryName: string
}

type SortMode = "best" | "new" | "cheap" | "expensive"

export function CatalogListing({ slug, products, categoryName }: CatalogListingProps) {
  const [priceFrom, setPriceFrom] = useState("50 000")
  const [priceTo, setPriceTo] = useState("1 000 000")
  const [selectedBrands, setSelectedBrands] = useState<string[]>([])
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [sortMode, setSortMode] = useState<SortMode>("best")
  const [filterOpen, setFilterOpen] = useState(false)
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

  const toggleBrand = (brand: string) => {
    setSelectedBrands((prev) =>
      prev.includes(brand)
        ? prev.filter((b) => b !== brand)
        : [...prev, brand]
    )
  }

  const FilterSidebar = () => (
    <>
      <div className="mb-6 bg-card rounded-2xl p-4 border border-border/50">
        <button className="flex items-center justify-between w-full text-sm font-bold text-foreground mb-3">
          {"Narxi (so'm)"}
          <ChevronDown className="h-4 w-4" />
        </button>
        <div className="flex items-center gap-2 mb-3">
          <div className="flex-1 min-w-0">
            <label className="text-[10px] text-muted-foreground">dan</label>
            <input
              type="text"
              value={priceFrom}
              onChange={(e) => setPriceFrom(e.target.value)}
              className="w-full border border-border rounded-lg px-2 py-2.5 text-sm bg-background"
            />
          </div>
          <div className="flex-1 min-w-0">
            <label className="text-[10px] text-muted-foreground">gacha</label>
            <input
              type="text"
              value={priceTo}
              onChange={(e) => setPriceTo(e.target.value)}
              className="w-full border border-border rounded-lg px-2 py-2.5 text-sm bg-background"
            />
          </div>
        </div>
        <div className="relative h-1.5 bg-border rounded-full">
          <div className="absolute left-[5%] right-[10%] h-full bg-primary rounded-full" />
          <div className="absolute left-[5%] top-1/2 -translate-y-1/2 w-4 h-4 bg-primary rounded-full border-2 border-card shadow cursor-pointer" />
          <div className="absolute right-[10%] top-1/2 -translate-y-1/2 w-4 h-4 bg-primary rounded-full border-2 border-card shadow cursor-pointer" />
        </div>
      </div>
    </>
  )

  const sortedProducts = [...products].sort((a, b) => {
    switch (sortMode) {
      case "best": {
        const aScore = (a.sold_count ?? 0) + (a.favorite_count ?? 0)
        const bScore = (b.sold_count ?? 0) + (b.favorite_count ?? 0)
        return bScore - aScore
      }
      case "new":
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      case "cheap": {
        const aPrice = Number(a.discount_price || a.price.toString().replace(/\s/g, "")) || 0
        const bPrice = Number(b.discount_price || b.price.toString().replace(/\s/g, "")) || 0
        return aPrice - bPrice
      }
      case "expensive": {
        const aPrice = Number(a.discount_price || a.price.toString().replace(/\s/g, "")) || 0
        const bPrice = Number(b.discount_price || b.price.toString().replace(/\s/g, "")) || 0
        return bPrice - aPrice
      }
      default:
        return 0
    }
  })

  return (
    <div>
      <h1
        className="text-xl sm:text-2xl font-bold text-foreground mb-1 sm:mb-2"
        style={{ fontFamily: "var(--font-apple)" }}
      >
        {categoryName}
      </h1>
      <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4">
        {products.length} ta mahsulot topildi
      </p>

      {/* Subcat Links removed */}

      <div className="flex gap-4 sm:gap-6">
        {/* Product Grid */}
        <div className="flex-1 min-w-0">
          {/* Sort & View Controls */}
          <div className="flex flex-wrap items-center justify-between gap-2 mb-3 sm:mb-4 bg-card rounded-xl sm:rounded-2xl px-3 sm:px-4 py-2.5 sm:py-3 border border-border/50">
            <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto scrollbar-hide">
              <button
                onClick={() => setSortMode("best")}
                className={`text-xs sm:text-sm whitespace-nowrap py-2 font-medium ${
                  sortMode === "best" ? "text-primary" : "text-muted-foreground hover:text-primary transition-colors"
                }`}
              >
                Xit
              </button>
              <button
                onClick={() => setSortMode("new")}
                className={`text-xs sm:text-sm whitespace-nowrap py-2 font-medium ${
                  sortMode === "new" ? "text-primary" : "text-muted-foreground hover:text-primary transition-colors"
                }`}
              >
                Yangi qo&apos;yilgan
              </button>
              <button
                onClick={() => setSortMode("cheap")}
                className={`text-xs sm:text-sm whitespace-nowrap py-2 font-medium ${
                  sortMode === "cheap" ? "text-primary" : "text-muted-foreground hover:text-primary transition-colors"
                }`}
              >
                Arzon
              </button>
              <button
                onClick={() => setSortMode("expensive")}
                className={`text-xs sm:text-sm whitespace-nowrap py-2 font-medium ${
                  sortMode === "expensive" ? "text-primary" : "text-muted-foreground hover:text-primary transition-colors"
                }`}
              >
                Qimmat
              </button>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setViewMode("grid")}
                className={`w-9 h-9 sm:w-8 sm:h-8 min-h-[44px] min-w-[44px] sm:min-h-0 sm:min-w-0 flex items-center justify-center rounded-lg touch-manipulation ${
                  viewMode === "grid" ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"
                }`}
              >
                <Grid3X3 className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`w-9 h-9 sm:w-8 sm:h-8 min-h-[44px] min-w-[44px] sm:min-h-0 sm:min-w-0 flex items-center justify-center rounded-lg touch-manipulation ${
                  viewMode === "list" ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"
                }`}
              >
                <List className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Products Grid */}
          <div
            className={
              viewMode === "grid"
                ? "grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4"
                : "flex flex-col gap-3 sm:gap-4"
            }
          >
            {sortedProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                isInWishlist={wishlistIds.has(product.id)}
                onWishlistChange={loadWishlist}
              />
            ))}
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-center gap-2 mt-6 sm:mt-8">
            {[1, 2].map((page) => (
              <button
                key={page}
                className={`w-10 h-10 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl text-sm font-medium transition-colors touch-manipulation ${
                  page === 1
                    ? "bg-primary text-primary-foreground"
                    : "bg-card text-foreground border border-border hover:bg-primary/10"
                }`}
              >
                {page}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile Filter Sheet */}
      <Sheet open={filterOpen} onOpenChange={setFilterOpen}>
        <SheetContent side="left" className="w-full max-w-[300px] overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Filtr</SheetTitle>
          </SheetHeader>
          <div className="pt-4" onClick={() => {}}>
            <FilterSidebar />
          </div>
          <button
            onClick={() => setFilterOpen(false)}
            className="w-full mt-4 py-3 bg-primary text-primary-foreground rounded-xl font-semibold"
          >
            Ko&apos;rsatish
          </button>
        </SheetContent>
      </Sheet>
    </div>
  )
}
