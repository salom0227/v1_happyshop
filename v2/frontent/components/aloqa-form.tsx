"use client"
import { useState } from "react"

export function AloqaForm() {
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
      setName(""); setPhone(""); setMessage("")
    } catch { alert("Xatolik yuz berdi") }
    setLoading(false)
  }

  return (
    <div className="space-y-3">
      {sent && <p className="text-green-500">✅ Xabar yuborildi!</p>}
      <input className="w-full border border-border rounded-xl bg-background text-foreground p-3" placeholder="Ismingiz" value={name} onChange={e => setName(e.target.value)} />
      <input className="w-full border border-border rounded-xl bg-background text-foreground p-3" placeholder="+998 XX XXX XX XX" value={phone} onChange={e => setPhone(e.target.value)} />
      <textarea className="w-full border border-border rounded-xl bg-background text-foreground p-3" rows={4} placeholder="Xabaringiz..." value={message} onChange={e => setMessage(e.target.value)} />
      <button className="bg-primary text-white px-6 py-3 rounded-xl w-full" onClick={handleSubmit} disabled={loading}>
        {loading ? "Yuborilmoqda..." : "Xabarni yuborish"}
      </button>
    </div>
  )
}
