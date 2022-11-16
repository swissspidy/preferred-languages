import { visitAdminPage } from '@wordpress/e2e-test-utils';

describe( 'Settings Page', () => {
	it( 'should display the preferred languages form', async () => {
		await visitAdminPage( 'options-general.php' );

		await expect( page ).toMatch( 'General Settings' );

		await expect( page ).not.toMatchElement( '#WPLANG', { visible: true } );
		await expect( page ).toMatchElement( '.site-preferred-languages-wrap' );
		await expect( page ).toMatch(
			'Choose languages for displaying WordPress in, in order of preference.'
		);
		await expect( page ).toMatch( /Nothing set/ );
	} );

	it( 'should disable form buttons initially', async () => {
		await visitAdminPage( 'options-general.php' );

		await expect( page ).not.toMatchElement( '#WPLANG' );
		await expect( page ).toMatchElement( '.site-preferred-languages-wrap' );
		await expect( page ).toMatch(
			'Choose languages for displaying WordPress in, in order of preference.'
		);

		await expect( page ).toMatch( /Nothing set/ );

		expect(
			await page.$eval(
				'input[name="preferred_languages"]',
				( el ) => el.value
			)
		).toStrictEqual( '' );

		await expect( page ).toMatchElement(
			'.preferred-languages [aria-label="Move language up (Up)"]'
		);

		// Form buttons disabled by default.
		await expect( page ).toMatchElement(
			'.preferred-languages [aria-label="Move language up (Up)"][disabled]'
		);
		await expect( page ).toMatchElement(
			'.preferred-languages [aria-label="Move language down (Down)"][disabled]'
		);
		await expect( page ).toMatchElement(
			'.preferred-languages [aria-label="Remove from list (Delete)"][disabled]'
		);
	} );

	it( 'should add a language to the list', async () => {
		await visitAdminPage( 'options-general.php' );

		await expect( page ).toMatchElement( '.site-preferred-languages-wrap' );

		const newLocale = await page.$eval(
			'.inactive-locales-list select',
			( el ) => el.value
		);

		await expect( page ).toClick( '[aria-label^="Add to list"]' );
		const activeLocales = await page.$eval(
			'input[name="preferred_languages"]',
			( el ) => el.value
		);

		expect( activeLocales ).toStrictEqual( newLocale );

		await expect( page ).toMatchElement(
			`.active-locale[aria-selected="true"][id="${ newLocale }"]`
		);

		await expect( page ).toMatchElement(
			'.preferred-languages [aria-label="Move language up (Up)"][disabled]'
		);
		await expect( page ).toMatchElement(
			'.preferred-languages [aria-label="Move language down (Down)"][disabled]'
		);
		await expect( page ).toMatchElement(
			'.preferred-languages [aria-label="Remove from list (Delete)"]:not([disabled])'
		);
	} );

	it( 'should allow navigation using keyboard', async () => {
		await visitAdminPage( 'options-general.php' );

		await expect( page ).toMatchElement( '.site-preferred-languages-wrap' );

		const selectedLocales = [];

		selectedLocales.push(
			await page.$eval(
				'.inactive-locales-list select',
				( el ) => el.value
			)
		);
		await expect( page ).toClick( '[aria-label^="Add to list"]' );

		selectedLocales.push(
			await page.$eval(
				'.inactive-locales-list select',
				( el ) => el.value
			)
		);
		await expect( page ).toClick( '[aria-label^="Add to list"]' );

		selectedLocales.push(
			await page.$eval(
				'.inactive-locales-list select',
				( el ) => el.value
			)
		);
		await expect( page ).toClick( '[aria-label^="Add to list"]' );

		selectedLocales.push(
			await page.$eval(
				'.inactive-locales-list select',
				( el ) => el.value
			)
		);
		await expect( page ).toClick( '[aria-label^="Add to list"]' );

		const activeLocales = await page.$eval(
			'input[name="preferred_languages"]',
			( el ) => el.value
		);

		expect( activeLocales ).toStrictEqual( selectedLocales.join( ',' ) );

		await expect( page ).toMatchElement(
			`.active-locale[aria-selected="true"][id="${ selectedLocales[ 3 ] }"]`
		);

		await expect( page ).toMatchElement(
			'.preferred-languages [aria-label="Move language up (Up)"]:not([disabled])'
		);
		await expect( page ).toMatchElement(
			'.preferred-languages [aria-label="Move language down (Down)"][disabled]'
		);
		await expect( page ).toMatchElement(
			'.preferred-languages [aria-label="Remove from list (Delete)"]:not([disabled])'
		);

		// After moving one position up, none of the buttons should be disabled anymore.
		await page.keyboard.press( 'ArrowUp' );

		await expect( page ).toMatchElement(
			'.preferred-languages [aria-label="Move language up (Up)"]:not([disabled])'
		);
		await expect( page ).toMatchElement(
			'.preferred-languages [aria-label="Move language down (Down)"]:not([disabled])'
		);
		await expect( page ).toMatchElement(
			'.preferred-languages [aria-label="Remove from list (Delete)"]:not([disabled])'
		);

		// After moving two up again, the "Move Up" button should be disabled because we reached the top.
		await page.keyboard.press( 'ArrowUp' );
		await page.keyboard.press( 'ArrowUp' );

		await expect( page ).toMatchElement(
			'.preferred-languages [aria-label="Move language up (Up)"][disabled]'
		);
		await expect( page ).toMatchElement(
			'.preferred-languages [aria-label="Move language down (Down)"]:not([disabled])'
		);
		await expect( page ).toMatchElement(
			'.preferred-languages [aria-label="Remove from list (Delete)"]:not([disabled])'
		);

		await expect( page ).toMatchElement(
			`.active-locale[aria-selected="true"][id="${ selectedLocales[ 3 ] }"]`
		);

		expect(
			await page.$eval(
				'input[name="preferred_languages"]',
				( el ) => el.value
			)
		).toStrictEqual( 'fr_FR,de_CH,de_DE,es_ES' );
	} );
} );
