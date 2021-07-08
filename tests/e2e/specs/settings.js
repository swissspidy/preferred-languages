import { visitAdminPage } from '@wordpress/e2e-test-utils';

describe( 'Settings Page', () => {
	it( 'should display the preferred languages form', async () => {
		await visitAdminPage( 'options-general.php' );

		await expect( page ).toMatch( 'General Settings' );
		await expect( page ).toMatchElement( '.site-preferred-languages-wrap' );
		await expect( page ).toMatch(
			'Choose languages for displaying WordPress in, in order of preference.'
		);
		await expect( page ).toMatch(
			'Falling back to English (United States).'
		);
	} );

	it( 'should disable form buttons initially', async () => {
		await visitAdminPage( 'options-general.php' );

		await expect( page ).toMatchElement( '.site-preferred-languages-wrap' );

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
	} );

	it( 'should add a language to the list', async () => {
		await visitAdminPage( 'options-general.php' );

		await expect( page ).toMatchElement( '.site-preferred-languages-wrap' );

		await expect( page ).toClick(
			'.preferred-languages button.locales-add'
		);

		await expect( page ).toMatchElement( '.active-locale', {
			text: /Afrikaans/i,
		} );

		await expect( page ).not.toMatch(
			'Falling back to English (United States).'
		);

		await expect( page ).toMatchElement(
			'.preferred-languages button.locales-move-up[disabled]'
		);
		await expect( page ).toMatchElement(
			'.preferred-languages button.locales-move-down[disabled]'
		);
		await expect( page ).toMatchElement(
			'.preferred-languages button.locales-remove:not([disabled])'
		);
	} );

	it( 'should allow navigation using keyboard', async () => {
		await visitAdminPage( 'options-general.php' );

		await expect( page ).toMatchElement( '.site-preferred-languages-wrap' );

		await expect( page ).toClick(
			'.preferred-languages button.locales-add'
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
			'.preferred-languages button.locales-move-up[disabled]'
		);

		await expect( page ).toMatchElement(
			'.active-locale[aria-selected="true"]',
			{
				text: 'Afrikaans',
			}
		);
	} );
} );
