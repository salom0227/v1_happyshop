"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Search, Loader2 } from "lucide-react"
import { searchProducts } from "@/services/api/productApi"
import type { SearchProductResult } from "@/types/product"
import { cn } from "@/lib/utils"

const DEBOUNCE_MS = 300
const MIN_QUERY_LENGTH = 2

export interface ProductSearchBarProps {
  value: string
  onChange: (value: string) => void
  onSelect?: () => void
  placeholder?: string
  className?: string
  inputClassName?: string
  /** Desktop: inline bar with dropdown. Mobile: full-width in sheet. */
  variant?: "desktop" | "mobile"
  autoFocus?: boolean
}

export function ProductSearchBar({
  value,
  onChange,
  onSelect,
  placeholder = "Gullar, sovg'alar, qo'l ishlari...",
  className,
  inputClassName,
  variant = "desktop",
  autoFocus = false,
}: ProductSearchBarProps) {
  const router = useRouter()
  const [debouncedQuery, setDebouncedQuery] = useState("")
  const [results, setResults] = useState<SearchProductResult[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const listRef = useRef<HTMLUListElement>(null)

  // Debounce input
  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(value.trim()), DEBOUNCE_MS)
    return () => clearTimeout(t)
  }, [value])

  // Fetch when debounced query meets minimum length
  useEffect(() => {
    if (debouncedQuery.length < MIN_QUERY_LENGTH) {
      setResults([])
      setDropdownOpen(false)
      return
    }
    let cancelled = false
    setLoading(true)
    setDropdownOpen(true)
    setSelectedIndex(0)
    searchProducts(debouncedQuery)
      .then((data) => {
        if (!cancelled) {
          setResults(Array.isArray(data) ? data : [])
        }
      })
      .catch(() => {
        if (!cancelled) setResults([])
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [debouncedQuery])

  const showDropdown = value.trim().length >= MIN_QUERY_LENGTH && dropdownOpen
  const itemCount = results.length

  const handleSelect = useCallback(
    (slug: string) => {
      onChange("")
      setDropdownOpen(false)
      setResults([])
      onSelect?.()
      router.push(`/product/${slug}`)
    },
    [onChange, onSelect, router]
  )

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!showDropdown) {
        if (e.key === "Escape") onChange("")
        return
      }
      switch (e.key) {
        case "ArrowDown":
          e.preventDefault()
          setSelectedIndex((i) => (i < itemCount - 1 ? i + 1 : 0))
          break
        case "ArrowUp":
          e.preventDefault()
          setSelectedIndex((i) => (i > 0 ? i - 1 : itemCount - 1))
          break
        case "Enter":
          e.preventDefault()
          if (itemCount > 0 && results[selectedIndex]) {
            handleSelect(results[selectedIndex].slug)
          }
          break
        case "Escape":
          e.preventDefault()
          setDropdownOpen(false)
          onChange("")
          break
        default:
          break
      }
    },
    [showDropdown, itemCount, results, selectedIndex, onChange, handleSelect]
  )

  // Scroll selected item into view
  useEffect(() => {
    if (!showDropdown || !listRef.current) return
    const el = listRef.current.children[selectedIndex] as HTMLElement
    el?.scrollIntoView({ block: "nearest", behavior: "smooth" })
  }, [selectedIndex, showDropdown])

  // Close dropdown on click outside
  useEffect(() => {
    const onMouseDown = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener("mousedown", onMouseDown)
    return () => document.removeEventListener("mousedown", onMouseDown)
  }, [])

  const isMobile = variant === "mobile"
  const inputHeight = isMobile ? "h-12" : "h-11"
  const showResults = value.trim().length >= MIN_QUERY_LENGTH && dropdownOpen

  // Mobil: natijalar sheet ichida katalog grid, desktop: dropdown
  const mobileResultsArea = isMobile && showResults && (
    <div className="flex-1 min-h-0 flex flex-col mt-3 overflow-hidden border border-border/60 rounded-2xl bg-background">
      <div className="flex-1 min-h-0 overflow-y-auto p-2">
        {loading && results.length === 0 ? (
          <div className="flex items-center justify-center gap-2 py-12 text-muted-foreground" role="status">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span>Qidirilmoqda...</span>
          </div>
        ) : results.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">Mahsulot topilmadi</p>
        ) : (
          <div className="grid grid-cols-2 gap-3 pb-2">
            {results.map((product) => (
              <Link
                key={product.id}
                href={`/product/${product.slug}`}
                onClick={(e) => {
                  e.preventDefault()
                  handleSelect(product.slug)
                }}
                className="group block rounded-xl border border-border bg-background/80 overflow-hidden active:scale-[0.98] transition-transform"
              >
                <div className="relative aspect-square bg-muted/50">
                  {product.image ? (
                    <Image
                      src={product.image}
                      alt={product.title}
                      fill
                      sizes="(max-width: 461px) 50vw, 220px"
                      className="object-cover group-active:opacity-90"
                      unoptimized={product.image?.startsWith("http")}
                    />
                  ) : (
                    <span className="absolute inset-0 flex items-center justify-center text-3xl">📦</span>
                  )}
                </div>
                <div className="p-2.5">
                  <p className="text-xs font-medium text-foreground line-clamp-2 leading-tight">{product.title}</p>
                  <p className="mt-1 text-xs font-semibold text-primary">
                    {typeof product.price === "number"
                      ? `${product.price.toLocaleString()} so'm`
                      : `${Number(product.price).toLocaleString()} so'm`}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
      {results.length > 0 && (
        <Link
          href={`/qidiruv?q=${encodeURIComponent(value.trim())}`}
          onClick={() => {
            onChange("")
            setDropdownOpen(false)
            onSelect?.()
          }}
          className="shrink-0 border-t border-border/50 px-4 py-3.5 text-center text-sm font-semibold text-primary hover:bg-primary/10 transition-colors rounded-b-2xl"
        >
          Barcha natijalarni ko&apos;rish →
        </Link>
      )}
    </div>
  )

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative w-full",
        isMobile && "flex flex-col min-h-0 flex-1",
        className
      )}
    >
      <div className={cn("relative flex items-center", isMobile && "shrink-0")}>
        <input
          type="search"
          role="combobox"
          aria-expanded={showDropdown}
          aria-autocomplete="list"
          aria-controls={isMobile ? undefined : "search-results-list"}
          aria-activedescendant={!isMobile && itemCount > 0 ? `search-result-${selectedIndex}` : undefined}
          autoComplete="off"
          autoFocus={autoFocus}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => value.trim().length >= MIN_QUERY_LENGTH && setDropdownOpen(true)}
          placeholder={placeholder}
          className={cn(
            "w-full rounded-2xl border border-white/20 bg-white/20 dark:bg-white/10 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none transition-all backdrop-blur-sm",
            isMobile ? "pl-4 pr-4" : "pl-4 pr-12",
            inputHeight,
            inputClassName
          )}
        />
        {variant === "desktop" && (
          <span className="pointer-events-none absolute right-0 top-0 flex h-11 w-11 items-center justify-center text-muted-foreground">
            {loading ? (
              <Loader2 className="h-5 w-5 animate-spin" aria-hidden />
            ) : (
              <Search className="h-5 w-5" aria-hidden />
            )}
          </span>
        )}
      </div>

      {/* Desktop: dropdown */}
      {showDropdown && !isMobile && (
        <div className="absolute left-0 right-0 top-full z-50 mt-2 max-h-[min(85vh,520px)] overflow-hidden rounded-2xl border border-border/60 bg-background shadow-xl animate-fade-in flex flex-col">
          <ul
            id="search-results-list"
            ref={listRef}
            role="listbox"
            className="overflow-y-auto flex-1 min-h-0 py-1"
          >
            {loading && results.length === 0 ? (
              <li className="flex items-center justify-center gap-2 px-4 py-10 text-muted-foreground" role="status">
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Qidirilmoqda...</span>
              </li>
            ) : results.length === 0 ? (
              <li className="px-4 py-8 text-center text-sm text-muted-foreground" role="status">
                Mahsulot topilmadi
              </li>
            ) : (
              results.map((product, i) => (
                <li
                  key={product.id}
                  id={`search-result-${i}`}
                  role="option"
                  aria-selected={i === selectedIndex}
                  className={cn(
                    "flex items-center gap-3 border-b border-border/50 last:border-0 px-3 py-2 transition-colors",
                    i === selectedIndex && "bg-primary/10"
                  )}
                >
                  <Link
                    href={`/product/${product.slug}`}
                    onClick={(e) => {
                      e.preventDefault()
                      handleSelect(product.slug)
                    }}
                    onMouseEnter={() => setSelectedIndex(i)}
                    className="flex w-full items-center gap-3 rounded-xl p-2 sm:p-2.5 text-left hover:bg-white/10 dark:hover:bg-black/10 min-h-[72px] touch-manipulation"
                  >
                    <div className="relative h-14 w-14 sm:h-16 sm:w-16 shrink-0 overflow-hidden rounded-xl bg-muted">
                      {product.image ? (
                        <Image
                          src={product.image}
                          alt=""
                          fill
                          sizes="64px"
                          className="object-cover"
                          unoptimized={product.image?.startsWith("http")}
                        />
                      ) : (
                        <span className="absolute inset-0 flex items-center justify-center text-2xl">📦</span>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className="block truncate text-sm sm:text-base font-medium text-foreground">{product.title}</span>
                      <span className="text-xs sm:text-sm font-semibold text-primary mt-0.5">
                        {typeof product.price === "number"
                          ? `${product.price.toLocaleString()} so'm`
                          : `${Number(product.price).toLocaleString()} so'm`}
                      </span>
                    </div>
                  </Link>
                </li>
              ))
            )}
          </ul>
          {results.length > 0 && (
            <Link
              href={`/qidiruv?q=${encodeURIComponent(value.trim())}`}
              onClick={() => {
                onChange("")
                setDropdownOpen(false)
                onSelect?.()
              }}
              className="block border-t border-border/50 px-4 py-3.5 text-center text-sm font-semibold text-primary hover:bg-primary/10 transition-colors rounded-b-2xl"
            >
              Barcha natijalarni ko&apos;rish →
            </Link>
          )}
        </div>
      )}

      {/* Mobil: katalog grid sheet ichida */}
      {mobileResultsArea}
    </div>
  )
}
