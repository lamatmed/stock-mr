/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: true, // Active les actions serveur
  },
  
  reactStrictMode: true,
};

module.exports = nextConfig;
