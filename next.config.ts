import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // PGlite (the zero-setup fallback database) ships WebAssembly and must stay
  // outside the bundler. Not needed once DATABASE_URL points at PostgreSQL.
  serverExternalPackages: ["@electric-sql/pglite", "postgres", "bcryptjs"],
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "**.public.blob.vercel-storage.com" },
      { protocol: "https", hostname: "**.r2.dev" },
    ],
  },
};

export default nextConfig;
