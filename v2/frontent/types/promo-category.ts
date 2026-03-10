/** API: /api/promo-categories/ — «Kimga sovg'a tanlaymiz?» bo'limi */
export interface PromoCategory {
  id: number
  name: string
  slug: string
  image: string | null
  link: string
  order: number
}
