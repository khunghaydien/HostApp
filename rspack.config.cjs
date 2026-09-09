const path = require('path');
const Repack = require('@callstack/repack');
const { ExpoModulesPlugin } = require('@callstack/repack-plugin-expo-modules');

const MINI_APP_HOST = process.env.MINI_APP_HOST || 'localhost';
const INTERVIEW_PORT = process.env.INTERVIEW_PORT || '8084';
const LIBRARY_PORT = process.env.LIBRARY_PORT || '8085';

/**
 * Host app Rspack config for Re.Pack + Expo Modules + Module Federation.
 *
 * Remotes:
 * - interview @ :8084
 * - library   @ :8085
 *
 * Override host/ports with MINI_APP_HOST / INTERVIEW_PORT / LIBRARY_PORT.
 */
module.exports = Repack.defineRspackConfig(({ platform, mode, devServer }) => ({
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
  plugins: [
    new Repack.RepackPlugin(),
    new ExpoModulesPlugin(),
    new Repack.plugins.ModuleFederationPluginV2({
      name: 'host',
      remotes: {
        interview: `interview@http://${MINI_APP_HOST}:${INTERVIEW_PORT}/${platform}/mf-manifest.json`,
        library: `library@http://${MINI_APP_HOST}:${LIBRARY_PORT}/${platform}/mf-manifest.json`,
      },
      dts: false,
      shared: {
        react: {
          ...Repack.Federated.SHARED_REACT,
          eager: true,
          requiredVersion: '19.2.3',
        },
        'react-native': {
          ...Repack.Federated.SHARED_REACT_NATIVE,
          eager: true,
          requiredVersion: '0.86.3',
        },
      },
    }),
  ],
}));
