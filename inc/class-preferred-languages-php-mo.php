<?php
/**
 * Class for working with PHP "MO" files
 *
 * @since 2.1.0
 *
 * @package PreferredLanguages
 */

/**
 * PHP MO class.
 *
 * @since 2.1.0
 */
class Preferred_Languages_PHP_MO extends Gettext_Translations {

	/**
	 * Number of plural forms.
	 *
	 * @var int
	 */
	public $_nplurals = 2;

	/**
	 * Loaded MO file.
	 *
	 * @var string
	 */
	private $filename = '';

	/**
	 * Returns the loaded MO file.
	 *
	 * @return string The loaded MO file.
	 */
	public function get_filename() {
		return $this->filename;
	}

	/**
	 * Fills up with the entries from MO file $filename.
	 *
	 * @param string $filename MO file to load.
	 * @return bool True if the import from file was successful, otherwise false.
	 */
	public function import_from_file( $filename ) {
		if ( ! file_exists( $filename ) ) {
			return false;
		}

		$this->filename = (string) $filename;

		$translations = include $filename;

		$headers = array(
			'PO-Revision-Date' => $translations['translation-revision-data'],
			'X-Generator'      => $translations['generator'],
			'Plural-Forms'     => $translations['locale_data']['messages']['']['plural-forms'],
			'Language'         => $translations['locale_data']['messages']['']['lang'],
		);

		$this->set_headers( array_filter( $headers ) );

		foreach ( $translations['locale_data']['messages'] as $original => $translation ) {
			if ( '' === $original ) {
				continue;
			}

			$entry                          = &$this->make_entry( $original, implode( "\0", $translation ) );
			$entry->is_plural               = count( $translation ) > 1;
			$this->entries[ $entry->key() ] = &$entry;
		}

		return true;
	}

	/**
	 * Build a Translation_Entry from original string and translation strings,
	 * found in a MO file
	 *
	 * @static
	 * @param string $original    Original string to translate from MO file. Might contain
	 *                            0x04 as context separator or 0x00 as singular/plural separator.
	 * @param string $translation translation string from MO file. Might contain
	 *                            0x00 as a plural translations separator.
	 * @return Translation_Entry Entry instance.
	 */
	public function &make_entry( $original, $translation ) {
		$entry = new Translation_Entry();
		// Look for context, separated by \4.
		$parts = explode( "\4", $original );
		if ( isset( $parts[1] ) ) {
			$original       = $parts[1];
			$entry->context = $parts[0];
		}

		$entry->singular = $original;

		$translations = explode( "\0", $translation );

		if ( count( $translations ) > 1 ) {
			$entry->is_plural = true;
		}

		$entry->translations = $translations;

		return $entry;
	}

	/**
	 * Get the plural form for a given count.
	 *
	 * @param int $count Count.
	 * @return string Plural form.
	 */
	public function select_plural_form( $count ) {
		return $this->gettext_select_plural_form( $count );
	}

	/**
	 * Returns the plural forms count.
	 *
	 * @return int Plural forms count.
	 */
	public function get_plural_forms_count() {
		return $this->_nplurals;
	}
}
