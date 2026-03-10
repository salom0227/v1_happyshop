import type { Metadata, Viewport } from 'next'
import { Inter } from "next/font/google"
import { Analytics } from '@vercel/analytics/next'
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/sonner"
import { MobileNav } from "@/components/mobile-nav"
import { CartCountProvider } from "@/contexts/cart-count-context"
import { GrainientBackground } from "@/components/GrainientBackground"
import { DarkOverlay } from "@/components/DarkOverlay"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
})

export const metadata: Metadata = {
  title: {
    default: "Happy Shop - Sovg'alar, Gullar va Qo'l ishlari",
    template: "%s | Happy Shop",
  },
  description:
    "Happy Shop - eng chiroyli gullar, sovg'alar, qo'l bilan yasalgan noyob buyumlar va hadya mahsulotlar bir joyda. Yetkazib berish Toshkent bo'ylab!",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  openGraph: {
    type: "website",
    locale: "uz_UZ",
    siteName: "Happy Shop",
  },
  twitter: {
    card: "summary_large_image",
  },
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#e8604c",
  viewportFit: "cover",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="uz" suppressHydrationWarning className={inter.variable}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                const storageKey = 'theme';
                const classList = document.documentElement.classList;
                const stored = window.localStorage.getItem(storageKey);
                const systemDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
                const theme = stored === 'light' || stored === 'dark' ? stored : (systemDark ? 'dark' : 'light');
                classList.remove('light', 'dark');
                classList.add(theme);
                document.documentElement.style.colorScheme = theme;
              })();
            `,
          }}
        />
      </head>
      <body className={`${inter.className} min-h-screen overflow-x-hidden antialiased`}
      >
        <ThemeProvider>
          <CartCountProvider>
            <GrainientBackground />
            <DarkOverlay />
            <div className="relative z-10">
              {children}
              <Analytics />
              <Toaster />
              <MobileNav />
            </div>
          </CartCountProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
