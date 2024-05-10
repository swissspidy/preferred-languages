<?php
/*
Plugin Name: Custom Internationalized Plugin
Plugin URI: https://wordpress.org/
Description: For testing purposes only.
Version: 1.0.0
Text Domain: custom-internationalized-plugin
Domain Path: languages/
*/

function custom_i18n_plugin_test() {
	return __( 'This is a dummy plugin', 'custom-internationalized-plugin' );
}

function custom_i18n_plugin_test2() {
	return __( 'This is another dummy plugin', 'custom-internationalized-plugin' );
}

add_action(
	'init',
	static function() {
		load_plugin_textdomain( 'custom-internationalized-plugin', false, dirname( plugin_basename( __FILE__ ) ) . '/languages' );
	}
);

add_action(
	'admin_enqueue_scripts',
	static function( $hook_suffix ) {
		if ( 'index.php' !== $hook_suffix ) {
			return;
		}

					wp_enqueue_script(
						'custom-i18n-script',
						plugins_url( 'custom-internationalized-plugin.js', __FILE__ ),
						array( 'wp-i18n' ),
						'1.0.0',
						true
					);

					wp_set_script_translations(
						'custom-i18n-script',
						'custom-internationalized-plugin',
						__DIR__ . '/languages'
					);
	}
);

add_action(
	'admin_notices',
	static function () {
		if ( ! get_current_screen() || 'dashboard' !== get_current_screen()->base ) {
			return;
		}

		?>
		<div class="notice notice-success" data-testid="notice-custom-i18n-plugin-locale-current">
			<ul>
				<li>Current Locale: <?php echo determine_locale(); ?></li>
				<?php if ( function_exists( 'preferred_languages_get_list' ) ) : ?>
					<li>Preferred Languages: <?php echo implode( ',', preferred_languages_get_list() ); ?></li>
				<?php endif; ?>
				<li>Output:
					<ul>
						<li><?php echo custom_i18n_plugin_test(); ?></li>
						<li><?php echo custom_i18n_plugin_test2(); ?></li>
					</ul>
				</li>
			</ul>
		</div>
		<div class="notice notice-success" data-testid="notice-custom-i18n-plugin-locale-switching">
			<ul>
				<li>Current Locale: <?php echo determine_locale(); ?></li>
				<?php if ( function_exists( 'preferred_languages_get_list' ) ) : ?>
					<li>Preferred Languages: <?php echo implode( ',', preferred_languages_get_list() ); ?></li>
				<?php endif; ?>
				<li>Output:
					<ul>
						<li><?php echo custom_i18n_plugin_test(); ?></li>
						<li><?php echo custom_i18n_plugin_test2(); ?></li>
					</ul>
				</li>

				<?php $is_switched = switch_to_locale( 'it_IT' ); ?>
				<li>Switched to it_IT: <?php echo $is_switched ? 'True' : 'False'; ?></li>
				<li>Current Locale: <?php echo determine_locale(); ?></li>
				<li>Output:
					<ul>
						<li><?php echo custom_i18n_plugin_test(); ?></li>
						<li><?php echo custom_i18n_plugin_test2(); ?></li>
					</ul>
				</li>
				<?php
				if ( $is_switched ) {
					restore_previous_locale();
				}
				?>

				<?php $is_switched = switch_to_locale( 'de_DE' ); ?>
				<li>Switched to de_DE: <?php echo $is_switched ? 'True' : 'False'; ?></li>
				<li>Current Locale: <?php echo determine_locale(); ?></li>
				<li>Output:
					<ul>
						<li><?php echo custom_i18n_plugin_test(); ?></li>
						<li><?php echo custom_i18n_plugin_test2(); ?></li>
					</ul>
				</li>
				<?php
				if ( $is_switched ) {
					restore_previous_locale();
				}
				?>

				<?php $is_switched = switch_to_locale( 'en_US' ); ?>
				<li>Switched to en_US: <?php echo $is_switched ? 'True' : 'False'; ?></li>
				<li>Current Locale: <?php echo determine_locale(); ?></li>
				<li>Output:
					<ul>
						<li><?php echo custom_i18n_plugin_test(); ?></li>
						<li><?php echo custom_i18n_plugin_test2(); ?></li>
					</ul>
				</li>
				<?php
				if ( $is_switched ) {
					restore_previous_locale();
				}
				?>

				<?php $is_switched = switch_to_locale( 'de_CH' ); ?>
				<li>Switched to de_CH: <?php echo $is_switched ? 'True' : 'False'; ?></li>
				<li>Current Locale: <?php echo determine_locale(); ?></li>
				<li>Output:
					<ul>
						<li><?php echo custom_i18n_plugin_test(); ?></li>
						<li><?php echo custom_i18n_plugin_test2(); ?></li>
					</ul>
				</li>
				<?php
				if ( $is_switched ) {
					restore_previous_locale();
				}
				?>

				<?php $is_switched = switch_to_locale( 'es_ES' ); ?>
				<li>Switched to es_ES: <?php echo $is_switched ? 'True' : 'False'; ?></li>
				<li>Current Locale: <?php echo determine_locale(); ?></li>
				<li>Output:
					<ul>
						<li><?php echo custom_i18n_plugin_test(); ?></li>
						<li><?php echo custom_i18n_plugin_test2(); ?></li>
					</ul>
				</li>
				<?php
				if ( $is_switched ) {
					restore_previous_locale();
				}
				?>
			</ul>
		</div>
		<?php
	}
);
