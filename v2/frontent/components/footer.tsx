import Link from "next/link"
import { Phone, Gift, MapPin } from "lucide-react"
import { FlyingIcons } from "@/components/flying-icons"
import { getCategories } from "@/services/api"
import { FooterNewsletterForm } from "@/components/footer-newsletter-form"

export async function Footer() {
  let categories: Awaited<ReturnType<typeof getCategories>> = []
  try {
    categories = await getCategories()
  } catch {
    // fallback: static list with slug mapping
    categories = [
      { id: 1, name: "Gullar va buketlar", slug: "gullar-va-buketlar", image: null },
      { id: 2, name: "Sovg'a to'plamlari", slug: "sovga-toplamlari", image: null },
      { id: 3, name: "Shirinliklar", slug: "shirinliklar", image: null },
      { id: 4, name: "O'yinchoqlar", slug: "oyinchoqlar", image: null },
      { id: 5, name: "Qo'l ishlari", slug: "qol-ishlari", image: null },
      { id: 6, name: "Shamlar", slug: "shamlar", image: null },
    ]
  }
  return (
    <footer className="mt-16">
      {/* Main Footer */}
      <div className="relative footer-glass rounded-t-3xl overflow-hidden">
        {/* Soft animated happy gradient that uses theme colors */}
        <div className="pointer-events-none absolute inset-0 footer-gradient-overlay" aria-hidden />
        {/* Uchib yuruvchi ikonkalar — footer */}
        <FlyingIcons count={8} variant="footer" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 sm:gap-8">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-1 mb-4">
                <Gift className="h-6 w-6 text-primary drop-shadow" />
                <span
                  className="text-xl font-black text-card-foreground drop-shadow-sm"
                  style={{ fontFamily: "var(--font-apple)" }}
                >
                  Happy
                </span>
                <span
                  className="text-xl font-black text-primary drop-shadow-sm"
                  style={{ fontFamily: "var(--font-apple)" }}
                >
                  Shop
                </span>
              </div>
              <p className="text-sm text-muted-foreground mb-4 leading-relaxed max-w-sm">
                {"Eng chiroyli gullar, sovg'alar va qo'l bilan yasalgan noyob buyumlar bir joyda."}
              </p>
              <Link
                href="tel:"
                className="text-lg font-bold text-card-foreground hover:text-primary transition-colors flex items-center gap-2 mb-3"
              >
                <Phone className="h-5 w-5" />
                Telefon raqami
              </Link>
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <MapPin className="h-3.5 w-3.5" />
                <span>Toshkent, Yangi Toshkent tumani</span>
              </div>
            </div>

            {/* Categories removed */}

            {/* Newsletter */}
            <div>
              <h3 className="text-sm font-bold text-card-foreground mb-4 uppercase tracking-wider">
                Yangiliklardan xabardor
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                {"Aksiyalar va yangi mahsulotlar haqida birinchi bo'lib biling"}
              </p>
              <FooterNewsletterForm />
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-border/40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
            <p className="text-[11px] sm:text-xs text-muted-foreground order-2 sm:order-1">
              2024-2026 Happy Shop. Barcha huquqlar himoyalangan.
            </p>
            <div className="flex items-center gap-2 sm:gap-3 order-1 sm:order-2 flex-wrap justify-center">
              <div className="w-12 h-7 bg-card/10 rounded flex items-center justify-center text-[10px] text-muted-foreground font-medium">
                Payme
              </div>
              <div className="w-12 h-7 bg-card/10 rounded flex items-center justify-center text-[10px] text-muted-foreground font-medium">
                Click
              </div>
              <div className="w-12 h-7 bg-card/10 rounded flex items-center justify-center text-[10px] text-muted-foreground font-medium">
                UzCard
              </div>
              <div className="w-12 h-7 bg-card/10 rounded flex items-center justify-center text-[10px] text-muted-foreground font-medium">
                Humo
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
