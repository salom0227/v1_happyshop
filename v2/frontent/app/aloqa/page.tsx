"use client"
import { useState } from "react"
import { TopBar } from "@/components/top-bar"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
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
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 pb-24">
        <h1 className="text-xl sm:text-2xl font-bold text-foreground mb-3 sm:mb-4" style={{ fontFamily: "var(--font-apple)" }}>
          Aloqa
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground mb-4 sm:mb-6">
          Savollaringiz, takliflaringiz yoki buyurtma bo&apos;yicha yordam kerak bo&apos;lsa, biz bilan bog&apos;laning.
        </p>
        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr,0.9fr] gap-4 sm:gap-6">
          <Card className="py-4 sm:py-6">
            <CardContent className="space-y-3 sm:space-y-4">
              <h2 className="text-sm sm:text-base font-semibold text-foreground">Xabar yuborish</h2>
              {sent && <p className="text-green-500 text-sm">✅ Xabar yuborildi!</p>}
              <div className="space-y-2.5 sm:space-y-3">
                <div className="space-y-1.5">
                  <label className="text-xs sm:text-sm font-medium text-foreground">Ism familiya</label>
                  <Input placeholder="Ismingiz" className="h-11 text-sm" value={name} onChange={e => setName(e.target.value)} />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs sm:text-sm font-medium text-foreground">Telefon raqam</label>
                  <Input type="tel" placeholder="+998 XX XXX XX XX" className="h-11 text-sm" value={phone} onChange={e => setPhone(e.target.value)} />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs sm:text-sm font-medium text-foreground">Xabar matni</label>
                  <Textarea rows={4} placeholder="Savolingiz yoki xabaringizni yozing..." className="text-sm" value={message} onChange={e => setMessage(e.target.value)} />
                </div>
              </div>
              <Button className="w-full sm:w-auto h-11 min-h-[44px]" onClick={handleSubmit} disabled={loading}>
                {loading ? "Yuborilmoqda..." : "Xabarni yuborish"}
              </Button>
            </CardContent>
          </Card>
          <div className="space-y-4 sm:space-y-5">
            <Card className="py-4 sm:py-5">
              <CardContent className="space-y-3">
                <h2 className="text-sm sm:text-base font-semibold text-foreground">Kontakt ma&apos;lumotlar</h2>
                <div className="space-y-2.5 text-xs sm:text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-primary" />
                    <span>+998 93 343 43 32</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-primary" />
                    <span>mu7alovcode@gmail.com</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-primary" />
                    <span>Toshkent, Yangi Toshkent tumani</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-primary" />
                    <span>Har kuni: 24/7</span>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-2 pt-3">
                  <Button asChild className="flex-1 h-10 min-h-[44px]">
                    <a href="tel:+998933434332">
                      <Phone className="h-4 w-4 mr-1.5" />
                      Qo&apos;ng&apos;iroq qilish
                    </a>
                  </Button>
                  <Button asChild variant="outline" className="flex-1 h-10 min-h-[44px]">
                    <a href="https://t.me/mu7alov" target="_blank" rel="noreferrer">
                      <Send className="h-4 w-4 mr-1.5" />
                      Telegramdan yozish
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
