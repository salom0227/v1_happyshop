/** Product summary inside cart item (from API) */
export interface CartProduct {
  id: number
  title: string
  slug: string
  price: string
  image: string | null
}

export interface CartItem {
  id: number
  product: CartProduct
  quantity: number
  /** Backend may return as string (Decimal) or number */
  line_total: number | string
  created_at: string
}

export interface CartResponse {
  items: CartItem[]
  total_price: string
}
