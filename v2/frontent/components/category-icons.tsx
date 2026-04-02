"use client"

import { useRef, useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion } from "motion/react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { getCategories } from "@/services/api"
import type { Category } from "@/types/category"

interface CategoryIconsProps {
  /** Serverdan kelgan kategoriyalar — berilsa client so'rov ketmaydi */
  initialCategories?: Category[]
}

export function CategoryIcons({ initialCategories }: CategoryIconsProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [categories, setCategories] = useState<Category[]>(initialCategories ?? [])
  const [error, setError] = useState(false)
  const [loaded, setLoaded] = useState(!!initialCategories?.length)

  useEffect(() => {
    if (initialCategories?.length) {
      setCategories(initialCategories)
      setLoaded(true)
      return
    }
    getCategories()
      .then((data) => {
        setCategories(data)
        setLoaded(true)
      })
      .catch(() => setError(true))
  }, [initialCategories])

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const amount = direction === "left" ? -200 : 200
      scrollRef.current.scrollBy({ left: amount, behavior: "smooth" })
    }
  }

  if (error) {
    return (
      <div className="py-6 text-center text-sm text-muted-foreground">
        Kategoriyalar yuklanmadi
      </div>
    )
  }

  if (categories.length === 0 && !loaded) {
    return (
      <div className="py-6 text-center text-sm text-muted-foreground">
        Yuklanmoqda...
      </div>
    )
  }

  return (
    <div className="relative">
      {/* Chapga/o'ngga scroll tugmalari — faqat katta ekranlarda */}
      <button
        type="button"
        onClick={() => scroll("left")}
        className="hidden sm:flex absolute -left-2 top-1/2 -translate-y-1/2 z-10 w-9 h-9 sm:w-10 sm:h-10 min-h-[36px] min-w-[36px] items-center justify-center bg-card border border-border rounded-full shadow-md hover:shadow-lg active:scale-95 transition-shadow touch-manipulation"
        aria-label="Chapga surish"
      >
        <ChevronLeft className="h-4 w-4 text-foreground" />
      </button>
      <button
        type="button"
        onClick={() => scroll("right")}
        className="hidden sm:flex absolute -right-2 top-1/2 -translate-y-1/2 z-10 w-9 h-9 sm:w-10 sm:h-10 min-h-[36px] min-w-[36px] items-center justify-center bg-card border border-border rounded-full shadow-md hover:shadow-lg active:scale-95 transition-shadow touch-manipulation"
        aria-label="O'ngga surish"
      >
        <ChevronRight className="h-4 w-4 text-foreground" />
      </button>

      <div
        ref={scrollRef}
        className="flex gap-4 px-2 py-1 justify-items-center overflow-x-auto scroll-smooth sm:gap-5 sm:px-12 sm:py-1.5 scrollbar-hide snap-x snap-mandatory"
      >
        {categories.map((cat) => (
          <motion.div
            key={cat.slug}
            className="flex-shrink-0 snap-start"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300, damping: 22 }}
          >
            <Link
              href={`/catalog/${cat.slug}`}
              className="flex flex-col items-center gap-2 sm:gap-3 p-4 sm:p-5 min-w-[130px] sm:min-w-[170px] rounded-2xl sm:rounded-3xl touch-manipulation block bg-white/10 dark:bg-white/5 backdrop-blur-xl border border-white/20 dark:border-white/10 shadow-sm hover:shadow-md active:scale-[0.98] transition-shadow duration-300"
            >
              <motion.div
                className="relative w-[110px] h-[110px] sm:w-[130px] sm:h-[130px] overflow-hidden rounded-2xl bg-white/20 dark:bg-white/10 ring-1 ring-white/20"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
              >
                {cat.image ? (
                  <Image
                    src={cat.image}
                    alt={cat.name}
                    fill
                    sizes="(max-width:768px) 110px, 140px"
                    loading="lazy"
                    className="object-cover"
                    unoptimized={cat.image?.startsWith("http")}
                  />
                ) : (
                  <span className="absolute inset-0 flex items-center justify-center text-3xl sm:text-4xl">📦</span>
                )}
              </motion.div>
              <span className="text-[11px] sm:text-xs font-semibold text-foreground text-center leading-tight">
                {cat.name}
              </span>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
