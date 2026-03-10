import { apiRequest } from "./client"
import type { CartResponse } from "@/types/cart"

export async function getCart(sessionId: string): Promise<CartResponse> {
  return apiRequest<CartResponse>(`/cart/?session_id=${encodeURIComponent(sessionId)}`)
}

export async function addToCart(
  sessionId: string,
  productId: number,
  quantity: number = 1
): Promise<CartResponse> {
  return apiRequest<CartResponse>("/cart/add/", {
    method: "POST",
    body: { session_id: sessionId, product_id: productId, quantity },
  })
}

export async function updateCartItem(
  sessionId: string,
  productId: number,
  quantity: number
): Promise<CartResponse> {
  return apiRequest<CartResponse>("/cart/update/", {
    method: "PATCH",
    body: { session_id: sessionId, product_id: productId, quantity },
  })
}

export async function removeFromCart(
  sessionId: string,
  productId: number
): Promise<CartResponse> {
  return apiRequest<CartResponse>("/cart/remove/", {
    method: "POST",
    body: { session_id: sessionId, product_id: productId },
  })
}
