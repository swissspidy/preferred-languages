<?php
/**
 * Plugin Name: Preferred Languages
 * Plugin URI:  https://github.com/swissspidy/preferred-languages/
 * Description: Choose languages for displaying WordPress in, in order of preference.
 * Version:     1.0.0
 * Author:      Pascal Birchler
 * Author URI:  https://pascalbirchler.com
 * License:     GPL-2.0+
 * License URI: http://www.gnu.org/licenses/gpl-2.0.txt
 * Text Domain: preferred-languages
 * Domain Path: /languages
 *
 * Copyright (c) 2017 Pascal Birchler (email: swissspidy@chat.wordpress.org)
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License, version 2 or, at
 * your discretion, any later version, as published by the Free
 * Software Foundation.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA  02110-1301  USA
 */

function preferred_languages_load_textdomain() {
	load_plugin_textdomain( 'preferred-languages', false, basename( __FILE__ ) . '/languages' );
}

add_action( 'init', 'preferred_languages_load_textdomain' );

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

add_action( 'init', 'preferred_languages_register_setting' );

/**
 * Downloads language packs upon updating the option.
 *
 * @since 1.0.0
 *
 * @param mixed  $old_value The old option value.
 * @param mixed  $value     The new option value.
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

	// Todo: Switch translation in case WPLANG was changed.
}

add_filter( 'update_option_preferred_languages', 'preferred_languages_download_language_packs', 10, 2 );

/**
 * Sanitizes the preferred languages option.
 *
 * @since 1.0.0
 *
 * @param string $preferred_languages Comma separated list of preferred languages.
 * @return string Sanitized list.
 */
function preferred_languages_sanitize_list( $preferred_languages ) {
	$locales = array_map( 'sanitize_text_field', explode( ',', $preferred_languages ) );

	return implode( ',', $locales );
}

/**
 *
 * @param string $mofile Path to the MO file.
 * @param string $domain Text domain. Unique identifier for retrieving translated strings.
 *
 * @return string
 */
function preferred_languages_load_textdomain_mofile( $mofile, $domain ) {
	$preferred_locales = explode( ',', get_option( 'preferred_languages', '' ) );

	if ( empty( $preferred_locales ) ) {
		return $mofile;
	}

	if ( is_readable( $mofile ) ) {
		return $mofile;
	}

	$current_locale = get_locale();

	foreach( $preferred_locales as $locale ) {
		$preferred_mofile = str_replace( $current_locale, $locale, $mofile );

		if ( is_readable( $preferred_mofile ) ) {
			return $preferred_mofile;
		}
	}

	return $mofile;
}

add_filter( 'load_textdomain_mofile', 'preferred_languages_load_textdomain_mofile', 10, 3 );

/**
 * Registers the needed scripts and styles.
 *
 * @since 1.0.0
 */
function preferred_languages_register_scripts() {
	$suffix = SCRIPT_DEBUG ? '' : '.min';

	wp_register_script( 'preferred-languages', plugin_dir_url( __FILE__ ) . 'js/preferred-languages' . $suffix . '.js', array( 'jquery' ), '20170513', true );
	wp_enqueue_style( 'preferred-languages', plugin_dir_url( __FILE__ ) . 'css/preferred-languages.css', array(), '20170513', 'screen' );
}

add_action( 'init', 'preferred_languages_register_scripts' );

/**
 * Adds a settings field for the preferred languages option.
 *
 * @since 1.0.0
 */
function preferred_languages_settings_field() {
	add_settings_field(
		'preferred_languages',
		__( 'Site Language', 'preferred-languages' ),
		'preferred_languages_display_form',
		'general',
		'default',
		array(
			'label_for' => 'preferred_languages',
		)
	);
}

add_action( 'admin_init', 'preferred_languages_settings_field' );

/**
 * Displays the actual form to select the preferred languages.
 *
 * @param array $args Settings field args.
 */
function preferred_languages_display_form( $args ) {
	wp_enqueue_script( 'preferred-languages' );

	$preferred_locales = explode( ',', get_option( 'preferred_languages', '' ) );

	if ( empty( $preferred_locales ) ) {
		$preferred_locales = array( get_locale() );
	}

	require_once ABSPATH . 'wp-admin/includes/translation-install.php';
	$translations = wp_get_available_translations();

	$languages = get_available_languages();

	$preferred_languages = array();

	foreach ( $preferred_locales as $locale ) {
		if ( isset( $translations[ $locale ] ) ) {
			$translation = $translations[ $locale ];

			$preferred_languages[] = array(
				'language'    => $translation['language'],
				'native_name' => $translation['native_name'],
				'lang'        => current( $translation['iso'] ),
			);
		} else if ( 'en_US' === $locale ) {
			$preferred_languages[] = array(
				'language'    => $locale,
				'native_name' => 'English (United States)',
				'lang'        => 'en',
			);
		} else {
			$preferred_languages[] = array(
				'language'    => $locale,
				'native_name' => $locale,
				'lang'        => '',
			);
		}
	}
	?>
	<div class="preferred-languages">
		<p><?php _e( 'Choose languages for displaying WordPress in, in order of preference.', 'preferred-languages' ); ?></p>
		<div class="active-locales">
			<ul
					role="listbox"
					aria-label="<?php _e( 'Order locales in order of preference', 'preferred-languages' ); ?>"
					tabindex="0"
					aria-activedescendant="<?php echo esc_attr( get_locale() ); ?>"
					id="<?php echo esc_attr( $args['label_for'] ); ?>"
					class="active-locales-list">
				<?php foreach ( $preferred_languages as $language ) : ?>
					<li
							role="option"
							aria-selected="<?php echo get_locale() === $language['language'] ? 'true' : 'false'; ?>"
							id="<?php echo esc_attr( $language['language'] ); ?>">
						<?php echo esc_html( $language['native_name'] ); ?>
					</li>
				<?php endforeach; ?>
			</ul>
			<input type="hidden" name="preferred_languages" value="<?php echo esc_attr( implode( ',', (array) $preferred_locales ) ); ?>"/>
			<div class="active-locales-controls">
				<ul>
					<li>
						<button
								aria-keyshortcuts="Alt+ArrowUp"
								aria-disabled="false"
								type="button"
								class="button-secondary locales-move-up">
							<?php _e( 'Move Up', 'preferred-languages' ); ?>
						</button>
					</li>
					<li>
						<button
								aria-keyshortcuts="Alt+ArrowDown"
								aria-disabled="false"
								type="button"
								class="button-secondary locales-move-down">
							<?php _e( 'Move Down', 'preferred-languages' ); ?>
						</button>
					</li>
					<li>
						<button
								aria-keyshortcuts="Alt+Delete"
								aria-disabled="false"
								type="button"
								class="button-secondary locales-remove">
							<?php _e( 'Remove', 'preferred-languages' ); ?>
						</button>
					</li>
				</ul>
			</div>
		</div>
	</div>
	<div class="inactive-locales">
		<div class="inactive-locales-list">
			<?php
			// Todo: Only remove languages and translations on JS side as they might need to be added again.

			foreach ( $languages as $key => $locale ) {
				if ( in_array( $locale, $preferred_locales, true ) ) {
					unset( $languages[ $key ] );
				}
			}

			foreach ( $translations as $key => $translation ) {
				if ( in_array( $translation['language'], $preferred_locales, true ) ) {
					unset( $translations[ $key ] );
				}
			}

			$dropdown = wp_dropdown_languages( array(
				'languages'    => $languages,
				'translations' => $translations,
				'echo' => false,
			) );

			if ( in_array( 'en_US', $preferred_locales, true ) ) {
				// Hack to remove hardcoded en_US option.
				echo str_replace( '<option value="" lang="en" data-installed="1" selected=\'selected\'>English (United States)</option>', '', $dropdown );
			} else {
				echo $dropdown;
			}
			?>
		</div>
		<div class="inactive-locales-controls">
			<button type="button" class="button-secondary locales-add" data-action="add"><?php _e( 'Add', 'preferred-languages' ); ?></button>
		</div>
	</div>
	<?php
}
