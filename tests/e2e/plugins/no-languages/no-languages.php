<?php
/*
Plugin Name: No Languages
Plugin URI: https://wordpress.org/
Description: For testing purposes only. Removes all available languages and translations.
Version: 1.0.0
Text Domain: no-languages
Domain Path: languages/
*/

add_filter( 'file_mod_allowed', '__return_false' );
add_filter( 'get_available_languages', '__return_empty_array' );
add_filter( 'wp_get_available_translations', '__return_empty_array' );
