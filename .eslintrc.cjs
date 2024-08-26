module.exports = {
  env: {
    browser: true,
    es2021: true,
    jasmine: true,
    mocha: true,
    mongo: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:you-dont-need-lodash-underscore/compatible',
  ],
  globals: {
    FinalizationRegistry: false,
    WeakRef: false,
    globalThis: false,
  },
  parser: '@babel/eslint-parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2021,
    requireConfigFile: false,
    sourceType: 'module',
  },
  root: true,
  rules: {
    'accessor-pairs': 'error',
    'array-bracket-newline': [
      'warn',
      {
        multiline: true,
      },
    ],
    'array-bracket-spacing': [
      'error',
      'never',
    ],
    'array-callback-return': 'error',
    'array-element-newline': [
      'warn',
      {
        ArrayExpression: 'always',
        ArrayPattern: 'consistent',
      },
    ],
    'arrow-parens': [
      'error',
      'always',
    ],
    'arrow-spacing': [
      'error',
      {
        after: true,
        before: true,
      },
    ],
    'block-spacing': 'error',
    'brace-style': [
      'error',
      '1tbs',
      {
        allowSingleLine: true,
      },
    ],
    'camelcase': 'warn',
    'comma-dangle': [
      'error',
      'always-multiline',
    ],
    'comma-spacing': 'error',
    'comma-style': 'error',
    'computed-property-spacing': 'error',
    'curly': [
      'error',
      'multi-line',
    ],
    'default-case': 'warn',
    'default-case-last': 'error',
    'dot-location': [
      'error',
      'property',
    ],
    'dot-notation': 'error',
    'eol-last': 'error',
    'eqeqeq': [
      'error',
      'smart',
    ],
    'func-call-spacing': 'error',
    'func-name-matching': 'error',
    'func-style': [
      'error',
      'declaration',
      {
        allowArrowFunctions: true,
      },
    ],
    'function-paren-newline': [
      'warn',
      'multiline-arguments',
    ],
    'generator-star-spacing': [
      'error',
      {
        after: true,
        before: false,
      },
    ],
    'grouped-accessor-pairs': 'error',
    'guard-for-in': 'error',
    'implicit-arrow-linebreak': [
      'error',
      'beside',
    ],
    'indent': [
      'error',
      2,
      {
        ArrayExpression: 'first',
        CallExpression: {
          arguments: 'first',
        },
        FunctionDeclaration: {
          parameters: 'first',
        },
        FunctionExpression: {
          parameters: 'first',
        },
        ImportDeclaration: 'first',
        MemberExpression: 'off',
        ObjectExpression: 'first',
        SwitchCase: 1,
        VariableDeclarator: 'first',
        ignoredNodes: [
          'ConditionalExpression',
          'JSXElement *',
          'ObjectPattern',
          'TemplateLiteral',
        ],
      },
    ],
    'key-spacing': [
      'error',
      {
        mode: 'strict',
      },
    ],
    'keyword-spacing': [
      'error',
      {
        after: true,
        before: true,
      },
    ],
    'lines-between-class-members': [
      'error',
      'always',
      {
        exceptAfterSingleLine: true,
      },
    ],
    'max-classes-per-file': [
      'error',
      2,
    ],
    'max-len': [
      'error',
      {
        code: 120,
        ignoreRegExpLiterals: true,
        ignoreStrings: true,
        ignoreTrailingComments: true,
        ignoreUrls: true,
        tabWidth: 2,
      },
    ],
    'new-parens': 'error',
    'newline-per-chained-call': 'off',
    'no-await-in-loop': 'error',
    'no-console': 'warn',
    'no-constructor-return': 'error',
    'no-debugger': 'warn',
    'no-duplicate-imports': 'error',
    'no-else-return': [
      'error',
      {
        allowElseIf: false,
      },
    ],
    'no-empty-function': [
      'error',
      {
        allow: ['constructors'],
      },
    ],
    'no-extend-native': 'error',
    'no-extra-bind': 'error',
    'no-extra-semi': 'error',
    'no-lone-blocks': 'error',
    'no-lonely-if': 'error',
    'no-loss-of-precision': 'warn',
    'no-mixed-operators': 'error',
    'no-multiple-empty-lines': [
      'error',
      {
        max: 2,
        maxBOF: 0,
        maxEOF: 1,
      },
    ],
    'no-promise-executor-return': 'error',
    'no-proto': 'error',
    'no-prototype-builtins': 'warn',
    'no-return-await': 'error',
    'no-self-compare': 'error',
    'no-tabs': 'error',
    'no-template-curly-in-string': 'error',
    'no-throw-literal': 'error',
    'no-trailing-spaces': 'error',
    'no-undef-init': 'error',
    'no-unneeded-ternary': 'error',
    'no-unreachable-loop': 'error',
    'no-use-before-define': [
      'error',
      {
        classes: true,
        functions: false,
        variables: false,
      },
    ],
    'no-useless-backreference': 'warn',
    'no-useless-call': 'error',
    'no-useless-computed-key': 'error',
    'no-useless-concat': 'error',
    'no-useless-constructor': 'warn',
    'no-useless-return': 'error',
    'no-whitespace-before-property': 'error',
    'object-curly-newline': [
      'error',
      {
        ExportDeclaration: {
          minProperties: 2,
          multiline: true,
        },
        ImportDeclaration: {
          minProperties: 2,
          multiline: true,
        },
        ObjectExpression: {
          consistent: true,
          minProperties: 3,
          multiline: true,
        },
        ObjectPattern: {
          consistent: true,
        },
      },
    ],
    'object-curly-spacing': [
      'error',
      'always',
    ],
    'object-shorthand': [
      'error',
      'properties',
    ],
    'one-var': [
      'error',
      {
        initialized: 'never',
        uninitialized: 'consecutive',
      },
    ],
    'one-var-declaration-per-line': 'error',
    'operator-linebreak': [
      'error',
      'before',
      {
        overrides: {
          '=': 'after',
        },
      },
    ],
    'padded-blocks': [
      'error',
      {
        classes: 'always',
      },
      {
        allowSingleLineBlocks: true,
      },
    ],
    'padding-line-between-statements': [
      'error',
      {
        blankLine: 'always',
        next: '*',
        prev: 'class',
      },
      {
        blankLine: 'always',
        next: '*',
        prev: 'default',
      },
      {
        blankLine: 'always',
        next: '*',
        prev: 'multiline-block-like',
      },
      {
        blankLine: 'always',
        next: '*',
        prev: [
          'const',
          'let',
          'var',
        ],
      },
      {
        blankLine: 'any',
        next: [
          'const',
          'let',
          'var',
        ],
        prev: [
          'const',
          'let',
          'var',
        ],
      },
      {
        blankLine: 'always',
        next: 'return',
        prev: '*',
      },
      {
        blankLine: 'never',
        next: 'import',
        prev: 'import',
      },
    ],
    'prefer-arrow-callback': 'warn',
    'prefer-const': [
      'error',
      {
        destructuring: 'all',
      },
    ],
    'prefer-destructuring': 'warn',
    'prefer-exponentiation-operator': 'warn',
    'prefer-numeric-literals': 'warn',
    'prefer-object-spread': 'warn',
    'prefer-rest-params': 'warn',
    'prefer-spread': 'warn',
    'prefer-template': 'warn',
    'quotes': [
      'error',
      'single',
      {
        allowTemplateLiterals: false,
        avoidEscape: true,
      },
    ],
    'radix': [
      'warn',
      'as-needed',
    ],
    'require-await': 'error',
    'rest-spread-spacing': [
      'error',
      'never',
    ],
    'semi': [
      'error',
      'always',
    ],
    'semi-spacing': [
      'error',
      {
        after: true,
        before: false,
      },
    ],
    'sort-keys': 'off',
    'sort-vars': 'warn',
    'space-before-blocks': [
      'error',
      'always',
    ],
    'space-before-function-paren': [
      'error',
      {
        anonymous: 'always',
        asyncArrow: 'always',
        named: 'never',
      },
    ],
    'space-in-parens': [
      'error',
      'never',
    ],
    'space-infix-ops': 'error',
    'space-unary-ops': [
      'warn',
      {
        nonwords: false,
        words: true,
      },
    ],
    'spaced-comment': [
      'error',
      'always',
      {
        block: {
          balanced: true,
          exceptions: [
            '!',
            '*',
            '+',
            '/',
            '<',
            '>',
            '-',
          ],
        },
        line: {
          exceptions: [
            '!',
            '*',
            '+',
            '/',
            '<',
            '>',
            '-',
          ],
        },
      },
    ],
    'symbol-description': 'error',
    'template-curly-spacing': [
      'error',
      'always',
    ],
    'yield-star-spacing': [
      'error',
      'after',
    ],
    'yoda': [
      'warn',
      'never',
    ],
  },
};
