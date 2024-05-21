/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['books.google.com', 'example.com', 'kentuckynerd.com'], // Add all the domains you need here
  },
}

module.exports = nextConfig
