<?php

/**
 * @coversDefaultClass Preferred_Languages_Textdomain_Registry
 */
class Textdomain_Registry_Test extends WP_UnitTestCase {
	/**
	 * @covers ::get_path_from_lang_dir
	 * @covers ::set_cached_mo_files
	 */
	public function test_get_path_from_lang_dir_no_preferred_languages() {
		$registry = new Preferred_Languages_Textdomain_Registry();
		$this->assertFalse( $registry->get( 'internationalized-plugin', 'de_DE' ) );
	}

	/**
	 * @covers ::get
	 * @covers ::get_path_from_lang_dir
	 * @covers ::set_cached_mo_files
	 */
	public function test_get_path_from_lang_dir_plugin() {
		update_option( 'preferred_languages', 'de_DE,fr_FR' );
		$registry = new Preferred_Languages_Textdomain_Registry();
		$this->assertNotFalse( $registry->get( 'internationalized-plugin', 'de_DE' ) );
		$this->assertStringEndsWith( WP_LANG_DIR . '/plugins/', $registry->get( 'internationalized-plugin', 'de_DE' ) );
	}

	/**
	 * @covers ::get
	 * @covers ::get_path_from_lang_dir
	 * @covers ::set_cached_mo_files
	 */
	public function test_get_path_from_lang_dir_theme() {
		update_option( 'preferred_languages', 'de_DE,fr_FR' );
		$registry = new Preferred_Languages_Textdomain_Registry();
		$this->assertNotFalse( $registry->get( 'internationalized-theme', 'de_DE' ) );
		$this->assertStringEndsWith( WP_LANG_DIR . '/themes/', $registry->get( 'internationalized-theme', 'de_DE' ) );
	}

	/**
	 * @covers ::set
	 * @covers ::get
	 */
	public function test_set_adds_trailing_slash() {
		$registry = new Preferred_Languages_Textdomain_Registry();
		$registry->set( 'foo', 'de_DE', '/path/to/mo-files' );
		$this->assertSame( '/path/to/mo-files/', $registry->get( 'foo', 'de_DE' ) );
	}

	/**
	 * @covers ::set
	 */
	public function test_set_no_path() {
		$registry = new Preferred_Languages_Textdomain_Registry();
		$registry->set( 'foo', 'de_DE', false );
		$this->assertFalse( $registry->get( 'foo', 'de_DE' ) );
	}

	/**
	 * @covers ::reset
	 */
	public function test_reset() {
		$registry = new Preferred_Languages_Textdomain_Registry();
		$registry->set( 'foo', 'de_DE', '/path/to/mo-files' );
		$registry->reset();
		$this->assertFalse( $registry->get( 'foo', 'de_DE' ) );
	}
}
