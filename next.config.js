// next.config.js
const withPWA = require('next-pwa')
const withImages = require('next-images')
const withPlugins = require('next-compose-plugins')

const esLintConf = {
  eslint: {
  // Warning: Dangerously allow production builds to successfully complete even if
  // your project has ESLint errors.
  ignoreDuringBuilds: true,
}
}

module.exports = withPlugins([
  [
    withImages,
    {
      images: {
        domains: ['avatars.githubusercontent.com']
      }
    }
  ],
  [
    withPWA,
    {
      pwa: {
        disable: process.env.NODE_ENV === 'development',
        dest: 'public'
      }
    }
  ]
],esLintConf)
