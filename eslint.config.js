const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');

module.exports = defineConfig([
  ...expoConfig,
  {
    ignores: [
      '.expo/**',
      '.devin/**',
      'coverage/**',
      'dist/**',
      'node_modules/**',
    ],
    rules: {
      // React Native text nodes do not render through an HTML parser.
      'react/no-unescaped-entities': 'off',
    },
  },
]);
