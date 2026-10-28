const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:3002";

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Produces a minimal self-contained server in .next/standalone (used by the Dockerfile).
  output: "standalone",

  // Browser requests to /api/backend/* are forwarded to the backend,
  // so you don't need to configure CORS on it.
  async rewrites() {
    return [
      { source: "/api/backend/:path*", destination: `${BACKEND_URL}/:path*` },
    ];
  },
};

export default nextConfig;
