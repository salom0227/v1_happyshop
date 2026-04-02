import Image from "next/image"
import Link from "next/link"
import type { PromoCategory } from "@/types/promo-category"

interface PromoBannerProps {
  items: PromoCategory[]
}

export function PromoBanner({ items }: PromoBannerProps) {
  if (items.length === 0) {
    return null
  }

  return (
    <div className="space-y-3 sm:space-y-4">
      <h2
        className="text-lg sm:text-xl font-bold text-foreground"
        style={{ fontFamily: "var(--font-apple)" }}
      >
        Kim uchun sovg&apos;a tanlaymiz?
      </h2>
      <div className="-mx-2 px-2 sm:mx-0 sm:px-0">
        <div className="grid grid-cols-4 gap-3 py-1.5 sm:py-2 sm:flex sm:overflow-x-auto sm:scrollbar-hide sm:gap-4">
          {items.map((item) => (
            <Link
              key={item.slug}
              href={item.link && item.link !== "#" ? item.link : `/gift-for/${item.slug}`}
              className="flex flex-col items-center gap-1.5 sm:gap-2 w-full sm:flex-shrink-0 sm:w-[104px] touch-manipulation group"
            >
              <div className="relative w-20 h-20 sm:w-[104px] sm:h-[104px] overflow-hidden glass-card border border-white/20 p-0.5 !shadow-none aspect-square rounded-full">
                {item.image ? (
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    sizes="80px"
                    loading="lazy"
                    className="object-cover"
                    unoptimized={item.image?.startsWith("http")}
                  />
                ) : (
                  <span className="absolute inset-0 flex items-center justify-center text-2xl">🎁</span>
                )}
              </div>
              <span className="text-[11px] sm:text-xs font-semibold text-foreground text-center leading-tight">
                {item.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
