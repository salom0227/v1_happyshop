import { Suspense } from "react"
import { Footer } from "@/components/footer"
import { QidiruvContent } from "./qidiruv-content"
import { Loader2 } from "lucide-react"

export default function QidiruvPage() {
  return (
    <>
      <Suspense
        fallback={
          <div className="min-h-screen bg-transparent flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        }
      >
        <QidiruvContent />
      </Suspense>
      <Footer />
    </>
  )
}
