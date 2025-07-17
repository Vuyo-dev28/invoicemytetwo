/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'fuhrwwmojigaxglsdmfl.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/logos/**',
      },
    ],
  },
};

export default nextConfig;
