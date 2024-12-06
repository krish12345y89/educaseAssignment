/** @type {import('jest').Config} */
const config = {
    testEnvironment: 'node', // Use Node environment for testing
    moduleFileExtensions: ['js', 'json', 'node'], // Supported file extensions
    transform: {
      '^.+\\.js$': 'babel-jest', // Transform JavaScript files using Babel
    },
    testPathIgnorePatterns: ['/node_modules/', '/src/'], // Ignore node_modules and src directories
    transformIgnorePatterns: [
      '/node_modules/', // Ignore transforming node_modules
    ],
  };
  
  export default config;