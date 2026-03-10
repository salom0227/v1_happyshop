const CART_SESSION_KEY = "happy_shop_cart_session_id"

function generateSessionId(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID()
  }
  return `session_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`
}

/** Get or create cart session ID (client-only, persists in localStorage). */
export function getCartSessionId(): string {
  if (typeof window === "undefined") return ""
  let id = localStorage.getItem(CART_SESSION_KEY)
  if (!id) {
    id = generateSessionId()
    localStorage.setItem(CART_SESSION_KEY, id)
  }
  return id
}

/** Yangi savat session yaratadi (buyurtma berilgach eski savatga yana buyurtma berilmasin). */
export function resetCartSession(): string {
  if (typeof window === "undefined") return ""
  const id = generateSessionId()
  localStorage.setItem(CART_SESSION_KEY, id)
  return id
}
