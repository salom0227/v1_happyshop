"use client"

import { useState } from "react"
import { sendServiceContact } from "@/services/api/analyticsApi"

interface ServiceContactButtonProps {
  serviceSlug: string
  serviceTitle: string
  telegramUrl: string
  children: React.ReactNode
}

export function ServiceContactButton({
  serviceSlug,
  serviceTitle,
  telegramUrl,
  children,
}: ServiceContactButtonProps) {
  const [sending, setSending] = useState(false)

  async function handleClick() {
    if (sending) return
    setSending(true)
    try {
      await sendServiceContact({
        service_slug: serviceSlug,
        service_title: serviceTitle,
        source: "service_detail_telegram_button",
      })
    } catch {
      // ignore, foydalanuvchi uchun xatoni ko'rsatmaymiz
    } finally {
      setSending(false)
      window.open(telegramUrl, "_blank")
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className="inline-flex items-center justify-center gap-2 w-full sm:w-auto h-12 min-h-[44px] px-6 border-2 border-[#0088cc] bg-[#0088cc]/10 text-[#0088cc] rounded-md text-sm font-medium hover:bg-[#0088cc]/20 transition-colors shrink-0 disabled:opacity-60"
      disabled={sending}
    >
      {children}
    </button>
  )
}

