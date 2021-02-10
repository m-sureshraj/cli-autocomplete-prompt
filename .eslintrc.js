module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2016,
  },
  env: {
    node: true,
    es6: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier/@typescript-eslint',
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
