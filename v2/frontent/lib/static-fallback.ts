/** Empty fallbacks for sections not backed by API (banners, blog, promotions). */

export interface Banner {
  id: number
  title: string
  subtitle: string
  image: string
  buttonText: string
  link: string
}

export interface Promotion {
  id: number
  title: string
  image: string
  dateRange: string
  slug: string
}

export interface BlogPost {
  id: number
  title: string
  date: string
  image: string
  slug: string
}

export const banners: Banner[] = []
export const promotions: Promotion[] = []
export const blogPosts: BlogPost[] = []
export const filterBrands: { name: string; count: number }[] = []
