import type { Category } from "./category"

/** Mahsulot xususiyati (admin orqali kiritiladi) */
export interface ProductSpecItem {
  key: string
  value: string
}

/** Matches Django Product model /api/products/ */
export interface Product {
  id: number
  category: Category
  title: string
  slug: string
  description: string
  price: string
  discount_percent: number | null
  discount_price: string | number | null
  image: string | null
  images: string[]
  specs: ProductSpecItem[]
  is_featured: boolean
  is_active?: boolean
  view_count?: number
  favorite_count?: number
  sold_count?: number
  created_at: string
}

/** Search API response item (minimal for dropdown). */
export interface SearchProductResult {
  id: number
  title: string
  price: string | number
  image: string | null
  slug: string
}
