<?php
/**
 * Adds all plugin actions and filters.
 *
 * @package PreferredLanguages
 */

add_filter( 'gettext', 'preferred_languages_filter_gettext', 10, 3 );

add_action( 'init', 'preferred_languages_register_setting' );
add_action( 'init', 'preferred_languages_register_meta' );
add_action( 'init', 'preferred_languages_register_scripts' );

add_action( 'admin_init', 'preferred_languages_settings_field' );
add_action( 'wpmu_options', 'preferred_languages_network_settings_field' );
add_action( 'update_wpmu_options', 'preferred_languages_update_network_settings' );

add_action( 'personal_options', 'preferred_languages_personal_options' );
add_action( 'personal_options_update', 'preferred_languages_update_user_option' );
add_action( 'edit_user_profile_update', 'preferred_languages_update_user_option' );

add_filter( 'pre_update_option_preferred_languages', 'preferred_languages_pre_update_option', 10, 3 );
add_filter( 'pre_update_site_option_preferred_languages', 'preferred_languages_pre_update_option', 10, 3 );
add_action( 'add_option_preferred_languages', 'preferred_languages_update_option', 10, 2 );
add_action( 'update_option_preferred_languages', 'preferred_languages_update_option', 10, 2 );
add_action( 'add_site_option_preferred_languages', 'preferred_languages_update_site_option', 10, 2 );
add_action( 'update_site_option_preferred_languages', 'preferred_languages_update_site_option', 10, 2 );
add_action( 'add_user_meta', 'preferred_languages_add_user_meta', 10, 3 );
add_action( 'update_user_meta', 'preferred_languages_update_user_meta', 10, 4 );
add_filter( 'get_user_metadata', 'preferred_languages_filter_user_locale', 10, 3 );
add_filter( 'locale', 'preferred_languages_filter_locale', 5 ); // Before WP_Locale_Switcher.
add_filter( 'override_load_textdomain', 'preferred_languages_override_load_textdomain', 10, 3 );
add_filter( 'load_textdomain_mofile', 'preferred_languages_load_textdomain_mofile', 10 );
add_filter( 'pre_load_script_translations', 'preferred_languages_pre_load_script_translations', 10, 4 );
add_filter( 'load_script_translation_file', 'preferred_languages_load_script_translation_file' );

add_filter( 'debug_information', 'preferred_languages_filter_debug_information' );
