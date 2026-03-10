import { apiRequest } from "./client"

/** Service page from GET /api/services/ */
export interface ServicePageImage {
  image: string
  caption: string
  order: number
}

export interface ServicePage {
  id: number
  title: string
  slug: string
  content: string
  icon: string
  /** Kartochka rasmi (bosh sahifa va ro'yxat) */
  image: string | null
  /** Sahifa ichidagi galereya (1–10 ta rasm) — eski maydon, faqat rasm URL lar */
  images: string[]
  /** Galereya tasvirlari matn bilan (ixtiyoriy) */
  gallery: ServicePageImage[]
  is_active: boolean
  order: number
}

export interface ServiceContactPayload {
  service_slug: string
  service_title: string
  message?: string
  source?: string
}

export async function getServicePages(): Promise<ServicePage[]> {
  return apiRequest<ServicePage[]>("/services/", { revalidate: 60 })
}

export async function getServicePage(slug: string): Promise<ServicePage> {
  return apiRequest<ServicePage>(`/services/${slug}/`, { revalidate: 60 })
}

export async function sendServiceContact(
  payload: ServiceContactPayload
): Promise<{ status: string }> {
  return apiRequest<{ status: string }>("/services/contact/", {
    method: "POST",
    body: payload,
  })
}
