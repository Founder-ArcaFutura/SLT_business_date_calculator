const createExpoWebpackConfigAsync = require('@expo/webpack-config');

module.exports = async function(env = {}, argv) {
  // HtmlWebpackPlugin uses this property when emitting links such as the
  // manifest reference, so we also set the Expo web environment variable that
  // it checks. This mirrors passing `--public-url ./` when running `expo export`.
  env.EXPO_WEBPACK_PUBLIC_PATH = './';
  process.env.EXPO_WEBPACK_PUBLIC_PATH = './';

  const config = await createExpoWebpackConfigAsync(env, argv);

  // Ensure generated asset URLs are relative so the build can be hosted from any
  // base path (for example on GitHub Pages or behind a reverse proxy).
  if (config?.output) {
    config.output.publicPath = './';
  }

  return config;
};
