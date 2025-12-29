const { getDefaultConfig } = require('expo/metro-config');
const config = getDefaultConfig(__dirname);

config.transformer = {
  ...config.transformer,
  babelTransformerPath: require.resolve('react-native-web/dist/cjs/modules/reactNativeWeb.js'),
};

module.exports = config;
