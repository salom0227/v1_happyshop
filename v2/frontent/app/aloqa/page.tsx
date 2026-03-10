import { TopBar } from "@/components/top-bar"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Phone, Mail, MapPin, Clock, Send } from "lucide-react"

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-transparent">
      <TopBar />
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 pb-24">
        <h1
          className="text-xl sm:text-2xl font-bold text-foreground mb-3 sm:mb-4"
          style={{ fontFamily: "var(--font-apple)" }}
        >
          Aloqa
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground mb-4 sm:mb-6">
          Savollaringiz, takliflaringiz yoki buyurtma bo‘yicha yordam kerak bo‘lsa, biz bilan bog‘laning.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr,0.9fr] gap-4 sm:gap-6">
          <Card className="py-4 sm:py-6">
            <CardContent className="space-y-3 sm:space-y-4">
              <h2 className="text-sm sm:text-base font-semibold text-foreground">
                Xabar yuborish
              </h2>
              <div className="space-y-2.5 sm:space-y-3">
                <div className="space-y-1.5">
                  <label className="text-xs sm:text-sm font-medium text-foreground">
                    Ism familiya
                  </label>
                  <Input
                    placeholder="Ismingiz"
                    className="h-11 text-sm"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs sm:text-sm font-medium text-foreground">
                    Telefon raqam
                  </label>
                  <Input
                    type="tel"
                    placeholder="Telefon raqamingiz"
                    className="h-11 text-sm"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs sm:text-sm font-medium text-foreground">
                    Xabar matni
                  </label>
                  <Textarea
                    rows={4}
                    placeholder="Savolingiz yoki xabaringizni yozing..."
                    className="text-sm"
                  />
                </div>
              </div>
              <Button className="w-full sm:w-auto h-11 min-h-[44px]">
                Xabarni yuborish
              </Button>
            </CardContent>
          </Card>

          <div className="space-y-4 sm:space-y-5">
            <Card className="py-4 sm:py-5">
              <CardContent className="space-y-3">
                <h2 className="text-sm sm:text-base font-semibold text-foreground">
                  Kontakt ma’lumotlar
                </h2>
                <div className="space-y-2.5 text-xs sm:text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-primary" />
                    <span>Telefon raqami</span>
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
                    <a href="tel:">
                      <Phone className="h-4 w-4 mr-1.5" />
                      Qo&apos;ng&apos;iroq qilish
                    </a>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    className="flex-1 h-10 min-h-[44px]"
                  >
                    <a
                      href="https://t.me/mu7alov"
                      target="_blank"
                      rel="noreferrer"
                    >
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

