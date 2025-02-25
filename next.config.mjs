/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      domains: ["res.cloudinary.com"],
        // remotePatterns: [
        //   {
        //     protocol: "https",
        //     hostname: "firebasestorage.googleapis.com",
        //   },
        // ],
      },
      
    typescript: {
        ignoreBuildErrors: true,
    }
};

export default nextConfig;
