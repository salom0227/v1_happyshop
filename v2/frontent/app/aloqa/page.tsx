"use client"
import { useState } from "react"
import { TopBar } from "@/components/top-bar"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Phone, Mail, MapPin, Clock, Send } from "lucide-react"

export default function ContactPage() {
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const handleSubmit = async () => {
    if (!name || !phone || !message) return
    setLoading(true)
    try {
      const text = `📩 Yangi xabar!\n👤 Ism: ${name}\n📞 Telefon: ${phone}\n💬 Xabar: ${message}`
      await fetch(`https://api.telegram.org/bot8753169345:AAGYct19bazSGJGbTUq0IbY9EZH5EJ5NJEk/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: "5269410357", text }),
      })
      setSent(true)
      setName("")
      setPhone("")
      setMessage("")
    } catch (e) {
      alert("Xatolik yuz berdi")
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-transparent">
      <TopBar />
      <Header />
      <main className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-4">Aloqa</h1>
        {sent && <p className="text-green-500 mb-4">✅ Xabar yuborildi!</p>}
        <div className="space-y-3 mb-6">
          <input className="w-full border rounded p-2" placeholder="Ismingiz" value={name} onChange={e => setName(e.target.value)} />
          <input className="w-full border rounded p-2" placeholder="+998 XX XXX XX XX" value={phone} onChange={e => setPhone(e.target.value)} />
          <textarea className="w-full border rounded p-2" rows={4} placeholder="Xabaringiz..." value={message} onChange={e => setMessage(e.target.value)} />
          <button className="bg-purple-600 text-white px-6 py-2 rounded" onClick={handleSubmit} disabled={loading}>
            {loading ? "Yuborilmoqda..." : "Yuborish"}
          </button>
        </div>
        <div className="space-y-2 text-sm text-gray-300">
          <div className="flex items-center gap-2"><Phone className="h-4 w-4" /><span>+998 93 343 43 32</span></div>
          <div className="flex items-center gap-2"><Mail className="h-4 w-4" /><span>mu7alovcode@gmail.com</span></div>
          <div className="flex items-center gap-2"><MapPin className="h-4 w-4" /><span>Toshkent, Yangi Toshkent tumani</span></div>
          <div className="flex items-center gap-2"><Clock className="h-4 w-4" /><span>Har kuni: 24/7</span></div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
