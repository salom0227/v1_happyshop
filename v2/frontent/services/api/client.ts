import { getApiBaseUrl, getApiUrl } from "./config"

export type ApiMethod = "GET" | "POST" | "PATCH" | "PUT" | "DELETE"

const DEFAULT_TIMEOUT_MS = 60000

export async function apiRequest<T>(
  path: string,
  options: {
    method?: ApiMethod
    body?: object
    cache?: RequestCache
    revalidate?: number
    headers?: Record<string, string>
    timeoutMs?: number
  } = {}
): Promise<T> {
  const { method = "GET", body, cache, revalidate, headers: customHeaders, timeoutMs = DEFAULT_TIMEOUT_MS } = options
  const url = getApiUrl(path)
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...customHeaders,
  }
  const controller = typeof AbortController !== "undefined" ? new AbortController() : null
  const timeoutId = controller
    ? setTimeout(() => controller.abort(), timeoutMs)
    : null
  const init: RequestInit & { next?: { revalidate: number } } = {
    method,
    headers,
    signal: controller?.signal,
    ...(cache && { cache }),
    ...(revalidate !== undefined && { next: { revalidate } }),
  }
  if (body && method !== "GET") {
    init.body = JSON.stringify(body)
  }
  let res: Response
  try {
    res = await fetch(url, init)
  } catch (err) {
    if (timeoutId) clearTimeout(timeoutId)
    const message = err instanceof Error ? err.message : String(err)
    if (message.includes("abort")) {
      throw new Error("API soʻrov vaqti tugadi. Qayta urinib koʻring.")
    }
    const baseUrl = getApiBaseUrl()
    throw new Error(
      `Serverga ulanish imkonsiz. Backend (Django) ishlayotganini tekshiring: ${baseUrl}. .env.local da NEXT_PUBLIC_API_URL ni tekshiring.`
    )
  }
  if (timeoutId) clearTimeout(timeoutId)
  if (!res.ok) {
    const text = await res.text()
    let errMessage = `API xatosi: ${res.status} ${res.statusText}`
    try {
      const j = JSON.parse(text)
      if (j.error) errMessage = j.error
      else if (j.detail) errMessage = typeof j.detail === "string" ? j.detail : JSON.stringify(j.detail)
    } catch {
      if (text) errMessage = text.slice(0, 200)
    }
    throw new Error(errMessage)
  }
  const text = await res.text()
  if (!text || text.trim() === "") {
    return undefined as T
  }
  try {
    return JSON.parse(text) as T
  } catch {
    throw new Error("Server notoʻgʻri javob qaytardi.")
  }
}
