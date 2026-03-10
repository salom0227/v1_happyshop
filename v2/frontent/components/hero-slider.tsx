"use client"

import { useState, useEffect, useCallback } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"
import Link from "next/link"
import type { Banner } from "@/types/banner"
import { FlyingIcons } from "@/components/flying-icons"

interface HeroSliderProps {
  banners: Banner[]
}

export function HeroSlider({ banners }: HeroSliderProps) {
  const [current, setCurrent] = useState(0)

  const len = Math.max(1, banners.length)
  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % len)
  }, [len])

  const prev = useCallback(() => {
    setCurrent((prev) => (prev - 1 + len) % len)
  }, [len])

  useEffect(() => {
    if (banners.length === 0) return
    const timer = setInterval(next, 5000)
    return () => clearInterval(timer)
  }, [next])

  if (banners.length === 0) {
    return (
      <div className="relative w-full overflow-hidden rounded-3xl h-[240px] sm:h-[300px] md:h-[440px] glass-card flex items-center justify-center">
        <span className="text-muted-foreground text-sm">Bannerlar tez orada</span>
      </div>
    )
  }

  return (
    <div className="relative w-full overflow-hidden rounded-3xl hero-glow">
      <FlyingIcons count={8} variant="all" className="rounded-3xl" />
      <div
        className="flex transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {banners.map((banner) => {
          const href = banner.link && banner.link.trim() !== "" ? banner.link : `/banner/${banner.id}`
          return (
          <div
            key={banner.id}
            className="w-full flex-shrink-0 relative h-[200px] sm:h-[260px] md:h-[360px]"
          >
            <Image
              src={banner.image}
              alt={banner.title}
              fill
              priority={banner.id === banners[0].id}
              loading={banner.id === banners[0].id ? undefined : "lazy"}
              sizes="(max-width:768px) 100vw, (max-width:1200px) 100vw, 1200px"
              className="object-cover"
              unoptimized={banner.image.startsWith("http")}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#1a1028]/80 via-[#1a1028]/40 to-transparent flex items-center">
              <div className="pl-4 pr-4 sm:pl-8 md:pl-16 max-w-lg relative z-10">
                <h2
                  className="text-2xl sm:text-3xl md:text-5xl font-bold text-white mb-2 sm:mb-3 text-balance leading-tight font-heading"
                  style={{ fontFamily: "var(--font-apple)" }}
                >
                  {banner.title}
                </h2>
                <p className="text-sm sm:text-base md:text-lg text-white/90 mb-4 sm:mb-6 leading-relaxed">
                  {banner.subtitle}
                </p>
                <Link
                  href={href}
                  className="btn btn-primary inline-flex items-center justify-center font-semibold px-2 py-1 sm:px-3 sm:py-1.5 rounded-full text-[10px] sm:text-[11px] min-h-[28px] touch-manipulation"
                >
                  {banner.buttonText}
                </Link>
              </div>
            </div>
          </div>
        )})}
      </div>

      {/* Subtle previous / next controls over banner (icons only) */}
      <button
        onClick={prev}
        className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 flex items-center justify-center text-[#ffffff]/80 hover:text-[#ffffff] transition-colors touch-manipulation"
        aria-label="Oldingi banner"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>
      <button
        onClick={next}
        className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 flex items-center justify-center text-[#ffffff]/80 hover:text-[#ffffff] transition-colors touch-manipulation"
        aria-label="Keyingi banner"
      >
        <ChevronRight className="h-4 w-4" />
      </button>

      <div className="absolute bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 sm:gap-2">
        {banners.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`h-2 sm:h-2.5 rounded-full transition-all min-w-[8px] touch-manipulation ${
              i === current ? "w-6 sm:w-8 bg-primary" : "w-2 sm:w-2.5 bg-[#ffffff]/60"
            }`}
            aria-label={`Banner ${i + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
