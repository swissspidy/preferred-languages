const baseConfig = require( '@wordpress/scripts/config/jest-unit.config' );

/**
 * `@wordpress/components` pulls in ESM-only packages, which Jest's CommonJS
 * runtime cannot `require()` as-is. Transpile them instead of ignoring them
 * like the rest of `node_modules`.
 */
const esmPackages = [ '@wordpress/theme' ];

module.exports = {
	...baseConfig,
	transform: {
		// Same transform as `@wordpress/scripts`, but for `.mjs` files as well.
		'\\.[mc]?[jt]sx?$': baseConfig.transform[ '\\.[jt]sx?$' ],
	},
	transformIgnorePatterns: [
		`/node_modules/(?!(${ esmPackages.join( '|' ) })/)`,
	],
};
