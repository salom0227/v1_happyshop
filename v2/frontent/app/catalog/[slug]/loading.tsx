import { Skeleton } from "@/components/ui/skeleton"

export default function CatalogLoading() {
  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-4">
      <Skeleton className="h-4 w-56" />
      <Skeleton className="h-7 w-64" />
      <div className="flex gap-2 overflow-x-auto">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-8 w-24 rounded-xl flex-shrink-0" />
        ))}
      </div>
      <div className="flex gap-6">
        <div className="hidden lg:flex w-[250px] flex-col gap-3">
          <Skeleton className="h-32 rounded-2xl" />
          <Skeleton className="h-32 rounded-2xl" />
          <Skeleton className="h-20 rounded-2xl" />
        </div>
        <div className="flex-1 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-48 rounded-2xl" />
          ))}
        </div>
      </div>
    </main>
  )
}

