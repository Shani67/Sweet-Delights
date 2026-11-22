import type { NextConfig } from "next";

// Product images come from the WordPress media library when a backend is configured.
const wordpressUrl = process.env.WORDPRESS_GRAPHQL_URL
  ? new URL(process.env.WORDPRESS_GRAPHQL_URL)
  : undefined;

const isLocalBackend =
  wordpressUrl !== undefined && ["localhost", "127.0.0.1"].includes(wordpressUrl.hostname);

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: wordpressUrl
      ? [
          {
            protocol: wordpressUrl.protocol.replace(":", "") as "http" | "https",
            hostname: wordpressUrl.hostname,
            port: wordpressUrl.port,
            pathname: "/wp-content/uploads/**",
          },
        ]
      : [],
    // Only needed for the Docker backend on localhost; never enabled for a public host.
    dangerouslyAllowLocalIP: isLocalBackend,
  },
  poweredByHeader: false,
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];
  },
};

export default nextConfig;
