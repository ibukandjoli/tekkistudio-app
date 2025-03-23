/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configuration expérimentale compatible avec Next.js 15
  experimental: {
    // serverActions doit être un objet dans Next.js 15
    serverActions: {
      allowedOrigins: ['*'],
    },
  },
  // Ajouter cette configuration webpack
  webpack: (config, { isServer }) => {
    // Ignorer complètement pdf-parse en le remplaçant par un module vide
    if (isServer) {
      config.resolve.alias['pdf-parse'] = false;
    }
    
    return config;
  },
};

module.exports = nextConfig;