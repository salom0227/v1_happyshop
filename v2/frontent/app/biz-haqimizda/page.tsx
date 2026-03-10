import Link from "next/link"
import { TopBar } from "@/components/top-bar"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Gift, Heart, Truck, Shield, Users } from "lucide-react"

export default function BizHaqimizdaPage() {
  return (
    <div className="min-h-screen bg-transparent">
      <TopBar />
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 pb-24">
        <nav className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-muted-foreground mb-4" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-primary transition-colors">Bosh sahifa</Link>
          <span>/</span>
          <span className="text-foreground">Biz haqimizda</span>
        </nav>

        <h1
          className="text-xl sm:text-2xl font-bold text-foreground mb-3 sm:mb-4"
          style={{ fontFamily: "var(--font-apple)" }}
        >
          Biz haqimizda
        </h1>
        <p className="text-sm text-muted-foreground mb-6 sm:mb-8 max-w-2xl">
          Happy Shop — Toshkent va O‘zbekiston bo‘ylab gullar, sovg‘a to‘plamlari va qo‘l ishlarini yetkazib beruvchi do‘kon. Biz mijozlarimizning har bir bayram va kundalik lazzatini yorqin qilishga intilamiz.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mb-8 sm:mb-10">
          {[
            { icon: Gift, title: "Keng assortiment", desc: "Gullar, buketlar, sovg'alar va qo'l ishlari" },
            { icon: Truck, title: "Tez yetkazib berish", desc: "Toshkent bo'ylab va boshqa shaharlarga" },
            { icon: Shield, title: "Ishonchli sifat", desc: "Har bir buyum sinchkovlik bilan tayyorlanadi" },
            { icon: Heart, title: "Mijozlar uchun", desc: "Sizning mamnunligingiz — bizning maqsadimiz" },
          ].map(({ icon: Icon, title, desc }) => (
            <Card key={title} className="p-4 sm:p-5 border-border/60">
              <CardContent className="p-0 flex flex-col gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <h2 className="text-sm font-semibold text-foreground">{title}</h2>
                <p className="text-xs text-muted-foreground">{desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="p-4 sm:p-6 border-border/60">
          <CardContent className="p-0 space-y-4">
            <h2 className="text-base font-semibold text-foreground flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              Bizning vazifamiz
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Har bir sovg‘a — hissiyot va e’tibor. Biz gullar, shirinliklar, o‘yinchoqlar va qo‘l bilan yasalgan noyob buyumlarni bitta joyda to‘plash orqali sizga qulay tanlov va tez buyurtma imkoniyatini beramiz. Toshkent va boshqa shaharlarga yetkazib berish, aksiyalar va “Kim uchun sovg‘a olamiz” bo‘limi orqali yordam beramiz.
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Savollar yoki buyurtma uchun <Link href="/aloqa" className="text-primary hover:underline">Aloqa</Link> sahifasidan yoki Telegram orqali bog‘lanishingiz mumkin.
            </p>
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  )
}
