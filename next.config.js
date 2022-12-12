/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
};

module.exports = {
  images: {
    domains: [
      "static-cdn.jtvnw.net",
      "clips-media-assets2.twitch.tv",
      "i.ytimg.com",
    ],
  },
};
