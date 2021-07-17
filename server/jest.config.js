module.exports = {
  setupFiles: ['dotenv/config'],
  coveragePathIgnorePatterns: ['node_modules', '.*js', 'src/index.ts'],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80
    }
  }
};
