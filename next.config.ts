import type { NextConfig } from "next";
const nextConfig: NextConfig = {
  poweredByHeader: false,
  images: {
    localPatterns: [
      { pathname: "/**", search: "" },
      // Portfolio replacements use content hashes in the query string.
      { pathname: "/projects/**" },
    ],
  },
  async redirects() {
    return [
      { source: "/work/forma", destination: "/work/form", permanent: true },
      { source: "/work/morrow", destination: "/work/orbit", permanent: true },
      {
        source: "/work/common-ground",
        destination: "/work/kova",
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "DENY" },
        ],
      },
    ];
  },
};
export default nextConfig;
