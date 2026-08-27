/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Mismos dominios que el proyecto principal — las fotos de los
    // negocios (logos, Moments) viven en el mismo bucket de R2/S3.
    remotePatterns: [
      { protocol: "https", hostname: "*.r2.dev" },
      { protocol: "https", hostname: "*.r2.cloudflarestorage.com" },
      { protocol: "https", hostname: "*.amazonaws.com" },
    ],
  },
};

module.exports = nextConfig;
