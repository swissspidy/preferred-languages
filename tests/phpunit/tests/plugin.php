<?php

class Plugin_Test extends WP_UnitTestCase {
	public function test_setting_is_registered() {
		$this->assertArrayHasKey( 'preferred_languages', get_registered_settings() );
	}

	public function test_setting_has_sanitize_callback() {
		$this->assertSame(
			10,
			has_filter( 'sanitize_option_preferred_languages', 'preferred_languages_sanitize_list' )
		);
	}

	public function test_meta_is_registered() {
		preferred_languages_register_meta();
		$this->assertTrue( registered_meta_key_exists( 'user', 'preferred_languages' ) );
	}

	public function test_meta_has_sanitize_callback() {
		$this->assertSame(
			10,
			has_filter( 'sanitize_user_meta_preferred_languages', 'preferred_languages_sanitize_list' )
		);
	}

	public function test_preferred_languages_filter_locale_returns_locale_unchanged() {
		$this->assertSame( 'de_CH', preferred_languages_filter_locale( 'de_CH' ) );
	}

	public function test_preferred_languages_filter_locale_returns_first_locale() {
		update_option( 'preferred_languages', 'de_CH,fr_FR' );
		$this->assertSame( 'de_CH', preferred_languages_filter_locale( 'de_DE' ) );
	}
}
