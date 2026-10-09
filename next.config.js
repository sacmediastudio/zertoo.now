/** @type {import('next').NextConfig} */
const nextConfig = {
  // La web app usa la MISMA API pública que la app nativa
  // (saas-platform, /api/public/eats/*). Se consulta a través de este
  // proxy del propio servidor para no depender de CORS ni exponer
  // otro dominio al navegador.
  async rewrites() {
    return [{ source: "/eats-api/:path*", destination: "https://zertoo.app/api/public/eats/:path*" }];
  },
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
