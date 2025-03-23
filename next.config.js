/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configuration expérimentale compatible avec Next.js 15
  experimental: {
    // serverActions doit être un objet dans Next.js 15
    serverActions: {
      allowedOrigins: ['*'],
    },
  },
  // Ajouter cette configuration pour exclure les fichiers test de pdf-parse
  webpack: (config) => {
    // Ajoutez une règle pour ignorer les fichiers de test de pdf-parse
    config.module = config.module || {};
    config.module.exprContextCritical = false;
    
    return config;
  },
};

module.exports = nextConfig;