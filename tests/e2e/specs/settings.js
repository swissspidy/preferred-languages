import { visitAdminPage } from '@wordpress/e2e-test-utils';

describe( 'Settings Page', () => {
	it( 'should display the preferred languages form', async () => {
		await visitAdminPage( 'options-general.php' );

		await expect( page ).toMatchElement( '.site-preferred-languages-wrap' );
		await expect( page ).toMatch(
			'Choose languages for displaying WordPress in, in order of preference.'
		);
		await expect( page ).toMatch(
			'Falling back to English (United States).'
		);

		// Form buttons disabled by default.
		await expect( page ).toMatchElement(
			'.preferred-languages button[disabled]',
			{
				text: /Move Up/i,
			}
		);
		await expect( page ).toMatchElement(
			'.preferred-languages button[disabled]',
			{
				text: /Move Down/i,
			}
		);
		await expect( page ).toMatchElement(
			'.preferred-languages button[disabled]',
			{
				text: /Remove/i,
			}
		);

		const inactiveLocale = await page.$eval(
			'#preferred-languages-inactive-locales',
			( el ) => el.value
		);

		// Afrikaans is the first item in the dropdown by default.
		expect( inactiveLocale ).toStrictEqual( 'af' );

		await expect( page ).toClick( '.preferred-languages button', {
			text: /Add/i,
		} );

		// After adding Afrikaans to the list, only the "Remove" button should be active.
		await expect( page ).toMatchElement( '.active-locale', {
			text: /Afrikaans/i,
		} );

		await expect( page ).toMatchElement(
			'.preferred-languages button[disabled]',
			{
				text: /Move Up/i,
			}
		);
		await expect( page ).toMatchElement(
			'.preferred-languages button[disabled]',
			{
				text: /Move Down/i,
			}
		);
		await expect( page ).toMatchElement(
			'.preferred-languages button:not([disabled])',
			{
				text: /Remove/i,
			}
		);

		await expect( page ).toClick( '.preferred-languages button', {
			text: /Add/i,
		} );
		await expect( page ).toClick( '.preferred-languages button', {
			text: /Add/i,
		} );

		// After adding two more locales, the last one should be selected.

		await expect( page ).toMatchElement(
			'.preferred-languages button:not([disabled])',
			{
				text: /Move Up/i,
			}
		);
		await expect( page ).toMatchElement(
			'.preferred-languages button[disabled]',
			{
				text: /Move Down/i,
			}
		);
		await expect( page ).toMatchElement(
			'.preferred-languages button:not([disabled])',
			{
				text: /Remove/i,
			}
		);

		// After moving one up, none of the buttons should be disabled anymore.
		await page.keyboard.press( 'ArrowUp' );

		await expect( page ).toMatchElement(
			'.preferred-languages button:not([disabled])',
			{
				text: /Move Down/i,
			}
		);

		// After moving one up again, the "Move Up" button should be disabled because we reached the top.
		await page.keyboard.press( 'ArrowUp' );

		await expect( page ).toMatchElement(
			'.preferred-languages button:not([disabled])',
			{
				text: /Move Up/i,
			}
		);
	} );
} );
