/**
 * Re-exports from centralized services/api. All data comes from backend APIs.
 * Prefer importing from @/services/api in new code.
 */
export {
  getCategories,
  getBanners,
  getPromoCategories,
} from "@/services/api/categoryApi"
export {
  getProducts,
  getProduct,
  getFeaturedProducts,
  getCategoryProducts,
  getPromoCategoryProducts,
} from "@/services/api/productApi"
export type { Category } from "@/types/category"
export type { Product } from "@/types/product"
export type { Banner } from "@/types/banner"
export type { PromoCategory } from "@/types/promo-category"
