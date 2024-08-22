const webpack = require("webpack");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    config.plugins.push(
      new webpack.ProvidePlugin({
        $: "jquery",
        jQuery: "jquery",
        "window.jQuery": "jquery",
      }));
    return config;
  },
  rewrites: async () => {
    return [
      {
        source: '/api/:path*',
        destination: (process.env.NODE_ENV === "development" && "http://localhost:5000/api/:path*") || "/api",
      },
    ];
  }
}

module.exports = nextConfig
