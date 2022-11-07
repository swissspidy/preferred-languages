=== Preferred Languages ===
Contributors: swissspidy
Tags: internationalization, i18n, localization, l10n, language, locale, translation
Tested up to: 6.1
Stable tag: 1.9.0
License: GPLv2 or later
License URI: http://www.gnu.org/licenses/gpl-2.0.html

Choose languages for displaying WordPress in, in order of preference.

== Description ==

Thanks to language packs it's easier than ever before to change the main language of your site.
However, in some cases a single locale is not enough. When WordPress can't find a translation for the active locale, it falls back to the original English strings.
That’s a poor user experience for many non-English speakers.

This feature project aims to change that by letting users choose multiple languages for displaying WordPress in.
That way you can set some sort of "fallback chain" where WordPress tries to load translations in your preferred order.

Please help us test this plugin and let us know if something is not working as you think it should.

**Merging Translations**

By default, only the first available translation for a given locale and domain will be loaded.
However, when translations are incomplete, some strings might still be displayed in English.
That's a poor user experience as well.

To prevent this, the `preferred_languages_merge_translations` filter can be used to opt into merging incomplete translations.
It provides three parameters:

1. `$merge` - Whether translations should be merged.
2. `$domain` - The text domain
3. `$current_locale` - The current locale.

**Warning**: Since this is a potentially slow/expensive process involving the loading of multiple translation files, it's recommended to use it
sparingly and only for specific domains.


= Get Involved =

Active development is taking place on [GitHub](https://github.com/swissspidy/preferred-languages).

If you want to get involved, check out [open issues](https://github.com/swissspidy/preferred-languages/issues) and join the [#core-i18n](https://wordpress.slack.com/messages/core-i18n) channel on [Slack](https://wordpress.slack.com/). If you don't have a Slack account yet, you can sign up at [make.wordpress.org/chat/](https://make.wordpress.org/chat/).

== Screenshots ==

1. The new language section in 'Settings' -> 'General'
2. The new language section in your user profile.

== Changelog ==

For the plugin's changelog, please head over to [the GitHub repository](https://github.com/swissspidy/preferred-languages).

== Upgrade Notice ==

= 1.9.0 =

This release improves compatibility with locale switching and WordPress 6.1.
