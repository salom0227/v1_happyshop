import { Skeleton } from "@/components/ui/skeleton"

export default function ProductLoading() {
  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-6 pb-28">
      <Skeleton className="h-4 w-56" />
      <div className="flex flex-col lg:flex-row gap-6 sm:gap-8">
        <div className="lg:w-[55%] space-y-3">
          <Skeleton className="w-full aspect-square rounded-2xl" />
          <div className="flex gap-2 overflow-x-auto">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-16 w-16 rounded-xl flex-shrink-0" />
            ))}
          </div>
        </div>
        <div className="lg:w-[45%] space-y-4">
          <Skeleton className="h-6 w-64" />
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-12 w-full rounded-xl" />
          <Skeleton className="h-12 w-full rounded-xl" />
        </div>
      </div>
      <div className="space-y-3">
        <Skeleton className="h-5 w-40" />
        <div className="space-y-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-full" />
          ))}
        </div>
      </div>
      <div className="fixed bottom-0 left-0 w-full h-16 bg-card/80 border-t border-border backdrop-blur md:hidden">
        <div className="max-w-7xl mx-auto h-full px-4 flex items-center gap-3">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-11 rounded-xl flex-1" />
        </div>
      </div>
    </main>
  )
}

