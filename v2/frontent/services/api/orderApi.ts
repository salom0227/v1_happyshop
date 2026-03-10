import { apiRequest } from "./client"

export interface CreateOrderPayload {
  session_id: string
  name: string
  phone: string
  delivery_address?: string
}

export interface CreateOrderResponse {
  status: string
}

export async function createOrder(
  payload: CreateOrderPayload
): Promise<CreateOrderResponse> {
  return apiRequest<CreateOrderResponse>("/order/", {
    method: "POST",
    body: payload,
  })
}
