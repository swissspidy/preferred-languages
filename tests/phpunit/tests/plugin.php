<?php

class Plugin_Test extends WP_UnitTestCase {
	public function test_register_setting() {
		preferred_languages_register_setting();
		$this->assertArrayHasKey( 'preferred_languages', get_registered_settings() );
		$this->assertSame(
			10,
			has_filter( 'sanitize_option_preferred_languages', 'preferred_languages_sanitize_list' )
		);
	}

	public function test_register_meta() {
		preferred_languages_register_meta();
		$this->assertTrue( registered_meta_key_exists( 'user', 'preferred_languages' ) );
		$this->assertSame(
			10,
			has_filter( 'sanitize_user_meta_preferred_languages', 'preferred_languages_sanitize_list' )
		);
	}

	public function test_update_user_option() {
		$user_id = self::factory()->user->create( [
			'role' => 'administrator',
		]);

		$_POST['preferred_languages'] = 'de_DE,fr_FR';
		preferred_languages_update_user_option( $user_id );
		$actual = get_user_meta( $user_id, 'preferred_languages', true );
		$this->assertSame( 'de_DE,fr_FR', $actual );
	}

	public function test_get_user_list() {
		$user_id = self::factory()->user->create( [
			'role' => 'administrator',
		]);

		wp_set_current_user( $user_id );
		update_user_meta( $user_id, 'preferred_languages', 'de_DE,fr_FR' );

		$expected = [
			'de_DE',
			'fr_FR',
		];

		$this->assertSame( $expected, preferred_languages_get_user_list() );
	}

	public function test_get_user_list_falls_back_to_locale_user_meta() {
		$user_id = self::factory()->user->create( [
			'role' => 'administrator',
		]);

		wp_set_current_user( $user_id );
		update_user_meta( $user_id, 'locale', 'de_DE' );

		$expected = [
			'de_DE',
		];

		$this->assertSame( $expected, preferred_languages_get_user_list() );
	}

	public function test_get_site_list() {
		update_option( 'preferred_languages', 'de_DE,fr_FR' );

		$expected = [
			'de_DE',
			'fr_FR',
		];

		$this->assertSame( $expected, preferred_languages_get_site_list() );
	}

	public function test_get_list() {
		$user_id = self::factory()->user->create( [
			'role' => 'administrator',
		]);

		wp_set_current_user( $user_id );
		update_user_meta( $user_id, 'preferred_languages', 'de_DE,fr_FR' );
		update_option( 'preferred_languages', 'es_ES' );

		$expected = [ 'es_ES' ];

		$this->assertSame( $expected, preferred_languages_get_list() );
	}

	public function test_get_list_admin() {
		set_current_screen( 'index.php' );

		$user_id = self::factory()->user->create( [
			'role' => 'administrator',
		]);

		wp_set_current_user( $user_id );
		update_user_meta( $user_id, 'preferred_languages', 'de_DE,fr_FR' );
		update_option( 'preferred_languages', 'es_ES' );

		$expected = [
			'de_DE',
			'fr_FR',
		];

		$this->assertSame( $expected, preferred_languages_get_list() );
	}

	public function test_get_list_admin_fallback() {
		set_current_screen( 'index.php' );

		$user_id = self::factory()->user->create( [
			'role' => 'administrator',
		]);

		wp_set_current_user( $user_id );
		update_user_meta( $user_id, 'preferred_languages', '' );
		update_option( 'preferred_languages', 'es_ES' );

		$expected = [ 'es_ES' ];

		$this->assertSame( $expected, preferred_languages_get_list() );
	}

	public function test_filter_locale_returns_locale_unchanged() {
		$this->assertSame( 'de_CH', preferred_languages_filter_locale( 'de_CH' ) );
	}

	public function test_filter_locale_returns_first_locale() {
		update_option( 'preferred_languages', 'de_CH,fr_FR' );
		$this->assertSame( 'de_CH', preferred_languages_filter_locale( 'de_DE' ) );
	}

	public function test_init_registry() {
		preferred_languages_init_registry();
		$this->assertInstanceOf( Preferred_Languages_Textdomain_Registry::class, $GLOBALS['preferred_languages_textdomain_registry'] );
	}

	public function test_register_scripts()	{
		preferred_languages_register_scripts();
		$this->assertTrue( wp_script_is ( 'preferred-languages', 'registered' ) );
		$this->assertTrue( wp_style_is ( 'preferred-languages', 'registered' ) );
	}

	public function test_personal_options() {
		$user_id = self::factory()->user->create( [
			'role' => 'administrator',
		]);
		wp_set_current_user( $user_id );

		$output = get_echo( 'preferred_languages_personal_options', [ wp_get_current_user() ] );

		$this->assertNotEmpty( $output );
	}

	/**
	 * @group ms-excluded
	 */
	public function test_personal_options_no_languages() {
		$user_id = self::factory()->user->create( [
			'role' => 'administrator',
		]);
		wp_set_current_user( $user_id );

		add_filter( 'get_available_languages', '__return_empty_array' );

		$output = get_echo( 'preferred_languages_personal_options', [ wp_get_current_user() ] );

		remove_filter( 'get_available_languages', '__return_empty_array' );

		wp_set_current_user(0 );

		$this->assertNotEmpty( $output );
	}

	public function test_personal_options_no_capability() {
		$output = get_echo( 'preferred_languages_personal_options', [ wp_get_current_user() ] );

		$this->assertNotEmpty( $output );
	}

	public function test_personal_options_no_languages_and_no_capability() {
		add_filter( 'get_available_languages', '__return_empty_array' );

		$output = get_echo( 'preferred_languages_personal_options', [ wp_get_current_user() ] );

		remove_filter( 'get_available_languages', '__return_empty_array' );

		$this->assertEmpty( $output );
	}
}
