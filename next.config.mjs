/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  reactStrictMode: true,
  env: {
    BACKEND_URL: process.env.BACKEND_URL,
    EDITOR_KEY: process.env.EDITOR_KEY
  },
   images: {
    domains: ["lh3.googleusercontent.com"],
  },

};

export default nextConfig;