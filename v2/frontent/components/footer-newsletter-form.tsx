"use client"

import { useState } from "react"
import { subscribeNewsletter } from "@/services/api/newsletterApi"

export function FooterNewsletterForm() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const value = email.trim()
    if (!value) {
      setError("Email manzilini kiriting.")
      return
    }
    setError(null)
    setLoading(true)
    try {
      await subscribeNewsletter(value)
      setSuccess(true)
      setEmail("")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Xatolik yuz berdi. Keyinroq urinib koʻring.")
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <p className="text-sm text-primary font-medium">
        Rahmat! Email roʻyxatga qoʻshildi.
      </p>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      <div className="flex flex-col sm:flex-row gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email manzilingiz"
          disabled={loading}
          className="flex-1 min-w-0 h-12 sm:h-14 min-h-[48px] px-4 sm:px-5 rounded-xl bg-white/20 dark:bg-white/10 text-card-foreground text-base sm:text-lg placeholder:text-muted-foreground border border-white/20 focus:border-primary focus:outline-none backdrop-blur-sm disabled:opacity-60"
          aria-label="Email manzilingiz"
        />
        <button
          type="submit"
          disabled={loading}
          className="h-12 sm:h-14 px-5 sm:px-6 btn btn-primary rounded-full text-base font-semibold shrink-0 min-h-[48px] disabled:opacity-60"
        >
          {loading ? "Yuborilmoqda…" : "Yuborish"}
        </button>
      </div>
      {error && (
        <p className="text-xs text-destructive" role="alert">
          {error}
        </p>
      )}
    </form>
  )
}
