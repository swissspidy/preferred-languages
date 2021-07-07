<?php

class Plugin_Test extends WP_UnitTestCase {
	/**
	 * @covers ::preferred_languages_register_setting
	 */
	public function test_register_setting() {
		preferred_languages_register_setting();
		$this->assertArrayHasKey( 'preferred_languages', get_registered_settings() );
		$this->assertSame(
			10,
			has_filter( 'sanitize_option_preferred_languages', 'preferred_languages_sanitize_list' )
		);
	}

	/**
	 * @covers ::preferred_languages_register_meta
	 */
	public function test_register_meta() {
		preferred_languages_register_meta();
		$this->assertTrue( registered_meta_key_exists( 'user', 'preferred_languages' ) );
		$this->assertSame(
			10,
			has_filter( 'sanitize_user_meta_preferred_languages', 'preferred_languages_sanitize_list' )
		);
	}

	/**
	 * @covers ::preferred_languages_update_user_option
	 */
	public function test_update_user_option() {
		$user_id = self::factory()->user->create(
			array(
				'role' => 'administrator',
			)
		);

		$_POST['preferred_languages'] = 'de_DE,fr_FR';
		preferred_languages_update_user_option( $user_id );
		$actual = get_user_meta( $user_id, 'preferred_languages', true );
		$this->assertSame( 'de_DE,fr_FR', $actual );
	}

	/**
	 * @covers ::preferred_languages_get_user_list
	 */
	public function test_get_user_list() {
		$user_id = self::factory()->user->create(
			array(
				'role' => 'administrator',
			)
		);

		wp_set_current_user( $user_id );
		update_user_meta( $user_id, 'preferred_languages', 'de_DE,fr_FR' );

		$expected = array(
			'de_DE',
			'fr_FR',
		);

		$this->assertSame( $expected, preferred_languages_get_user_list() );
	}


	/**
	 * @covers ::preferred_languages_get_user_list
	 */
	public function test_get_user_list_user_instance() {
		$user = self::factory()->user->create_and_get(
			array(
				'role' => 'administrator',
			)
		);

		update_user_meta( $user->ID, 'preferred_languages', 'de_DE,fr_FR' );

		$expected = array(
			'de_DE',
			'fr_FR',
		);

		$this->assertSame( $expected, preferred_languages_get_user_list( $user ) );
	}


	/**
	 * @covers ::preferred_languages_get_user_list
	 */
	public function test_get_user_list_no_current_user() {
		$this->assertFalse( preferred_languages_get_user_list() );
	}

	/**
	 * @covers ::preferred_languages_get_user_list
	 */
	public function test_get_user_list_falls_back_to_locale_user_meta() {
		$user_id = self::factory()->user->create(
			array(
				'role' => 'administrator',
			)
		);

		wp_set_current_user( $user_id );
		update_user_meta( $user_id, 'locale', 'de_DE' );

		$expected = array(
			'de_DE',
		);

		$this->assertSame( $expected, preferred_languages_get_user_list() );
	}

	/**
	 * @covers ::preferred_languages_get_site_list
	 */
	public function test_get_site_list() {
		update_option( 'preferred_languages', 'de_DE,fr_FR' );

		$expected = array(
			'de_DE',
			'fr_FR',
		);

		$this->assertSame( $expected, preferred_languages_get_site_list() );
	}

	/**
	 * @covers ::preferred_languages_get_network_list
	 */
	public function test_get_network_list() {
		update_site_option( 'preferred_languages', 'de_DE,fr_FR' );

		$expected = array(
			'de_DE',
			'fr_FR',
		);

		$this->assertSame( $expected, preferred_languages_get_network_list() );
	}

	/**
	 * @covers ::preferred_languages_get_list
	 */
	public function test_get_list() {
		$user_id = self::factory()->user->create(
			array(
				'role' => 'administrator',
			)
		);

		wp_set_current_user( $user_id );
		update_user_meta( $user_id, 'preferred_languages', 'de_DE,fr_FR' );
		update_option( 'preferred_languages', 'es_ES' );

		$expected = array( 'es_ES' );

		$this->assertSame( $expected, preferred_languages_get_list() );
	}

	/**
	 * @covers ::preferred_languages_get_list
	 */
	public function test_get_list_network() {
		$user_id = self::factory()->user->create(
			array(
				'role' => 'administrator',
			)
		);

		wp_set_current_user( $user_id );
		update_user_meta( $user_id, 'preferred_languages', 'de_DE,fr_FR' );
		update_site_option( 'preferred_languages', 'es_ES' );

		$expected = array( 'es_ES' );

		$this->assertSame( $expected, preferred_languages_get_list() );
	}

	/**
	 * @covers ::preferred_languages_get_list
	 */
	public function test_get_list_admin() {
		set_current_screen( 'index.php' );

		$user_id = self::factory()->user->create(
			array(
				'role' => 'administrator',
			)
		);

		wp_set_current_user( $user_id );
		update_user_meta( $user_id, 'preferred_languages', 'de_DE,fr_FR' );
		update_option( 'preferred_languages', 'es_ES' );

		$expected = array(
			'de_DE',
			'fr_FR',
		);

		$this->assertSame( $expected, preferred_languages_get_list() );
	}

	/**
	 * @covers ::preferred_languages_get_list
	 */
	public function test_get_list_admin_fallback() {
		set_current_screen( 'index.php' );

		$user_id = self::factory()->user->create(
			array(
				'role' => 'administrator',
			)
		);

		wp_set_current_user( $user_id );
		update_user_meta( $user_id, 'preferred_languages', '' );
		update_option( 'preferred_languages', 'es_ES' );

		$expected = array( 'es_ES' );

		$this->assertSame( $expected, preferred_languages_get_list() );
	}

	/**
	 * @covers ::preferred_languages_filter_locale
	 */
	public function test_filter_locale_returns_locale_unchanged() {
		$this->assertSame( 'de_CH', preferred_languages_filter_locale( 'de_CH' ) );
	}

	/**
	 * @covers ::preferred_languages_filter_locale
	 */
	public function test_filter_locale_returns_first_locale() {
		update_option( 'preferred_languages', 'de_CH,fr_FR' );
		$this->assertSame( 'de_CH', preferred_languages_filter_locale( 'de_DE' ) );
	}

	/**
	 * @covers ::preferred_languages_init_registry
	 */
	public function test_init_registry() {
		preferred_languages_init_registry();
		$this->assertInstanceOf( Preferred_Languages_Textdomain_Registry::class, $GLOBALS['preferred_languages_textdomain_registry'] );
	}

	/**
	 * @covers ::preferred_languages_register_scripts
	 */
	public function test_register_scripts() {
		preferred_languages_register_scripts();
		$this->assertTrue( wp_script_is( 'preferred-languages', 'registered' ) );
		$this->assertTrue( wp_style_is( 'preferred-languages', 'registered' ) );
	}

	/**
	 * @covers ::preferred_languages_personal_options
	 */
	public function test_personal_options() {
		$user_id = self::factory()->user->create(
			array(
				'role' => 'administrator',
			)
		);
		wp_set_current_user( $user_id );

		$output = get_echo( 'preferred_languages_personal_options', array( wp_get_current_user() ) );

		$this->assertNotEmpty( $output );
	}

	/**
	 * @group ms-excluded
	 * @covers ::preferred_languages_personal_options
	 */
	public function test_personal_options_no_languages() {
		$user_id = self::factory()->user->create(
			array(
				'role' => 'administrator',
			)
		);
		wp_set_current_user( $user_id );

		add_filter( 'get_available_languages', '__return_empty_array' );

		$output = get_echo( 'preferred_languages_personal_options', array( wp_get_current_user() ) );

		remove_filter( 'get_available_languages', '__return_empty_array' );

		wp_set_current_user( 0 );

		$this->assertNotEmpty( $output );
	}

	/**
	 * @covers ::preferred_languages_personal_options
	 */
	public function test_personal_options_no_capability() {
		$output = get_echo( 'preferred_languages_personal_options', array( wp_get_current_user() ) );

		$this->assertNotEmpty( $output );
	}

	/**
	 * @covers ::preferred_languages_personal_options
	 */
	public function test_personal_options_no_languages_and_no_capability() {
		add_filter( 'get_available_languages', '__return_empty_array' );

		$output = get_echo( 'preferred_languages_personal_options', array( wp_get_current_user() ) );

		remove_filter( 'get_available_languages', '__return_empty_array' );

		$this->assertEmpty( $output );
	}

	/**
	 * @covers ::preferred_languages_filter_user_locale
	 */
	public function test_get_user_locale() {
		$user_id = self::factory()->user->create(
			array(
				'role' => 'administrator',
			)
		);
		update_user_meta( $user_id, 'preferred_languages', 'de_DE,fr_FR' );

		$locale = get_user_locale( $user_id );
		$this->assertSame( 'de_DE', $locale );
	}

	/**
	 * @covers ::preferred_languages_update_user_meta
	 */
	public function test_update_user_meta_empty_list() {
		$user_id = self::factory()->user->create(
			array(
				'role' => 'administrator',
			)
		);
		update_user_meta( $user_id, 'locale', 'de_DE' );
		update_user_meta( $user_id, 'preferred_languages', 'fr_FR,es_ES' );
		update_user_meta( $user_id, 'preferred_languages', '' );

		$locale = get_user_meta( $user_id, 'locale', true );
		$this->assertSame( '', $locale );
	}

	/**
	 * @covers ::preferred_languages_update_user_meta
	 */
	public function test_update_user_meta() {
		$user_id = self::factory()->user->create(
			array(
				'role' => 'administrator',
			)
		);
		update_user_meta( $user_id, 'locale', 'de_DE' );
		update_user_meta( $user_id, 'preferred_languages', 'fr_FR,es_ES' );

		$locale = get_user_meta( $user_id, 'locale', true );
		$this->assertSame( 'fr_FR', $locale );
	}

	public function data_test_sanitize_list() {
		return array(
			array( 'de_DE,fr_FR', 'de_DE,fr_FR' ),
			array( ' de_DE , fr_FR ', 'de_DE,fr_FR' ),
			array( '<b>de_DE</b>,fr_FR ', 'de_DE,fr_FR' ),
		);
	}

	/**
	 * @covers ::preferred_languages_sanitize_list
	 * @dataProvider data_test_sanitize_list
	 *
	 * @param string $input
	 * @param string $expected
	 */
	public function test_sanitize_list( $input, $expected ) {
		$actual = preferred_languages_sanitize_list( $input );
		$this->assertSame( $expected, $actual );
	}

	/**
	 * @covers ::preferred_languages_download_language_packs
	 */
	public function test_download_language_packs_no_capability() {
		add_filter( 'user_has_cap', '__return_false' );

		$actual = preferred_languages_download_language_packs( array( 'de_DE', 'fr_FR' ) );

		remove_filter( 'user_has_cap', '__return_false' );

		$this->assertSameSets( array_intersect( get_available_languages(), array( 'de_DE', 'fr_FR' ) ), $actual );
	}


	/**
	 * @covers ::preferred_languages_download_language_packs
	 */
	public function test_download_language_packs_no_capability_no_available() {
		add_filter( 'get_available_languages', '__return_empty_array' );
		add_filter( 'user_has_cap', '__return_false' );

		$actual = preferred_languages_download_language_packs( array( 'de_DE', 'fr_FR' ) );

		remove_filter( 'user_has_cap', '__return_false' );
		remove_filter( 'get_available_languages', '__return_empty_array' );

		$this->assertEmpty( $actual );
	}


	/**
	 * @covers ::preferred_languages_download_language_packs
	 */
	public function test_download_language_packs() {
		$user_id = self::factory()->user->create(
			array(
				'role' => 'administrator',
			)
		);

		wp_set_current_user( $user_id );

		$expected = array( 'de_DE', 'fr_FR' );
		$actual   = preferred_languages_download_language_packs( array( 'de_DE', 'fr_FR' ) );

		$this->assertSameSets( $expected, $actual );
	}


	/**
	 * @covers ::preferred_languages_download_language_packs
	 */
	public function test_download_language_packs_available() {
		$user_id = self::factory()->user->create(
			array(
				'role' => 'administrator',
			)
		);

		wp_set_current_user( $user_id );

		$filter = static function () {
			return array( 'de_DE', 'fr_FR' );
		};

		add_filter( 'get_available_languages', $filter );

		$expected = array( 'de_DE', 'fr_FR' );
		$actual   = preferred_languages_download_language_packs( array( 'de_DE', 'fr_FR' ) );

		remove_filter( 'get_available_languages', $filter );

		$this->assertSameSets( $expected, $actual );
	}

	/**
	 * @covers ::preferred_languages_download_language_packs
	 * @group ms-excluded
	 */
	public function test_download_language_packs_no_available() {
		$user_id = self::factory()->user->create(
			array(
				'role' => 'administrator',
			)
		);

		wp_set_current_user( $user_id );

		add_filter( 'get_available_languages', '__return_empty_array' );

		$expected = array( 'de_DE', 'fr_FR' );
		$actual   = preferred_languages_download_language_packs( array( 'de_DE', 'fr_FR' ) );

		remove_filter( 'get_available_languages', '__return_empty_array' );

		$this->assertSameSets( $expected, $actual );
	}

	/**
	 * @covers ::preferred_languages_download_language_packs
	 * @group ms-required
	 */
	public function test_download_language_packs_no_available_multisite_no_super_admin() {
		$user_id = self::factory()->user->create(
			array(
				'role' => 'administrator',
			)
		);

		wp_set_current_user( $user_id );

		add_filter( 'get_available_languages', '__return_empty_array' );

		$actual = preferred_languages_download_language_packs( array( 'de_DE', 'fr_FR' ) );

		remove_filter( 'get_available_languages', '__return_empty_array' );

		$this->assertEmpty( $actual );
	}

	/**
	 * @covers ::preferred_languages_download_language_packs
	 * @group ms-required
	 */
	public function test_download_language_packs_no_available_multisite() {
		$user_id = self::factory()->user->create(
			array(
				'role' => 'administrator',
			)
		);

		wp_set_current_user( $user_id );
		grant_super_admin( $user_id );

		add_filter( 'get_available_languages', '__return_empty_array' );

		$expected = array( 'de_DE', 'fr_FR' );
		$actual   = preferred_languages_download_language_packs( array( 'de_DE', 'fr_FR' ) );

		remove_filter( 'get_available_languages', '__return_empty_array' );

		$this->assertSameSets( $expected, $actual );
	}

	/**
	 * @covers ::preferred_languages_override_load_textdomain
	 */
	public function test_override_load_textdomain_no_preferred_locales() {
		$this->assertFalse( preferred_languages_override_load_textdomain( false, 'default', '' ) );
		$this->assertTrue( preferred_languages_override_load_textdomain( true, 'default', '' ) );
	}

	/**
	 * @covers ::preferred_languages_override_load_textdomain
	 */
	public function test_override_load_textdomain_already_filtered() {
		update_option( 'preferred_languages', 'de_DE,fr_FR' );

		$filter = static function() {
			return 'es_ES';
		};

		add_filter( 'determine_locale', $filter );

		$actual1 = preferred_languages_override_load_textdomain( false, 'default', '' );
		$actual2 = preferred_languages_override_load_textdomain( true, 'default', '' );

		remove_filter( 'determine_locale', $filter );

		$this->assertFalse( $actual1 );
		$this->assertTrue( $actual2 );
	}

	/**
	 * @covers ::preferred_languages_override_load_textdomain
	 */
	public function test_override_load_textdomain_no_merge() {
		update_option( 'preferred_languages', 'de_DE,fr_FR' );

		$filter = static function() {
			return 'de_DE';
		};

		add_filter( 'determine_locale', $filter );

		$actual1 = preferred_languages_override_load_textdomain( false, 'default', '' );
		$actual2 = preferred_languages_override_load_textdomain( true, 'default', '' );

		remove_filter( 'determine_locale', $filter );

		$this->assertFalse( $actual1 );
		$this->assertTrue( $actual2 );
	}

	/**
	 * @covers ::preferred_languages_override_load_textdomain
	 */
	public function test_override_load_textdomain_merge() {
		$this->markTestIncomplete( 'Provide actual MO files to demonstrate merging' );
		update_option( 'preferred_languages', 'de_DE,fr_FR' );

		$filter = static function() {
			return 'de_DE';
		};

		add_filter( 'determine_locale', $filter );
		add_filter( 'preferred_languages_merge_translations', '__return_true' );

		$actual1 = preferred_languages_override_load_textdomain( false, 'default', '' );
		$actual2 = preferred_languages_override_load_textdomain( true, 'default', '' );

		remove_filter( 'preferred_languages_merge_translations', '__return_true' );
		remove_filter( 'determine_locale', $filter );

		$this->assertFalse( $actual1 );
		$this->assertTrue( $actual2 );
	}

	/**
	 * @covers ::preferred_languages_load_textdomain_mofile
	 */
	public function test_load_textdomain_mofile_no_preferred_locales() {
		$actual = preferred_languages_load_textdomain_mofile( 'foo', 'default' );
		$this->assertSame( 'foo', $actual );
	}

	/**
	 * @covers ::preferred_languages_load_textdomain_mofile
	 */
	public function test_load_textdomain_mofile_already_filtered() {
		update_option( 'preferred_languages', 'de_DE,fr_FR' );

		$filter = static function() {
			return 'es_ES';
		};

		add_filter( 'determine_locale', $filter );

		$actual = preferred_languages_load_textdomain_mofile( 'foo', 'default' );

		remove_filter( 'determine_locale', $filter );

		$this->assertSame( 'foo', $actual );
	}
}
