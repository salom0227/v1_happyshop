/** API: /api/banners/ — bosh sahifa hero bannerlari */
export interface Banner {
  id: number
  title: string
  subtitle: string
  image: string
  buttonText: string
  link: string
  order: number
}
