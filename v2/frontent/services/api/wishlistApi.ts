import { apiRequest } from "./client"

export interface WishlistProduct {
  id: number
  title: string
  slug: string
  price: string
  image: string | null
}

export interface WishlistItem {
  id: number
  product: WishlistProduct
  created_at: string
}

export interface WishlistResponse {
  items: WishlistItem[]
}

export async function getWishlist(sessionId: string): Promise<WishlistResponse> {
  const res = await apiRequest<{ items: WishlistItem[] }>(
    `/wishlist/?session_id=${encodeURIComponent(sessionId)}`
  )
  return res
}

export async function addToWishlist(
  sessionId: string,
  productId: number
): Promise<{ status: string; items: WishlistItem[] }> {
  return apiRequest<{ status: string; items: WishlistItem[] }>("/wishlist/add/", {
    method: "POST",
    body: { session_id: sessionId, product_id: productId },
  })
}

export async function removeFromWishlist(
  sessionId: string,
  productId: number
): Promise<{ status: string; items: WishlistItem[] }> {
  return apiRequest<{ status: string; items: WishlistItem[] }>("/wishlist/remove/", {
    method: "POST",
    body: { session_id: sessionId, product_id: productId },
  })
}
