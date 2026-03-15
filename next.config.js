/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configuration expérimentale compatible avec Next.js 16
  experimental: {
    // serverActions est maintenant activé par défaut dans Next.js 16
  },

  // Pages masquées — redirigées vers l'accueil
  async redirects() {
    return [
      { source: '/acquisition-options', destination: '/', permanent: false },
      { source: '/business', destination: '/', permanent: false },
      { source: '/business/:path*', destination: '/', permanent: false },
      { source: '/comparatif-acquisition', destination: '/', permanent: false },
      { source: '/expertise', destination: '/', permanent: false },
      { source: '/nos-formules', destination: '/', permanent: false },
      { source: '/nos-formules/:path*', destination: '/', permanent: false },
      { source: '/marques', destination: '/', permanent: false },
      { source: '/marques/:path*', destination: '/', permanent: false },
    ];
  },

  // Configuration Turbopack (vide pour Next.js 16)
  turbopack: {},

  // Configuration des images avec remotePatterns (nouvelle syntaxe)
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: 'ythxumuniqxvfrwapfft.supabase.co',
      },
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

  // Désactiver la vérification TypeScript pendant le build
  typescript: {
    ignoreBuildErrors: true,
  },
};

module.exports = nextConfig;