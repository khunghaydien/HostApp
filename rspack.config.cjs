const Repack = require('@callstack/repack');
const { ExpoModulesPlugin } = require('@callstack/repack-plugin-expo-modules');

const MINI_APP_HOST = process.env.MINI_APP_HOST || 'localhost';
const MINI_APP_PORT = process.env.MINI_APP_PORT || '8086';

/**
 * Host app Rspack config for Re.Pack + Expo Modules + Module Federation.
 *
 * MiniApp is served from http://localhost:8086 (npm run start:mf in MiniApp).
 * Override with MINI_APP_HOST / MINI_APP_PORT for a device or LAN IP.
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
        miniApp: `miniApp@http://${MINI_APP_HOST}:${MINI_APP_PORT}/${platform}/mf-manifest.json`,
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
