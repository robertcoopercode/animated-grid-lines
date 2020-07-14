module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  settings: {
    react: {
      version: 'latest',
    },
  },
  env: {
    browser: true,
    node: true,
    es6: true,
    jest: true,
  },
  plugins: ['react', 'react-hooks', '@typescript-eslint', 'import'],
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'prettier/@typescript-eslint',
    'plugin:prettier/recommended',
  ],
  rules: {
    'react/self-closing-comp': [
      'error',
      {
        component: true,
        html: false,
      },
    ],
    'react/prop-types': 'off',
    'react/react-in-jsx-scope': 'off', // Next.js imports React automatically in each file
    strict: ['error', 'global'],
    'no-undef': 'error',
    'spaced-comment': [
      'error',
      'always',
      {
        block: {
          exceptions: ['*'],
          balanced: true,
        },
      },
    ],
    curly: 'error',
    'eol-last': 'error',
    'guard-for-in': 'error',
    'no-labels': 'error',
    'no-caller': 'error',
    'no-bitwise': 'error',
    'no-console': [
      'error',
      { allow: ['debug', 'info', 'time', 'timeEnd', 'trace'] },
    ],
    'no-new-wrappers': 'error',
    'no-debugger': 'error',
    'no-eval': 'error',
    'no-redeclare': 'error',
    'no-fallthrough': 'error',
    'no-trailing-spaces': 'error',
    'no-var': 'error',
    'brace-style': 'error',
    'prefer-template': 'error',
    radix: 'error',
    'space-before-blocks': 'error',
    'prefer-destructuring': [
      'error',
      {
        array: false,
        object: true,
      },
      {
        enforceForRenamedProperties: false,
      },
    ],
    'import/order': ['error', { 'newlines-between': 'never' }],
    '@typescript-eslint/no-use-before-define': 'error',
    '@typescript-eslint/no-inferrable-types': 'error',
    '@typescript-eslint/type-annotation-spacing': 'error',
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
    '@typescript-eslint/camelcase': 'off',
    '@typescript-eslint/no-unused-vars': [
      'error',
      { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
    ],
    '@typescript-eslint/explicit-function-return-type': 'off',
    radix: 'off',
    'react/self-closing-comp': 'off',
    eqeqeq: 'warn',
  },
};
