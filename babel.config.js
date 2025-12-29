module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      [
        'babel-preset-expo',
        {
          jsxRuntime: 'automatic',
          disableImportExportExtensionInterop: false,
        },
      ],
    ],
    plugins: [
      // Disable React Compiler to avoid compatibility issues
      ['babel-plugin-react-compiler', { disabled: true }],
    ],
  };
};
