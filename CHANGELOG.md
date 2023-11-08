# Changelog

## 2.1.0

* Filters the `WPLANG` option for improved compatibility.
* Minimum PHP version requirement increased to 7.0.
* Ensures compatibility with WordPress 6.4.

## 2.0.1

* Prevent "Undefined index" notices when merging script translations.
* Ensures compatibility with WordPress 6.3.

## 2.0.0

* Improve compatibility with WordPress 6.1 and `WP_Textdomain_Registry`.
* Minimum WordPress version requirement has been increased to 6.1.
* Improves robustness when using locale switching.
* Fixes issue with merging script translations.
* Completely rewritten UI using React.
* Remove drag & drop sorting to simplify UI.
* Show loading spinner when saving settings and installing translations.
* Add compatibility with WordPress 6.2 and `switch_to_user_locale`.

## 1.8.0

* Adds Preferred Languages to Site Health debug data.
* Improves compatibility with plugins such as WPML which also modify the language selection UI.
* Improves robustness of language pack downloading after saving changes.
* Improves test coverage and fixes many smaller bugs.
* Fixes UI issue where locales where not appearing in the dropdown anymore.

## 1.7.1

* Fixes an issue where the profile language was not overriding the site language.
* Fixes an issue where merging translations was not actually working.
* Adds support for merging script translations.
* Improves ecosystem compatibility by falling back to `locale` user meta and updating it.

## 1.7.0

* Adds a new `preferred_languages_merge_translations` filter that allows merging translations (off by default).
* Adds a new `preferred_languages_download_language_packs` action for plugins to hook in.
* Minimum PHP version requirement has been increased to 5.6.
* Minimum WordPress version requirement has been increased to 5.3.
* Improves Multisite support by hooking into Network settings screen.
* Adds polyglots icon next to form labels to match core styling.

## 1.6.0

* Enhancement: Added support for JavaScript internationalization as used in the new block editor in WordPress 5.0. Requires WordPress 5.0.3.
* Fixed: Fixes an issue where the preferred languages list wasn't updating after sorting via drag & drop.

## 1.5.0

* Enhancement: Improved compatibility with multilingual plugins like Polylang.
* Fixed: Fixes an issue with keyboard navigation.
* Fixed: Make sure the correct languages are retrieved when updating the settings.

## 1.4.0

* New: Keyboard navigation improvements.
* New: Tooltips now show the available keyboard shortcuts.
* New: Missing translations are now downloaded even when no changes were made.
* New: A warning is shown when some of the preferred languages aren't installed.
* New: Settings form is now hidden when JavaScript is disabled.
* Fixed: Improved setting the current locale.
* Fixed: CSS is no longer enqueued on the front end.

## 1.3.0

* New: Users can now choose English (United States) again as a preferred locale.
* New: Users with the right capabilities can now install languages in their user profile as well.

## 1.2.0

* Fixed: Other English locales can now be added again.
* Fixed: Prevented some errors when adding all available locales.

## 1.1.0

* New: Support for just-in-time loading of translations.
* New: Keyboard shortcut for making inactive locales active.
* Fixed: Responsive design improvements.
* Fixed: Worked around a few edge cases with the various controls.
* Fixed: Added missing text domains.

## 1.0.1

* Fixed: Fixed a bug that prevented saving changes.

## 1.0.0

* Initial release.
