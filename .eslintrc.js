module.exports = {
    env: {
        es6: true,
        node: true
    },
    parser: '@typescript-eslint/parser',
    parserOptions: {
        project: 'tsconfig.json',
        sourceType: 'module'
    },
    plugins: ['@typescript-eslint', '@typescript-eslint/tslint'],
    rules: {
        '@typescript-eslint/consistent-type-assertions': 'error',
        '@typescript-eslint/indent': 'off',
        '@typescript-eslint/member-delimiter-style': [
            'off',
            'error',
            {
                multiline: {
                    delimiter: 'none',
                    requireLast: true
                },
                singleline: {
                    delimiter: 'semi',
                    requireLast: false
                }
            }
        ],
        '@typescript-eslint/no-floating-promises': 'warn',
        '@typescript-eslint/no-misused-new': 'error',
        '@typescript-eslint/no-unnecessary-qualifier': 'warn',
        '@typescript-eslint/no-unnecessary-type-assertion': 'warn',
        '@typescript-eslint/prefer-namespace-keyword': 'warn',
        '@typescript-eslint/quotes': 'off',
        '@typescript-eslint/semi': ['off', null],
        '@typescript-eslint/space-within-parens': ['off', 'never'],
        '@typescript-eslint/type-annotation-spacing': 'warn',
        '@typescript-eslint/unified-signatures': 'warn',
        'arrow-parens': ['off', 'as-needed'],
        camelcase: 'warn',
        'capitalized-comments': 'warn',
        curly: ['warn', 'all'],
        'eol-last': 'warn',
        eqeqeq: ['warn', 'smart'],
        'id-blacklist': [
            'error',
            'any',
            'Number',
            'number',
            'String',
            'string',
            'Boolean',
            'boolean',
            'Undefined',
            'undefined'
        ],
        'id-match': 'off',
        'linebreak-style': 'off',
        'max-len': 'off',
        'new-parens': 'off',
        'newline-per-chained-call': 'off',
        'no-caller': 'error',
        'no-cond-assign': 'error',
        'no-constant-condition': 'error',
        'no-control-regex': 'warn',
        'no-duplicate-imports': 'error',
        'no-empty': 'warn',
        'no-eval': 'error',
        'no-extra-semi': 'warn',
        'no-fallthrough': 'warn',
        'no-invalid-regexp': 'error',
        'no-irregular-whitespace': 'off',
        'no-multiple-empty-lines': 'off',
        'no-redeclare': 'error',
        'no-regex-spaces': 'warn',
        'no-return-await': 'warn',
        'no-throw-literal': 'error',
        'no-trailing-spaces': 'off',
        'no-unused-expressions': [
            'error',
            {
                allowTaggedTemplates: true,
                allowShortCircuit: true
            }
        ],
        'no-unused-labels': 'error',
        'no-var': 'error',
        'one-var': ['error', 'never'],
        'quote-props': 'off',
        radix: 'error',
        'space-before-function-paren': 'off',
        'spaced-comment': 'warn',
        'use-isnan': 'error',
        '@typescript-eslint/tslint/config': [
            'error',
            {
                rules: {
                    'jsdoc-format': true,
                    'no-reference-import': true,
                    'strict-type-predicates': true
                }
            }
        ]
    }
};
