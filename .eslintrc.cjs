module.exports = {
  parserOptions: {
    ecmaVersion: 8,
    requireConfigFile: false,
  },
  extends: [
    '@quero/typescript',
  ],
  overrides: [{
    files: '**/*.test.*',
    globals: {
      test: 'readonly',
      describe: 'readonly',
      it: 'readonly',
      expect: 'readonly',
    },
  }],
};
