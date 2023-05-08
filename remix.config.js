/** @type {import('@remix-run/dev').AppConfig} */
module.exports = {
  appDirectory: 'app',
  ignoredRouteFiles: ['**/.*'],
  watchPaths: ['./public'],
  devServerPort: 8003,
  serverModuleFormat: 'cjs',
  serverDependenciesToBundle: 'all',
  publicPath: (process.env.HYDROGEN_ASSET_BASE_URL ?? '/') + 'build/',
  serverPlatform: 'node',
  future: {
    v2_meta: true,
    v2_routeConvention: true,
    v2_errorBoundary: true,
    v2_normalizeFormMethod: true,
  },
  postcss: true,
  tailwind: true,
};
