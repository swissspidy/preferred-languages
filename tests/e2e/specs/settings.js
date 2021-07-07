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
				text: 'Move Up',
			}
		);
		await expect( page ).toMatchElement(
			'.preferred-languages button[disabled]',
			{
				text: 'Move Down',
			}
		);
		await expect( page ).toMatchElement(
			'.preferred-languages button[disabled]',
			{
				text: 'Remove',
			}
		);

		const inactiveLocales = await page.$(
			'preferred-languages-inactive-locales'
		);

		// Afrikaans is the first item in the dropdown by default.
		expect( inactiveLocales.value ).toStrictEqual( 'af' );

		await expect( page ).toClick( '.preferred-languages button[disabled]', {
			text: 'Add',
		} );

		// After adding Afrikaans to the list, only the "Remove" button should be active.
		await expect( page ).toMatch( '.active-locale', { text: 'Afrikaans' } );

		await expect( page ).toMatchElement(
			'.preferred-languages button[disabled]',
			{
				text: 'Move Up',
			}
		);
		await expect( page ).toMatchElement(
			'.preferred-languages button[disabled]',
			{
				text: 'Move Down',
			}
		);
		await expect( page ).not.toMatchElement(
			'.preferred-languages button[disabled]',
			{
				text: 'Remove',
			}
		);

		await expect( page ).toMatchElement( '.preferred-languages button', {
			text: 'Remove',
		} );
	} );
} );
