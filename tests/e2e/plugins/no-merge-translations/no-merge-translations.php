<?php
/*
Plugin Name: No Merge Translations
Plugin URI: https://wordpress.org/
Description: For testing purposes only.
Version: 1.0.0
Text Domain: no-merge-translations
Domain Path: languages/
*/

add_filter( 'preferred_languages_merge_translations', '__return_false' );
