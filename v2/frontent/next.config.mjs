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
    ],
  },
  // Tezlik: kompressiya (default), cache
  compress: true,
  poweredByHeader: false,
  // Bosh sahifa ma'lumotlari 5 daqiqa cache (backend bilan bir xil)
  experimental: {
    staleTimes: {
      dynamic: 60,
      static: 300,
    },
  },
}

export default nextConfig
