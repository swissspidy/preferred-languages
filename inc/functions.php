<?php

/**
 * Registers the option for the preferred languages.
 *
 * @since 1.0.0
 */
function preferred_languages_register_setting() {
	register_setting(
		'general',
		'preferred_languages',
		array(
			'sanitize_callback' => 'preferred_languages_sanitize_list',
			'default'           => '',
			'show_in_rest'      => true,
			'type'              => 'string',
			'description'       => __( 'List of preferred locales.', 'preferred-languages' ),
		)
	);
}

/**
 * Registers the user meta key for the preferred languages.
 *
 * @since 1.0.0
 */
function preferred_languages_register_meta() {
	register_meta( 'user', 'preferred_languages', array(
		'type'              => 'string',
		'description'       => 'List of preferred languages',
		'single'            => true,
		'sanitize_callback' => 'preferred_languages_sanitize_list',
		'show_in_rest'      => true,
	) );
}

/**
 * Updates the user's set of preferred languages.
 *
 * @since 1.0.0
 *
 * @param int $user_id The user ID.
 */
function preferred_languages_update_user_option( $user_id ) {
	if ( isset( $_POST['preferred_languages'] ) ) {
		update_user_meta( $user_id, 'preferred_languages', $_POST['preferred_languages'] );
	}
}

/**
 * Returns the list of preferred languages.
 *
 * If in the admin area, this returns the data for the current user.
 * Else the site settings are used.
 *
 * @since 1.0.0
 *
 * @return array Preferred languages.
 */
function preferred_languages_get_list() {
	$preferred_languages = array();

	if ( is_admin() ) {
		$preferred_languages = get_user_meta( get_current_user_id(), 'preferred_languages', true );
		$preferred_languages = array_filter( explode( ',', $preferred_languages ) );
	}

	// Fall back to site setting.
	if ( empty( $preferred_languages ) ) {
		$preferred_languages = get_option( 'preferred_languages', '' );
		$preferred_languages = array_filter( explode( ',', $preferred_languages ) );
	}

	return $preferred_languages;
}

/**
 * Downloads language packs upon updating the option.
 *
 * @since 1.0.0
 *
 * @param string $old_value The old option value.
 * @param string $value     The new option value.
 */
function preferred_languages_download_language_packs( $old_value, $value ) {
	if ( is_multisite() && ! is_super_admin() ) {
		return;
	}

	// Handle translation install.
	require_once ABSPATH . 'wp-admin/includes/translation-install.php';

	if ( ! wp_can_install_language_pack() ) {
		return;
	}

	$locales = $value;
	$locales = explode( ',', $locales );

	$installed_languages = array();

	foreach ( $locales as $locale ) {
		$language = wp_download_language_pack( $locale );
		if ( $language ) {
			$installed_languages[] = $language;
		}
	}

	remove_filter( 'update_option_preferred_languages', 'preferred_languages_download_language_packs' );

	// Only store actually installed languages in option.
	update_option( 'preferred_languages', implode( ',', $installed_languages ) );

	add_filter( 'update_option_preferred_languages', 'preferred_languages_download_language_packs', 10, 2 );

	// Reload translations after save.
	$preferred_languages_list = preferred_languages_get_list();
	load_default_textdomain( reset( $preferred_languages_list ) );
}

/**
 * Sanitizes the preferred languages option.
 *
 * @since 1.0.0
 *
 * @param string $preferred_languages Comma separated list of preferred languages.
 *
 * @return string Sanitized list.
 */
function preferred_languages_sanitize_list( $preferred_languages ) {
	$locales = array_map( 'sanitize_text_field', explode( ',', $preferred_languages ) );

	return implode( ',', $locales );
}

/**
 * Filters calls to get_locale() to use the preferred languages setting.
 *
 * @since 1.0.0
 *
 * @param string $locale The current locale.
 *
 * @return string
 */
function preferred_languages_filter_locale( $locale ) {
	$preferred_languages = preferred_languages_get_list();

	if ( empty( $preferred_languages ) ) {
		return $locale;
	}

	return reset( $preferred_languages );
}

/**
 * Filters calls to get_user_locale() to use the preferred languages setting.
 *
 * @since 1.0.0
 *
 * @param null|array|string $value     The value get_metadata() should return - a single metadata value,
 *                                     or an array of values.
 * @param int               $object_id Object ID.
 * @param string            $meta_key  Meta key.
 *
 * @return null|array|string The meta value.
 */
function preferred_languages_filter_user_locale( $value, $object_id, $meta_key ) {
	if ( 'locale' !== $meta_key ) {
		return $value;
	}

	$preferred_languages = get_user_meta( $object_id, 'preferred_languages', true );
	$preferred_languages = array_filter( explode( ',', $preferred_languages ) );

	if ( ! empty( $preferred_languages ) ) {
		return reset( $preferred_languages );
	}

	return $value;
}

/**
 * Filters load_textdomain() calls to respect the list of preferred languages.
 *
 * @since 1.0.0
 *
 * @param string $mofile Path to the MO file.
 *
 * @return string The modified MO file path.
 */
function preferred_languages_load_textdomain_mofile( $mofile ) {
	if ( is_readable( $mofile ) ) {
		return $mofile;
	}

	$preferred_locales = preferred_languages_get_list();

	if ( empty( $preferred_locales ) ) {
		return $mofile;
	}

	$current_locale = get_locale();

	foreach ( $preferred_locales as $locale ) {
		$preferred_mofile = str_replace( $current_locale, $locale, $mofile );

		if ( is_readable( $preferred_mofile ) ) {
			return $preferred_mofile;
		}
	}

	return $mofile;
}

/**
 * Registers the needed scripts and styles.
 *
 * @since 1.0.0
 */
function preferred_languages_register_scripts() {
	$suffix = SCRIPT_DEBUG ? '' : '.min';

	wp_register_script(
		'preferred-languages',
		plugin_dir_url( dirname( __FILE__ ) ) . 'js/preferred-languages' . $suffix . '.js',
		array(
			'jquery',
			'jquery-ui-sortable',
			'wp-a11y',
		),
		'20171011',
		true
	);

	wp_localize_script(
		'preferred-languages',
		'preferredLanguages',
		array(
			'l10n' => array(
				'localeAdded'   => __( 'Locale added to list', 'preferred-languages' ),
				'localeRemoved' => __( 'Locale removed from list', 'preferred-languages' ),
				'movedUp'       => __( 'Locale moved up', 'preferred-languages' ),
				'movedDown'     => __( 'Locale moved down', 'preferred-languages' ),
			),
		)
	);

	$rtl_suffix = is_rtl() ? '-rtl' : '';

	wp_enqueue_style(
		'preferred-languages',
		plugin_dir_url( dirname( __FILE__ ) ) . 'css/preferred-languages' . $rtl_suffix . '.css',
		array(),
		'20171010',
		'screen'
	);
}

/**
 * Adds a settings field for the preferred languages option.
 *
 * @since 1.0.0
 */
function preferred_languages_settings_field() {
	add_settings_field(
		'preferred_languages',
		'<span id="preferred-languages-label">' . __( 'Site Language', 'preferred-languages' ) . '<span/>',
		'preferred_languages_display_form',
		'general',
		'default',
		array(
			'selected' => array_filter( explode( ',', get_option( 'preferred_languages', '' ) ) ),
		)
	);
}

/**
 * Adds a settings field for the preferred languages option to the user profile.
 *
 * @since 1.0.0
 *
 * @param WP_User $user The current WP_User object.
 */
function preferred_languages_personal_options( $user ) {
	$languages = get_available_languages();

	if ( ! $languages ) {
		return;
	}
	?>
	<tr class="user-preferred-languages-wrap">
		<th scope="row">
			<span id="preferred-languages-label"><?php _e( 'Language', 'preferred-languages' ); ?></span>
		</th>
		<td>
			<?php
			preferred_languages_display_form( array(
				'selected'                    => array_filter( explode( ',', get_user_option( 'preferred_languages', $user->ID ) ) ),
				'show_available_translations' => false,
				'show_option_site_default'    => true,
			) );
			?>
		</td>
	</tr>
	<?php
}

/**
 * Displays the actual form to select the preferred languages.
 *
 * @since 1.0.0
 *
 * @param array $args Optional. Arguments to pass to the form.
 */
function preferred_languages_display_form( $args = array() ) {
	wp_enqueue_script( 'preferred-languages' );

	$args = wp_parse_args( $args, array(
		'selected'                    => array(),
		'show_available_translations' => true,
		'show_option_site_default'    => false,
	) );

	require_once ABSPATH . 'wp-admin/includes/translation-install.php';
	$translations = wp_get_available_translations();

	$languages = get_available_languages();

	$preferred_languages = array();

	foreach ( $args['selected'] as $locale ) {
		if ( isset( $translations[ $locale ] ) ) {
			$translation = $translations[ $locale ];

			$preferred_languages[] = array(
				'language'    => $translation['language'],
				'native_name' => $translation['native_name'],
				'lang'        => current( $translation['iso'] ),
			);
		} elseif ( 'en_US' !== $locale ) {
			$preferred_languages[] = array(
				'language'    => $locale,
				'native_name' => $locale,
				'lang'        => '',
			);
		}
	}
	?>
	<div class="preferred-languages">
		<input type="hidden" name="preferred_languages" value="<?php echo esc_attr( implode( ',', $args['selected'] ) ); ?>"/>
		<p><?php _e( 'Choose languages for displaying WordPress in, in order of preference.', 'preferred-languages' ); ?></p>
		<div class="active-locales">
			<?php
			if ( true === $args['show_option_site_default'] ) {
				$screen_reader_text = __( 'No languages selected. Falling back to Site Default.', 'preferred-languages' );
			} else {
				/* translators: %s: English (United States) */
				$screen_reader_text = sprintf( __( 'No languages selected. Falling back to %s.', 'preferred-languages' ), 'English (United States)' );
			}
			?>
			<div class="<?php echo ! empty( $preferred_languages ) ? 'hidden' : ''; ?>" id="active-locales-empty-message" data-a11y-message="<?php echo esc_attr( $screen_reader_text ); ?>">
				<?php _e( 'Nothing set.', 'preferred-languages' ); ?>
				<br>
				<?php
				if ( true === $args['show_option_site_default'] ) {
					_e( 'Falling back to Site Default.', 'preferred-languages' );
				} else {
					/* translators: %s: English (United States) */
					printf( __( 'Falling back to %s.', 'preferred-languages' ), 'English (United States)' );
				}
				?>
			</div>
			<ul
				role="listbox"
				aria-labelledby="preferred-languages-label"
				tabindex="0"
				aria-activedescendant="<?php echo empty( $preferred_languages ) ? '' : esc_attr( get_locale() ); ?>"
				id="preferred_languages"
				class="active-locales-list <?php echo empty( $preferred_languages ) ? 'empty-list' : ''; ?>">
				<?php foreach ( $preferred_languages as $language ) : ?>
					<li
						role="option"
						aria-selected="<?php echo (string) ( get_locale() === $language['language'] ); ?>"
						id="<?php echo esc_attr( $language['language'] ); ?>"
						class="active-locale">
						<?php echo esc_html( $language['native_name'] ); ?>
					</li>
				<?php endforeach; ?>
			</ul>
			<div class="active-locales-controls">
				<ul>
					<li>
						<button
							aria-keyshortcuts="Alt+ArrowUp"
							aria-disabled="false"
							type="button"
							class="button locales-move-up">
							<?php _e( 'Move Up', 'preferred-languages' ); ?>
						</button>
					</li>
					<li>
						<button
							aria-keyshortcuts="Alt+ArrowDown"
							aria-disabled="false"
							type="button"
							class="button locales-move-down">
							<?php _e( 'Move Down', 'preferred-languages' ); ?>
						</button>
					</li>
					<li>
						<button
							aria-keyshortcuts="Alt+Delete"
							aria-disabled="false"
							type="button"
							class="button locales-remove">
							<?php _e( 'Remove', 'preferred-languages' ); ?>
						</button>
					</li>
				</ul>
			</div>
		</div>
	</div>
	<div class="inactive-locales">
		<label class="screen-reader-text" for="preferred-languages-inactive-locales"><?php _e( 'Inactive Locales', 'preferred-languages' ); ?></label>
		<div class="inactive-locales-list">
			<?php
			wp_dropdown_languages( array(
				'id'                          => 'preferred-languages-inactive-locales',
				'name'                        => 'preferred-languages-inactive-locales',
				'languages'                   => $languages,
				'translations'                => $translations,
				'show_available_translations' => $args['show_available_translations'],
			) );
			?>
		</div>
		<div class="inactive-locales-controls">
			<button type="button" class="button locales-add" data-action="add"><?php _e( 'Add', 'preferred-languages' ); ?></button>
		</div>
	</div>
	<?php
}

/**
 * Initializes the class used for registering textdomains.
 *
 * @since 1.1.0
 */
function preferred_languages_init_registry() {
	global $textdomain_registry;

	$textdomain_registry = new Preferred_Languages_Textdomain_Registry();
}

/**
 * Filters gettext call to work around limitations in just-in-time loading of translations.
 *
 * @since 1.1.0
 *
 * @param string $translation  Translated text.
 * @param string $text         Text to translate.
 * @param string $domain       Text domain. Unique identifier for retrieving translated strings.
 *
 * @return string Translated text.
 */
function preferred_languages_filter_gettext( $translation, $text, $domain ) {
	if ( 'default' === $domain ) {
		return $translation;
	}

	$translations = get_translations_for_domain( $domain );

	if ( $translations instanceof NOOP_Translations ) {
		/* @var Preferred_Languages_Textdomain_Registry $textdomain_registry */
		global $textdomain_registry;

		if ( ! $textdomain_registry instanceof  Preferred_Languages_Textdomain_Registry ) {
			preferred_languages_init_registry();
		}

		$path = $textdomain_registry->get( $domain );

		if ( ! $path ) {
			$textdomain_registry->get_translation_from_lang_dir( $domain );
		}

		$path = $textdomain_registry->get( $domain );

		if ( ! $path ) {
			return $translation;
		}

		$preferred_locales = preferred_languages_get_list();

		foreach ( $preferred_locales as $locale ) {
			$mofile = "{$path}/{$domain}-{$locale}.mo";

			if ( load_textdomain( $domain, $mofile ) ) {
				$translations = get_translations_for_domain( $domain );
				$translation  = $translations->translate( $text );

				break;
			}
		}
	}

	return $translation;
}
