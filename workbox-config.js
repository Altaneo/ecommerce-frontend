// workbox-config.js
module.exports = {
    globDirectory: 'build/',
    globPatterns: [
      '**/*.{html,js,css,png,jpg,jpeg,gif,svg,woff2,woff}',
    ],
    swDest: 'build/service-worker.js',
    mode: 'production',
    skipWaiting: true,
    clientsClaim: true,
  };
  