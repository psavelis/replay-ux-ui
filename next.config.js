/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "avatars.steamstatic.com"
      },
      {
        protocol: "https",
        hostname: "nextuipro.nyc3.cdn.digitaloceanspaces.com"
      }
    ]
  }
}

module.exports = nextConfig
