import { apiRequest } from "./client"
import type { Product, SearchProductResult } from "@/types/product"

export async function getProducts(): Promise<Product[]> {
  return apiRequest<Product[]>("/products/", { revalidate: 60 })
}

export async function getProduct(slug: string): Promise<Product> {
  return apiRequest<Product>(`/products/${slug}/`, { revalidate: 60 })
}

/** Live search: GET /api/products/search/?q=keyword (no cache). */
export async function searchProducts(q: string): Promise<SearchProductResult[]> {
  const trimmed = q.trim()
  if (!trimmed) return []
  return apiRequest<SearchProductResult[]>(
    `/products/search/?q=${encodeURIComponent(trimmed)}`,
    { cache: "no-store" }
  )
}

/** Cache 5 min for home page (matches backend Redis). */
const HOME_CACHE = 300

export async function getFeaturedProducts(): Promise<Product[]> {
  return apiRequest<Product[]>("/featured-products/", { revalidate: HOME_CACHE })
}

/** Yangi mahsulotlar (bosh sahifa, 8 ta). */
export async function getNewProducts(): Promise<Product[]> {
  return apiRequest<Product[]>("/new-products/", { revalidate: HOME_CACHE })
}

/** Eng ko'p sotilganlar (bosh sahifa, 8 ta). */
export async function getBestSellers(): Promise<Product[]> {
  return apiRequest<Product[]>("/best-sellers/", { revalidate: HOME_CACHE })
}

export async function getCategoryProducts(slug: string): Promise<Product[]> {
  return apiRequest<Product[]>(`/categories/${slug}/products/`, { revalidate: 60 })
}

export async function getPromoCategoryProducts(slug: string): Promise<Product[]> {
  return apiRequest<Product[]>(`/promo-categories/${slug}/products/`, { revalidate: 60 })
}

/** Record a product page view. Call when the product detail page is shown. */
export async function recordProductView(productId: number): Promise<{ status: string }> {
  return apiRequest<{ status: string }>("/products/view/", {
    method: "POST",
    body: { product_id: productId },
  })
}

export async function getBannerProducts(id: number): Promise<Product[]> {
  return apiRequest<Product[]>(`/banners/${id}/products/`, { revalidate: 60 })
}
