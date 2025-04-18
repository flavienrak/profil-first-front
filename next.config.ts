import type { NextConfig } from 'next';

const backendUri = process.env.NEXT_PUBLIC_API_URL;
const domains: string[] = ['images.unsplash.com'];

if (backendUri) {
  domains.push(new URL(backendUri).hostname);
}

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: domains,
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_VIDEO_URI: process.env.NEXT_PUBLIC_VIDEO_URI,
  },
};

export default nextConfig;
