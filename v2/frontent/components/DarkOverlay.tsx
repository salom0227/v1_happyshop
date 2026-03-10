"use client"

import { useThemeContext } from "@/contexts/ThemeContext"

/**
 * Dark: gradient ustiga qorong'u qatlam.
 * Light: gradient ustiga yengil oq qatlam — ranglarning ko'rinishini kamaytiradi.
 */
export function DarkOverlay() {
  const { theme } = useThemeContext()

  if (theme === "dark") {
    return (
      <div
        className="fixed inset-0 z-[1] pointer-events-none transition-opacity duration-500"
        style={{
          minHeight: "100dvh",
          background: "linear-gradient(180deg, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.62) 100%)",
        }}
        aria-hidden
      />
    )
  }

  if (theme === "light") {
    return (
      <div
        className="fixed inset-0 z-[1] pointer-events-none transition-opacity duration-500"
        style={{
          minHeight: "100dvh",
          background: "rgba(255, 255, 255, 0.45)",
        }}
        aria-hidden
      />
    )
  }

  return null
}
