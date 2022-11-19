const { resolve } = require( 'path' );
const RtlCssPlugin = require( 'rtlcss-webpack-plugin' );
const MiniCSSExtractPlugin = require( 'mini-css-extract-plugin' );
const defaultConfig = require( '@wordpress/scripts/config/webpack.config' );

// Overrides the default config to have deterministic file names
// and also RTL stylesheets.
module.exports = {
	...defaultConfig,
	output: {
		filename: 'preferred-languages.js',
		path: resolve( process.cwd(), 'build' ),
	},
	plugins: [
		...defaultConfig.plugins.filter(
			( plugin ) => ! ( plugin instanceof MiniCSSExtractPlugin )
		),
		new MiniCSSExtractPlugin( { filename: 'preferred-languages.css' } ),
		new RtlCssPlugin( {
			filename: `../build/preferred-languages-rtl.css`,
		} ),
	],
};
