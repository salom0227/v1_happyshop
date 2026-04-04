/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: false,
    remotePatterns: [
      { protocol: "http", hostname: "127.0.0.1", port: "8000", pathname: "/media/**" },
      { protocol: "http", hostname: "localhost", port: "8000", pathname: "/media/**" },
      { protocol: "http", hostname: "192.168.0.134", port: "8000", pathname: "/media/**" },
      { protocol: "https", hostname: "placehold.co", pathname: "/**" },
      { protocol: "https", hostname: "v1-happyshop-3.onrender.com", pathname: "/media/**" },
      { protocol: "https", hostname: "vsubrvakueksfxnqvwpz.supabase.co", pathname: "/**" },
    ],
  },
  compress: true,
  poweredByHeader: false,
  experimental: {
    staleTimes: {
      dynamic: 60,
      static: 300,
    },
  },
}
export default nextConfig
