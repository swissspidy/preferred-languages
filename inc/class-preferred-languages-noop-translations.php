<?php
/**
 * Locale API: Preferred_Languages_Noop_Translations class
 *
 * @package    PreferredLanguages
 * @since      2.1.2
 */

/**
 * Provides the same interface as Translations, but doesn't do anything.
 *
 * Used for caching information about available translations
 * when using just-in-time translation loading to avoid
 * unnecessary database calls when looking up list of preferred languages.
 *
 * @since 2.1.2
 */
class Preferred_Languages_Noop_Translations extends NOOP_Translations {}
