import { apiRequest } from "./client"
import type { Category } from "@/types/category"
import type { Banner } from "@/types/banner"
import type { PromoCategory } from "@/types/promo-category"

/** Cache 5 min (matches backend Redis cache). */
const HOME_CACHE = 0

export async function getCategories(): Promise<Category[]> {
  return apiRequest<Category[]>("/categories/", { revalidate: HOME_CACHE })
}

export async function getBanners(): Promise<Banner[]> {
  return apiRequest<Banner[]>("/banners/", { revalidate: HOME_CACHE })
}

export async function getPromoCategories(): Promise<PromoCategory[]> {
  return apiRequest<PromoCategory[]>("/promo-categories/", { revalidate: HOME_CACHE })
}
