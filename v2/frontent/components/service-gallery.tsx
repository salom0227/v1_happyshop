"use client"

import { useState, useCallback, useEffect } from "react"
import Image from "next/image"
import { X } from "lucide-react"

interface ServiceGalleryImage {
  src: string
  caption?: string
}

interface ServiceGalleryProps {
  images: ServiceGalleryImage[]
  title: string
}

export function ServiceGallery({ images, title }: ServiceGalleryProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  const close = useCallback(() => setLightboxIndex(null), [])
  const open = (i: number) => setLightboxIndex(i)

  useEffect(() => {
    if (lightboxIndex === null) return
    const onEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") close()
    }
    document.addEventListener("keydown", onEscape)
    document.body.style.overflow = "hidden"
    return () => {
      document.removeEventListener("keydown", onEscape)
      document.body.style.overflow = ""
    }
  }, [lightboxIndex, close])

  if (!images.length) return null

  return (
    <div className="mt-8 sm:mt-10">
      <h2
        className="text-lg font-semibold text-foreground mb-4"
        style={{ fontFamily: "var(--font-apple)" }}
      >
        Galereya
      </h2>
      {/* Mobil: 2 ustun, kichikroq. Planchet: 2–3 ustun, odatiy */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-4">
        {images.map(({ src, caption }, i) => (
          <button
            key={i}
            type="button"
            onClick={() => open(i)}
            className="relative flex flex-col text-left rounded-lg sm:rounded-xl overflow-hidden border border-border/50 bg-muted/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary touch-manipulation"
            aria-label={caption ? caption : `Rasm ${i + 1}`}
          >
            <div className="relative aspect-square sm:aspect-[4/3] w-full">
              <Image
                src={src}
                alt={caption || `${title} — ${i + 1}`}
                fill
                sizes="(max-width:640px) 50vw, (max-width:1024px) 50vw, 33vw"
                loading="lazy"
                className="object-cover"
                unoptimized={src.startsWith("http")}
              />
            </div>
            {caption && (
              <p className="px-2.5 pb-2 pt-1 text-[11px] sm:text-xs text-muted-foreground line-clamp-2">
                {caption}
              </p>
            )}
          </button>
        ))}
      </div>

      {/* Lightbox: bosilganda katta ko‘rinish */}
      {lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={close}
          role="dialog"
          aria-modal="true"
          aria-label="Rasmni yopish"
        >
          <button
            type="button"
            onClick={close}
            className="absolute top-4 right-4 z-10 w-10 h-10 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors touch-manipulation"
            aria-label="Yopish"
          >
            <X className="h-6 w-6" />
          </button>
          <div
            className="relative w-full max-w-4xl max-h-[85vh] flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={images[lightboxIndex].src}
              alt={images[lightboxIndex].caption || `${title} — ${lightboxIndex + 1}`}
              width={1200}
              height={800}
              className="max-w-full max-h-[85vh] w-auto h-auto object-contain rounded-lg"
              unoptimized={images[lightboxIndex].src.startsWith("http")}
              priority
            />
          </div>
          {images.length > 1 && (
            <span className="absolute bottom-4 left-1/2 -translate-x-1/2 text-sm text-white/80">
              {lightboxIndex + 1} / {images.length}
            </span>
          )}
          {images[lightboxIndex].caption && (
            <p className="absolute bottom-4 left-4 right-4 mt-2 text-xs sm:text-sm text-white/85 text-center">
              {images[lightboxIndex].caption}
            </p>
          )}
        </div>
      )}
    </div>
  )
}
