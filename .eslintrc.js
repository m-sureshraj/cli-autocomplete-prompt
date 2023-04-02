module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2019,
  },
  env: {
    node: true,
    es6: true,
  },
  // https://typescript-eslint.io/getting-started#configuration-values
  plugins: ['@typescript-eslint'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',

    // https://github.com/prettier/eslint-plugin-prettier#recommended-configuration
    'plugin:prettier/recommended',
  ],

  // 0: off, 1: warn, 2: error
  rules: {
    'no-console': 0,
    'prefer-template': 2,
    curly: [2, 'multi-line'],

    '@typescript-eslint/no-unused-vars': [2, { args: 'all', argsIgnorePattern: '^_' }],
    '@typescript-eslint/no-empty-function': [2, { allow: ['methods'] }],
  },
};
