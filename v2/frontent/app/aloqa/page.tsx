import { TopBar } from "@/components/top-bar"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Phone, Mail, MapPin, Clock, Send } from "lucide-react"
import { AloqaForm } from "@/components/aloqa-form"

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-transparent">
      <TopBar />
      <Header />
      <main className="max-w-7xl mx-auto px-4 py-8 pb-24">
        <h1 className="text-2xl font-bold text-foreground mb-4">Aloqa</h1>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <AloqaForm />
          <div className="space-y-3 text-sm text-muted-foreground">
            <div className="flex items-center gap-2"><Phone className="h-4 w-4 text-primary" /><span>+998 93 343 43 32</span></div>
            <div className="flex items-center gap-2"><Mail className="h-4 w-4 text-primary" /><span>mu7alovcode@gmail.com</span></div>
            <div className="flex items-center gap-2"><MapPin className="h-4 w-4 text-primary" /><span>Toshkent, Yangi Toshkent tumani</span></div>
            <div className="flex items-center gap-2"><Clock className="h-4 w-4 text-primary" /><span>Har kuni: 24/7</span></div>
            <div className="flex gap-2 pt-4">
              <a href="tel:+998933434332" className="bg-primary text-white px-4 py-2 rounded-xl flex items-center gap-2"><Phone className="h-4 w-4" />Qo&apos;ng&apos;iroq</a>
              <a href="https://t.me/mu7alov" target="_blank" rel="noreferrer" className="border border-border text-foreground px-4 py-2 rounded-xl flex items-center gap-2"><Send className="h-4 w-4" />Telegram</a>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
