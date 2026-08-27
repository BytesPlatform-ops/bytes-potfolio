import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    /**
     * Next 16 only generates the qualities listed here; anything else warns in
     * dev and falls back in production. These are the values actually passed
     * to `<Image quality>` across the site — keep the two in sync.
     */
    qualities: [72, 74, 75, 80, 82, 84, 86, 88],
  },
};

export default nextConfig;
