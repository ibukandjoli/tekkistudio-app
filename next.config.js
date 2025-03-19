/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configuration expérimentale compatible avec Next.js 15
  experimental: {
    // Vous pouvez ajouter d'autres options expérimentales valides ici si nécessaire
    // Par exemple:
    serverActions: true,
    // L'option missingSuspenseWithCSRBailout n'est plus supportée dans Next.js 15
  }
};

module.exports = nextConfig;