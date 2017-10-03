<?php

add_action( 'plugins_loaded', 'preferred_languages_init_registry' );

add_filter( 'gettext', 'preferred_languages_filter_gettext', 10, 3 );

add_action( 'init', 'preferred_languages_register_setting' );
add_action( 'init', 'preferred_languages_register_meta'    );
add_action( 'init', 'preferred_languages_register_scripts' );

add_action( 'admin_init', 'preferred_languages_settings_field' );

add_action( 'personal_options',         'preferred_languages_personal_options'   );
add_action( 'personal_options_update',  'preferred_languages_update_user_option' );
add_action( 'edit_user_profile_update', 'preferred_languages_update_user_option' );

add_filter( 'update_option_preferred_languages', 'preferred_languages_download_language_packs', 10, 2 );
add_filter( 'get_user_metadata',                 'preferred_languages_filter_user_locale',      10, 3 );
add_filter( 'locale',                            'preferred_languages_filter_locale'                  );
add_filter( 'load_textdomain_mofile',            'preferred_languages_load_textdomain_mofile',  10    );




