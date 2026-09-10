const path = require('path');
const Repack = require('@callstack/repack');
const { ExpoModulesPlugin } = require('@callstack/repack-plugin-expo-modules');

/**
 * Host app Rspack config for Re.Pack + Expo Modules.
 */
module.exports = Repack.defineRspackConfig(({ mode, devServer }) => ({
  context: __dirname,
  mode,
  entry: './index.ts',
  output: {
    uniqueName: 'host',
  },
  // Expo DEBUG builds request /.expo/.virtual-metro-entry.bundle;
  // Re.Pack serves /index.bundle — rewrite so the host can load JS.
  ...(devServer
    ? {
        devServer: {
          ...devServer,
          proxy: [
            {
              context: ['/.expo/.virtual-metro-entry'],
              pathRewrite: {
                '^/.expo/.virtual-metro-entry': '/index',
              },
            },
          ],
        },
      }
    : {}),
  resolve: {
    ...Repack.getResolveOptions({ enablePackageExports: true }),
    alias: {
      '@': path.resolve(__dirname, 'src'),
      // Re.Pack + package exports can resolve the TS source and break named
      // exports (Svg/Path become undefined → red "Un" boxes). Force prebuilt JS.
      'react-native-svg': path.resolve(
        __dirname,
        'node_modules/react-native-svg/lib/module/index.js',
      ),
    },
  },
  module: {
    rules: [
      {
        test: /\.[cm]?[jt]sx?$/,
        type: 'javascript/auto',
        use: {
          loader: '@callstack/repack/babel-swc-loader',
          parallel: true,
          options: {},
        },
      },
      ...Repack.getAssetTransformRules(),
    ],
  },
  plugins: [new Repack.RepackPlugin(), new ExpoModulesPlugin()],
}));
