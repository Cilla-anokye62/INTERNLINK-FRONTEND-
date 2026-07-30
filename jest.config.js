module.exports = {
  preset: 'jest-expo',
  clearMocks: true,
  collectCoverageFrom: [
    'src/api/client.ts',
    'src/api/listingMappers.ts',
    'src/constants/languages.ts',
    '!**/node_modules/**',
  ],
  coverageDirectory: 'coverage',
  testPathIgnorePatterns: ['/node_modules/', '/dist/', '/.expo/'],
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@react-navigation/.*|react-native-svg|zustand)',
  ],
};
