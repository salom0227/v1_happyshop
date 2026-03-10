"use client"

import { useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowRight, ChevronLeft, ChevronRight, ConciergeBell } from "lucide-react"
import type { ServicePage } from "@/services/api/analyticsApi"

interface BlogSectionProps {
  services: ServicePage[]
}

export function BlogSection({ services }: BlogSectionProps) {
  const scrollRef = useRef<HTMLDivElement>(null)

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const amount = direction === "left" ? -320 : 320
      scrollRef.current.scrollBy({ left: amount, behavior: "smooth" })
    }
  }

  return (
    <section className="relative">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4 sm:mb-6 relative z-10">
        <h2
          className="text-xl sm:text-2xl font-bold text-foreground"
          style={{ fontFamily: "var(--font-apple)" }}
        >
          Xizmat ko&apos;rsatish bo&apos;limi
        </h2>
        <Link
          href="/xizmatlar"
          className="flex items-center gap-1.5 text-primary font-semibold text-sm hover:underline min-h-[44px] items-center"
        >
          {"Barcha xizmatlarni ko'rish"}
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="relative z-10">
        {services.length > 0 && (
          <>
            <button
              onClick={() => scroll("left")}
              className="hidden sm:flex absolute -left-2 top-[90px] sm:top-[100px] z-10 w-9 h-9 sm:w-10 sm:h-10 min-h-[44px] min-w-[44px] items-center justify-center bg-card border border-border rounded-full shadow-lg hover:shadow-xl active:scale-95 transition-shadow touch-manipulation"
              aria-label="Chapga suring"
            >
              <ChevronLeft className="h-5 w-5 text-foreground" />
            </button>

            <div
              ref={scrollRef}
              className="flex gap-3 sm:gap-5 overflow-x-auto scrollbar-hide snap-x snap-mandatory px-1"
            >
              {services.map((service) => {
                const cardImage = service.image ?? (service.images?.length ? service.images[0] : null)
                return (
                <Link
                  key={service.id}
                  href={`/xizmatlar/${service.slug}`}
                  className="flex-shrink-0 w-[220px] sm:w-[260px] group snap-start touch-manipulation"
                >
                  <div className="rounded-xl sm:rounded-2xl overflow-hidden mb-2 sm:mb-3 h-[160px] sm:h-[200px] relative bg-muted/50 border border-border/50">
                    {cardImage ? (
                      <Image
                        src={cardImage}
                        alt={service.title}
                        fill
                        sizes="(max-width:768px) 220px, 260px"
                        loading="lazy"
                        className="object-cover md:group-hover:scale-105 transition-transform duration-500"
                        unoptimized={cardImage.startsWith("http")}
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <ConciergeBell className="h-14 w-14 text-muted-foreground/60 group-hover:text-primary/70 transition-colors" />
                      </div>
                    )}
                  </div>
                  <h3 className="text-base sm:text-lg font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2 leading-relaxed text-center">
                    {service.title}
                  </h3>
                </Link>
              );
              })}
            </div>

            <button
              onClick={() => scroll("right")}
              className="hidden sm:flex absolute -right-2 top-[90px] sm:top-[100px] z-10 w-9 h-9 sm:w-10 sm:h-10 min-h-[44px] min-w-[44px] items-center justify-center bg-card border border-border rounded-full shadow-lg hover:shadow-xl active:scale-95 transition-shadow touch-manipulation"
              aria-label="O'ngga suring"
            >
              <ChevronRight className="h-5 w-5 text-foreground" />
            </button>
          </>
        )}
        {services.length === 0 && (
          <div className="rounded-xl sm:rounded-2xl border border-border/50 bg-muted/30 p-6 sm:p-8 text-center">
            <p className="text-sm text-muted-foreground mb-3">Hozircha xizmatlar ro&apos;yxati mavjud emas.</p>
            <Link
              href="/xizmatlar"
              className="inline-flex items-center gap-1.5 text-primary font-semibold text-sm hover:underline"
            >
              Xizmatlar sahifasiga
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}
