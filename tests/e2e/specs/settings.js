import { visitAdminPage } from '@wordpress/e2e-test-utils';

describe( 'Settings Page', () => {
	it( 'should display the preferred languages form', async () => {
		await visitAdminPage( 'options-general.php' );

		await expect( page ).toMatch( 'General Settings' );
		await page.$eval( '.site-preferred-languages-wrap', ( el ) =>
			el.scrollIntoView()
		);

		await expect( page ).toMatchElement( '.site-preferred-languages-wrap' );
		await expect( page ).toMatch(
			'Choose languages for displaying WordPress in, in order of preference.'
		);
		await expect( page ).toMatch(
			'Falling back to English (United States).'
		);

		// Form buttons disabled by default.
		await expect( page ).toMatchElement(
			'.preferred-languages button.locales-move-up[disabled]'
		);
		await expect( page ).toMatchElement(
			'.preferred-languages button.locales-move-down[disabled]'
		);
		await expect( page ).toMatchElement(
			'.preferred-languages button.locales-remove[disabled]'
		);

		const inactiveLocale = await page.$eval(
			'#preferred-languages-inactive-locales',
			( el ) => el.value
		);

		// Afrikaans is the first item in the dropdown by default.
		expect( inactiveLocale ).toStrictEqual( 'af' );

		await expect( page ).toClick(
			'.preferred-languages button.locales-add'
		);

		// After adding Afrikaans to the list, only the "Remove" button should be active.
		await expect( page ).toMatchElement( '.active-locale', {
			text: /Afrikaans/i,
		} );

		await expect( page ).toMatchElement(
			'.preferred-languages button.locales-move-up[disabled]'
		);
		await expect( page ).toMatchElement(
			'.preferred-languages button.locales-move-down[disabled]'
		);
		await expect( page ).toMatchElement(
			'.preferred-languages button.locales-remove:not([disabled])'
		);

		await expect( page ).toClick(
			'.preferred-languages button.locales-add'
		);
		await expect( page ).toClick(
			'.preferred-languages button.locales-add'
		);

		const activeLocales = await page.$eval(
			'input[name="preferred_languages"]',
			( el ) => el.value
		);

		expect( activeLocales ).toStrictEqual( 'af,ar,ary' );

		// After adding two more locales, the last one should be selected.

		await expect( page ).toMatchElement(
			'.active-locale[aria-selected="true"]',
			{
				text: 'العربية المغربية',
			}
		);

		await expect( page ).toMatchElement(
			'.preferred-languages button.locales-move-up:not([disabled])'
		);
		await expect( page ).toMatchElement(
			'.preferred-languages button.locales-move-down[disabled]'
		);
		await expect( page ).toMatchElement(
			'.preferred-languages button.locales-remove:not([disabled])'
		);

		// Focusing on the listbox ensures that keyboard navigation works as expected.
		await page.focus( '.active-locales-list' );

		// After moving one position up, none of the buttons should be disabled anymore.
		await page.keyboard.press( 'ArrowUp' );

		await expect( page ).toMatchElement(
			'.preferred-languages button.locales-move-down:not([disabled])'
		);

		// After moving one up again, the "Move Up" button should be disabled because we reached the top.
		await page.keyboard.press( 'ArrowUp' );

		await expect( page ).toMatchElement(
			'.active-locale[aria-selected="true"]',
			{
				text: 'Afrikaans',
			}
		);

		await expect( page ).toMatchElement(
			'.preferred-languages button.locales-move-up[disabled]'
		);
	} );
} );
