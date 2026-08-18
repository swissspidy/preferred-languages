const wordpress = require( '@wordpress/eslint-plugin' );

module.exports = [
	{
		ignores: [ 'build/**', 'vendor/**', 'eslint.config.js' ],
	},
	...wordpress.configs.recommended,
	{
		languageOptions: {
			parserOptions: {
				babelOptions: {
					presets: [ '@wordpress/babel-preset-default' ],
				},
			},
		},
	},
	...wordpress.configs[ 'test-playwright' ].map( ( config ) => ( {
		...config,
		files: [ 'tests/e2e/specs/**/*.ts' ],
	} ) ),
];
