const path = require('path');

module.exports = {
  webpack: {
    alias: {
      '@src': path.resolve(__dirname, 'src'),
      '@containers': path.resolve(__dirname, 'src/containers'),
    },
  },
  jest: {
    configure: {
      moduleNameMapper: {
        '^@src/(.*)$': '<rootDir>/src/$1',
        '^@containers/(.*)$': '<rootDir>/src/containers/$1',
      },
    },
  },
};
