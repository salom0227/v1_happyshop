/**
 * API base URL from environment. Defaults to Django backend.
 * Set NEXT_PUBLIC_API_URL in .env.local (e.g. http://localhost:8000)
 */
const DEFAULT_API_URL = "http://localhost:8000"

export function getApiBaseUrl(): string {
  return process.env.NEXT_PUBLIC_API_URL || DEFAULT_API_URL
}

const API_PREFIX = "/api"

export function getApiUrl(path: string): string {
  const base = getApiBaseUrl().replace(/\/$/, "")
  const p = path.startsWith("/") ? path : `/${path}`
  return `${base}${p.startsWith(API_PREFIX) ? p : `${API_PREFIX}${p}`}`
}
