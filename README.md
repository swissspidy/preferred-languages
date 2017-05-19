# Preferred Languages

A [feature project](https://make.wordpress.org/core/features/) for letting WordPress users set their site's language in a more sensible way.

## What it does

This plugin lets you select multiple preferred languages in your settings. WordPress then tries to load the translations for the first language that's available, falling back to the next language in your list.

This works great when you want to display WordPress in a locale like German (Formal) and have it fall back to informal German when there's no translation available.

## Screenshots

![Preferred Languages: Settings Section](https://raw.githubusercontent.com/swissspidy/preferred-languages/master/assets/screenshot-1.png)

Preferred Languages settings section

![Preferred Languages: User Profile](https://raw.githubusercontent.com/swissspidy/preferred-languages/master/assets/screenshot-2.png)

A user’s individual list of preferred languages

## Contributing

Please help test! Install the plugin and [open issues](https://github.com/swissspidy/preferred-languages/issues) for any bugs you might find.

To minify the JavaScript when submitting a PR, run `npm run build:js`. To update the POT file, you can use [`makepot.php`](https://github.com/ocean90/wp-i18n-tools). Note that the POT file will be removed when this plugin would be made available over the WordPress Plugin Directory.

Also, please read all the blog posts tagged [#preferred-languages](https://make.wordpress.org/core/tag/preferred-languages/) on make/core and join the discussion in [#core-i18n](https://wordpress.slack.com/messages/#core-i18n) on the WordPress [Slack](https://make.wordpress.org/chat/) team.