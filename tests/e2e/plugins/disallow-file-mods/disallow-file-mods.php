<?php
/*
Plugin Name: Disallow file mods
Plugin URI: https://wordpress.org/
Description: For testing purposes only.
Version: 1.0.0
Text Domain: disallow-file-mods
Domain Path: languages/
*/

add_filter( 'file_mod_allowed', '__return_false' );
