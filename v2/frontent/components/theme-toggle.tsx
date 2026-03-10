"use client"

import { MoonStar, SunMedium } from "lucide-react"

import { cn } from "@/lib/utils"
import { useThemeContext } from "@/contexts/ThemeContext"

interface ThemeToggleProps {
  className?: string
}

export function ThemeToggle({ className }: ThemeToggleProps) {
  const { isDark, toggleTheme, mounted } = useThemeContext()

  if (!mounted) {
    return null
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={cn(
        "relative flex items-center justify-center rounded-full border border-border/70 bg-secondary/80 text-foreground hover:bg-secondary px-1.5 min-h-[32px] min-w-[52px] shadow-md hover:shadow-lg transition-all duration-300 touch-manipulation group overflow-hidden active:scale-95",
        isDark
          ? "shadow-[0_0_18px_rgba(244,193,90,0.45)] border-primary/70"
          : "shadow-[0_0_10px_rgba(0,0,0,0.05)]",
        className,
      )}
      aria-label="Kunduzgi va kechgi rejim"
    >
      {/* Ichki pill fon */}
      <div
        className={cn(
          "absolute inset-0 opacity-30 transition-opacity duration-300",
          "bg-[radial-gradient(circle_at_0%_0%,var(--happy-coral)_0%,transparent_40%),radial-gradient(circle_at_100%_100%,var(--happy-warm)_0%,transparent_40%)]",
          isDark ? "opacity-65" : "opacity-45",
        )}
        aria-hidden
      />
      {/* Siljiydigan yumaloq knob — ichida ikonka */}
      <span
        className={cn(
          "absolute inset-y-1 left-1 w-5 h-5 rounded-full bg-background/95 shadow-md ring-1 ring-border/70 transition-all duration-300 flex items-center justify-center",
          isDark && "left-auto right-1 bg-primary/40",
        )}
        aria-hidden
      >
        <SunMedium
          className={cn(
            "absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-3.5 w-3.5 transition-all duration-300",
            isDark ? "opacity-0 scale-75" : "opacity-100 scale-100",
          )}
        />
        <MoonStar
          className={cn(
            "absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-3.5 w-3.5 transition-all duration-300",
            isDark ? "opacity-100 scale-100 text-primary" : "opacity-0 scale-75",
          )}
        />
      </span>
    </button>
  )
}

