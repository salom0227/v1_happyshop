"use client"

import { useRef, useEffect, useState, type ReactNode } from "react"

interface ScrollSqueezeSectionProps {
  children: ReactNode
  className?: string
  id?: string
  as?: "section" | "div"
  rootMargin?: string
  threshold?: number
  /** Birinchi ko‘rinuvchi blok uchun siqilishni o‘chirish */
  noSqueeze?: boolean
}

export function ScrollSqueezeSection({
  children,
  className = "",
  id,
  as: Tag = "section",
  rootMargin = "0px 0px -8% 0px",
  threshold = 0,
  noSqueeze = false,
}: ScrollSqueezeSectionProps) {
  const ref = useRef<HTMLElement>(null)
  const [inView, setInView] = useState(noSqueeze)

  useEffect(() => {
    if (noSqueeze) return
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setInView(true)
      },
      { rootMargin, threshold }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [rootMargin, threshold, noSqueeze])

  return (
    <Tag
      ref={ref as React.RefObject<HTMLDivElement>}
      id={id}
      className={`${!noSqueeze ? "scroll-squeeze-section " : ""}${inView ? "scroll-squeeze-in " : ""}${className}`.trim()}
    >
      {children}
    </Tag>
  )
}
