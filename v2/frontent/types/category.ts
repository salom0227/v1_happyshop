/** Matches Django Category model /api/categories/ */
export interface Category {
  id: number
  name: string
  slug: string
  image: string | null
}
