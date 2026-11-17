import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // pour l'envoi des photos de restos depuis l'admin
    serverActions: { bodySizeLimit: "5mb" },
  },
  // En-têtes de sécurité de base
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        ],
      },
    ];
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
