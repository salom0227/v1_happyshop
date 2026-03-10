/**
 * Canonical site URL for meta tags, Open Graph, and structured data.
 * Set NEXT_PUBLIC_SITE_URL in .env (e.g. https://happyshop.uz)
 */
export function getSiteUrl(): string {
  const url = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
  return url.replace(/\/$/, "")
}
