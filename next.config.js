/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      'books.google.com',
      'example.com',
      'kentuckynerd.com',
      'm.media-amazon.com' // Add this domain to match the image URLs in your database
    ],
  },
};

module.exports = nextConfig;
