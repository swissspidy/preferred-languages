import {
	activatePlugin,
	deactivatePlugin,
	visitAdminPage,
	setOption,
	getOption,
} from '@wordpress/e2e-test-utils';

describe( 'Translation Loading', () => {
	beforeAll( async () => {
		await visitAdminPage( 'options-general.php' );

		const localesDropdown = await page.$( '.inactive-locales-list select' );

		await localesDropdown.select( 'fr_FR' );
		await page.click( '[aria-label^="Add to list"]' );

		await localesDropdown.select( 'it_IT' );
		await page.click( '[aria-label^="Add to list"]' );

		await localesDropdown.select( 'de_CH' );
		await page.click( '[aria-label^="Add to list"]' );

		await localesDropdown.select( 'de_DE' );
		await page.click( '[aria-label^="Add to list"]' );

		await localesDropdown.select( 'es_ES' );
		await page.click( '[aria-label^="Add to list"]' );

		await Promise.all( [
			page.click( '#submit' ),
			page.waitForNavigation( {
				waitUntil: 'networkidle0',
			} ),
		] );

		await activatePlugin( 'custom-internationalized-plugin' );
		await deactivatePlugin( 'merge-translations' );
	} );

	afterAll( async () => {
		await deactivatePlugin( 'custom-internationalized-plugin' );

		// Extra space just so page.type() types something to clear the input field.
		await setOption( 'preferred_languages', ' ' );
	} );

	it( 'should correctly translate strings', async () => {
		// Just to ensure the setup in beforeAll() has worked.
		const installedLocales = await getOption( 'preferred_languages' );
		await expect( installedLocales ).toStrictEqual(
			'fr_FR,it_IT,de_CH,de_DE,es_ES'
		);

		await visitAdminPage( 'index.php' );

		const defaultOutput = await page.$eval(
			'.notice-custom-i18n-plugin-locale-current',
			( el: HTMLElement ) => el.innerText
		);
		expect( defaultOutput ).toMatchInlineSnapshot(
			`
		"Current Locale: fr_FR
		Preferred Languages: fr_FR,it_IT,de_CH,de_DE,es_ES
		Output:
		Das ist ein Dummy Plugin
		This is another dummy plugin"
	`
		);

		const localeSwitching = await page.$eval(
			'.notice-custom-i18n-plugin-locale-switching',
			( el: HTMLElement ) => el.innerText
		);
		expect( localeSwitching ).toMatchInlineSnapshot(
			`
		"Current Locale: fr_FR
		Preferred Languages: fr_FR,it_IT,de_CH,de_DE,es_ES
		Output:
		Das ist ein Dummy Plugin
		This is another dummy plugin
		Switched to it_IT: True
		Current Locale: it_IT
		Output:
		Das ist ein Dummy Plugin
		This is another dummy plugin
		Switched to de_DE: True
		Current Locale: de_DE
		Output:
		Das ist ein Dummy Plugin
		This is another dummy plugin
		Switched to en_US: True
		Current Locale: en_US
		Output:
		This is a dummy plugin
		This is another dummy plugin
		Switched to de_CH: True
		Current Locale: de_CH
		Output:
		Das ist ein Dummy Plugin
		This is another dummy plugin
		Switched to es_ES: True
		Current Locale: es_ES
		Output:
		Este es un plugin dummy
		Este es otro plugin dummy"
	`
		);

		const jsI18n = await page.$eval(
			'.notice-custom-i18n-plugin-js',
			( el: HTMLElement ) => el.innerText
		);
		expect( jsI18n ).toMatchInlineSnapshot(
			`
		"Das ist ein Dummy Plugin
		This is another dummy plugin"
	`
		);
	} );

	describe( 'Merging Translations', () => {
		beforeAll( async () => {
			await activatePlugin( 'merge-translations' );
		} );

		afterAll( async () => {
			await deactivatePlugin( 'merge-translations' );
		} );

		it( 'should correctly translate strings', async () => {
			await visitAdminPage( 'index.php' );

			const defaultOutput = await page.$eval(
				'.notice-custom-i18n-plugin-locale-current',
				( el: HTMLElement ) => el.innerText
			);
			expect( defaultOutput ).toMatchInlineSnapshot(
				`
			"Current Locale: fr_FR
			Preferred Languages: fr_FR,it_IT,de_CH,de_DE,es_ES
			Output:
			Das ist ein Dummy Plugin
			Este es otro plugin dummy"
		`
			);

			const localeSwitching = await page.$eval(
				'.notice-custom-i18n-plugin-locale-switching',
				( el: HTMLElement ) => el.innerText
			);
			expect( localeSwitching ).toMatchInlineSnapshot(
				`
			"Current Locale: fr_FR
			Preferred Languages: fr_FR,it_IT,de_CH,de_DE,es_ES
			Output:
			Das ist ein Dummy Plugin
			Este es otro plugin dummy
			Switched to it_IT: True
			Current Locale: it_IT
			Output:
			Das ist ein Dummy Plugin
			Este es otro plugin dummy
			Switched to de_DE: True
			Current Locale: de_DE
			Output:
			Das ist ein Dummy Plugin
			Este es otro plugin dummy
			Switched to en_US: True
			Current Locale: en_US
			Output:
			This is a dummy plugin
			This is another dummy plugin
			Switched to de_CH: True
			Current Locale: de_CH
			Output:
			Das ist ein Dummy Plugin
			Este es otro plugin dummy
			Switched to es_ES: True
			Current Locale: es_ES
			Output:
			Das ist ein Dummy Plugin
			Este es otro plugin dummy"
		`
			);

			const jsI18n = await page.$eval(
				'.notice-custom-i18n-plugin-js',
				( el: HTMLElement ) => el.innerText
			);
			expect( jsI18n ).toMatchInlineSnapshot(
				`
			"Das ist ein Dummy Plugin
			Este es otro plugin dummy"
		`
			);
		} );
	} );
} );
