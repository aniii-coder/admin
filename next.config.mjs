/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  reactStrictMode: true,
  env: {
    BACKEND_URL: process.env.BACKEND_URL,
  },
  experimental: {
    allowedDevOrigins: ['192.168.0.103:3000'],
  },
};

export default nextConfig;