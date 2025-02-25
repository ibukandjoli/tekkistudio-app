/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configuration pour résoudre les problèmes de useSearchParams
  experimental: {
    // Désactiver l'erreur stricte pour useSearchParams
    missingSuspenseWithCSRBailout: false
  }
};

module.exports = nextConfig;