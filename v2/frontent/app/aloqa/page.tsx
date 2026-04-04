"use client"
import dynamic from "next/dynamic"

const AloqaContent = dynamic(() => import("@/components/aloqa-content"), { 
  ssr: false,
  loading: () => <div className="min-h-screen" />
})

export default function ContactPage() {
  return <AloqaContent />
}
