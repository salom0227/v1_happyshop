"use client"

import { getCategories } from "@/services/api"
import type { Category } from "@/types/category"

/** Client-side cache 1 daqiqa — Header va MobileNav bir marta so'rov yuboradi */
const CACHE_MS = 60_000
let cached: { data: Category[]; time: number } | null = null

export async function getCategoriesCached(): Promise<Category[]> {
  if (typeof window !== "undefined" && cached && Date.now() - cached.time < CACHE_MS) {
    return cached.data
  }
  const data = await getCategories()
  if (typeof window !== "undefined") {
    cached = { data, time: Date.now() }
  }
  return data
}
