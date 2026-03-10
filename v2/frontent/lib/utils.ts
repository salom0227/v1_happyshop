import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(price: number | string): string {
  const n = typeof price === "string" ? parseFloat(price) : price
  if (Number.isNaN(n)) return "0"
  return Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")
}
