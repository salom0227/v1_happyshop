import Link from "next/link"
import { TopBar } from "@/components/top-bar"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-transparent flex flex-col">
      <TopBar />
      <Header />
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-12">
        <h1 className="text-6xl sm:text-8xl font-bold text-muted-foreground/50">404</h1>
        <p className="text-lg sm:text-xl text-foreground font-medium mt-4 text-center">
          Sahifa topilmadi
        </p>
        <p className="text-sm text-muted-foreground mt-2 text-center max-w-md">
          Siz soʻragan sahifa mavjud emas yoki koʻchirilgan.
        </p>
        <Button asChild className="mt-8">
          <Link href="/">Bosh sahifaga qaytish</Link>
        </Button>
      </main>
      <Footer />
    </div>
  )
}
