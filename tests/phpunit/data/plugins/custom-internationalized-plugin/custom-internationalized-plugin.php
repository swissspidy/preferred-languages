<?php
/*
Plugin Name: Custom Dummy Plugin
Plugin URI: https://wordpress.org/
Description: For testing purposes only.
Version: 1.0.0
Text Domain: custom-internationalized-plugin
*/

load_plugin_textdomain( 'custom-internationalized-plugin', false, dirname( plugin_basename( __FILE__ ) ) . '/languages' );

function custom_i18n_plugin_test() {
	return __( 'This is a dummy plugin', 'custom-internationalized-plugin' );
}

function custom_i18n_plugin_test_context() {
	return _x( 'This is a dummy plugin with context', 'some context',  'custom-internationalized-plugin' );
}

/**
 * @param int $num
 * @return string
 */
function custom_i18n_plugin_test_plural( $num = 1 ) {
	/* translators: %s: some number */
	return _n( '%s dummy plugin', '%s dummy plugins', $num,  'custom-internationalized-plugin' );
}

/**
 * @param int $num
 * @return string
 */
function custom_i18n_plugin_test_plural_context( $num = 1 ) {
	/* translators: %s: some number */
	return _nx( '%s dummy plugin with context', '%s dummy plugins with context', $num, 'some context', 'custom-internationalized-plugin' );
}
