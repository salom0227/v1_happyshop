"use client"

import { createContext, useContext, useEffect, useState } from "react"

type Theme = "light" | "dark"

interface ThemeContextValue {
  theme: Theme
  isDark: boolean
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
  mounted: boolean
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined)

const STORAGE_KEY = "theme"

function getInitialTheme(): Theme {
  if (typeof window === "undefined") return "light"

  const stored = window.localStorage.getItem(STORAGE_KEY)
  if (stored === "light" || stored === "dark") {
    return stored
  }

  const prefersDark = window.matchMedia?.("(prefers-color-scheme: dark)").matches
  return prefersDark ? "dark" : "light"
}

export function AppThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("light")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const initial = getInitialTheme()
    setThemeState(initial)
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return

    const root = document.documentElement
    root.classList.remove("light", "dark")
    root.classList.add(theme)
    root.style.colorScheme = theme
    window.localStorage.setItem(STORAGE_KEY, theme)
  }, [theme, mounted])

  const setTheme = (next: Theme) => {
    setThemeState(next)
  }

  const toggleTheme = () => {
    setThemeState((prev) => (prev === "dark" ? "light" : "dark"))
  }

  return (
    <ThemeContext.Provider
      value={{
        theme,
        isDark: theme === "dark",
        setTheme,
        toggleTheme,
        mounted,
      }}
    >
      {children}
    </ThemeContext.Provider>
  )
}

export function useThemeContext() {
  const ctx = useContext(ThemeContext)
  if (!ctx) {
    throw new Error("useThemeContext must be used within AppThemeProvider")
  }
  return ctx
}

