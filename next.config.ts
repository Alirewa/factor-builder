import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'export',       // pure static → works on cPanel / DirectAdmin / GitHub Pages / Netlify
  trailingSlash: true,    // /about → /about/index.html  (required for static hosts)
  reactStrictMode: true,
  compress: true,
  poweredByHeader: false,
  images: {
    unoptimized: true,    // required when output:'export' (no Next.js image server)
  },
};

export default nextConfig;
