import type {NextConfig} from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        hostname: 'h5c7kf26ia.ufs.sh',
      },
      {
        hostname: 'lh3.googleusercontent.com', // Google avatars
      },
      {
        hostname: 'avatars.githubusercontent.com', // GitHub avatars
      },
      {
        hostname: 'cdn.discordapp.com', // Discord
      },
      {
        hostname: 'platform-lookaside.fbsbx.com', // Facebook
      },
      {
        hostname: 'pbs.twimg.com', // Twitter
      },
      {
        hostname: 'media.licdn.com', // LinkedIn
      }
    ]
  }
};

export default nextConfig;
