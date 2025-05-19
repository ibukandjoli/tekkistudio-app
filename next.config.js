/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configuration expérimentale compatible avec Next.js 15
  experimental: {
    // serverActions doit être un objet dans Next.js 15
    serverActions: {
      allowedOrigins: ['*'],
    },
  },
  
  // Configuration des images
  images: {
    domains: [
      'res.cloudinary.com',
      'ythxumuniqxvfrwapfft.supabase.co', // Remplacez par votre domaine Supabase réel
    ],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  
  // Configuration webpack simplifiée
  webpack: (config, { isServer }) => {
    // Ignorer les modules côté client
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        child_process: false,
        path: false,
        os: false,
        crypto: false,
        stream: false,
        http: false,
        https: false,
        zlib: false,
        net: false,
        tls: false,
      };
    }
    
    // Ignorer complètement pdf-parse
    if (isServer) {
      config.resolve.alias['pdf-parse'] = false;
    }
    
    return config;
  },
  
  // Désactiver la vérification ESLint pendant le build
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  // Désactiver la vérification TypeScript pendant le build
  typescript: {
    ignoreBuildErrors: true,
  },
};

module.exports = nextConfig;