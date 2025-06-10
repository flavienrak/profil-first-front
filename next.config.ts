import type { NextConfig } from 'next';

const nodeEnv = process.env.NODE_ENV;
const apiUrl = process.env.NEXT_PUBLIC_API_URL;

const remotePatterns: { protocol: 'http' | 'https'; hostname: string }[] = [
  { protocol: 'https', hostname: 'images.unsplash.com' },
];

if (apiUrl) {
  const url = new URL(apiUrl);
  const protocol = url.protocol.replace(':', '');

  if (protocol === 'http' || protocol === 'https') {
    remotePatterns.push({
      protocol,
      hostname: url.hostname,
    });
  }
}

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns,
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_VIDEO_URI: process.env.NEXT_PUBLIC_VIDEO_URI,
  },
  reactStrictMode: nodeEnv === 'production' ? false : true,
};

export default nextConfig;
