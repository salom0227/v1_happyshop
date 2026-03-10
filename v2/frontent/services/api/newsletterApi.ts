import { apiRequest } from "./client"

export interface NewsletterSubscribeResponse {
  status: string
  message?: string
}

export async function subscribeNewsletter(email: string): Promise<NewsletterSubscribeResponse> {
  return apiRequest<NewsletterSubscribeResponse>("/newsletter/", {
    method: "POST",
    body: { email: email.trim().toLowerCase() },
  })
}
