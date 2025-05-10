/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    // remotePatterns: ['firebasestorage.googleapis.com']
    remotePatterns: [{
      protocol: 'https',
      hostname: 'firebasestorage.googleapis.com',
      port: '',
      pathname: '/v0/b/perxels-d6cf4.appspot.com/**'
    }]
  }
}

module.exports = nextConfig
