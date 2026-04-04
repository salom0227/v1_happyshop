"use client"
import { useState } from "react"
import { TopBar } from "@/components/top-bar"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Phone, Mail, MapPin, Clock, Send } from "lucide-react"

export default function AloqaContent() {
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
    } catch {
      alert("Xatolik yuz berdi")
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-transparent">
      <TopBar />
      <Header />
      <main className="max-w-7xl mx-auto px-4 py-8 pb-24">
        <h1 className="text-2xl font-bold text-foreground mb-4">Aloqa</h1>
        {sent && <p className="text-green-500 mb-4">✅ Xabar yuborildi!</p>}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-3">
            <input className="w-full border border-white/20 rounded-xl bg-white/10 text-white p-3" placeholder="Ismingiz" value={name} onChange={e => setName(e.target.value)} />
            <input className="w-full border border-white/20 rounded-xl bg-white/10 text-white p-3" placeholder="+998 XX XXX XX XX" value={phone} onChange={e => setPhone(e.target.value)} />
            <textarea className="w-full border border-white/20 rounded-xl bg-white/10 text-white p-3" rows={4} placeholder="Xabaringiz..." value={message} onChange={e => setMessage(e.target.value)} />
            <button className="bg-primary text-white px-6 py-3 rounded-xl w-full" onClick={handleSubmit} disabled={loading}>
              {loading ? "Yuborilmoqda..." : "Xabarni yuborish"}
            </button>
          </div>
          <div className="space-y-3 text-sm text-white/70">
            <div className="flex items-center gap-2"><Phone className="h-4 w-4 text-primary" /><span>+998 93 343 43 32</span></div>
            <div className="flex items-center gap-2"><Mail className="h-4 w-4 text-primary" /><span>mu7alovcode@gmail.com</span></div>
            <div className="flex items-center gap-2"><MapPin className="h-4 w-4 text-primary" /><span>Toshkent, Yangi Toshkent tumani</span></div>
            <div className="flex items-center gap-2"><Clock className="h-4 w-4 text-primary" /><span>Har kuni: 24/7</span></div>
            <div className="flex gap-2 pt-4">
              <a href="tel:+998933434332" className="bg-primary text-white px-4 py-2 rounded-xl flex items-center gap-2"><Phone className="h-4 w-4" />Qo'ng'iroq</a>
              <a href="https://t.me/mu7alov" target="_blank" rel="noreferrer" className="border border-white/20 text-white px-4 py-2 rounded-xl flex items-center gap-2"><Send className="h-4 w-4" />Telegram</a>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
