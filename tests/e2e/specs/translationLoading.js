import {
	activatePlugin,
	deactivatePlugin,
	visitAdminPage,
	setOption,
} from '@wordpress/e2e-test-utils';

jest.setTimeout( 30000 );

describe( 'Translation Loading', () => {
	beforeAll( async () => {
		await activatePlugin( 'custom-internationalized-plugin' );

		// Just so the preferred_languages option gets saved & setOption() can change it.
		await visitAdminPage( 'options-general.php' );
		await page.click( '.preferred-languages button.locales-add' );
		await Promise.all( [
			page.click( '#submit' ),
			page.waitForNavigation( {
				waitUntil: 'networkidle0',
			} ),
		] );

		await setOption(
			'preferred_languages',
			'fr_FR,it_IT,de_CH,de_DE,es_ES'
		);

		// To ensure translations are installed.
		await visitAdminPage( 'options-general.php' );
		await Promise.all( [
			page.click( '#submit' ),
			page.waitForNavigation( {
				waitUntil: 'networkidle0',
			} ),
		] );
	} );

	afterAll( async () => {
		await deactivatePlugin( 'custom-internationalized-plugin' );
		await setOption( 'preferred_languages', '' );
	} );

	it( 'should correctly translate strings', async () => {
		await visitAdminPage( 'index.php' );

		const defaultOutput = await page.$eval(
			'.notice-custom-i18n-plugin-locale-current',
			( el ) => el.innerText
		);
		expect( defaultOutput ).toMatchInlineSnapshot(
			'Default Output',
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
			( el ) => el.innerText
		);
		expect( localeSwitching ).toMatchInlineSnapshot(
			'Locale Switching',
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
			( el ) => el.innerText
		);
		expect( jsI18n ).toMatchInlineSnapshot(
			'JavaScript Translation',
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
				( el ) => el.innerText
			);
			expect( defaultOutput ).toMatchInlineSnapshot(
				'Default Output',
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
				( el ) => el.innerText
			);
			expect( localeSwitching ).toMatchInlineSnapshot(
				'Locale Switching',
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
				( el ) => el.innerText
			);
			expect( jsI18n ).toMatchInlineSnapshot(
				'JavaScript Translation',
				`
			"Das ist ein Dummy Plugin
			Este es otro plugin dummy"
		`
			);
		} );
	} );
} );
