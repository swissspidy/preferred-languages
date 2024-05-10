import { test, expect } from '@wordpress/e2e-test-utils-playwright';

test.describe( 'Translation Loading', () => {
	test.beforeEach( async ( { admin, requestUtils, page } ) => {
		await admin.visitAdminPage( 'options-general.php' );

		const addButton = page.getByRole( 'button', {
			name: /Add to list/,
		} );

		const localesDropdown = page.getByRole( 'combobox', {
			name: 'Inactive Locales',
		} );

		await localesDropdown.selectOption( 'fr_FR' );
		await addButton.click();

		await localesDropdown.selectOption( 'it_IT' );
		await addButton.click();

		await localesDropdown.selectOption( 'de_CH' );
		await addButton.click();

		await localesDropdown.selectOption( 'de_DE' );
		await addButton.click();

		await localesDropdown.selectOption( 'es_ES' );
		await addButton.click();

		await page.getByRole( 'button', { name: 'Save Changes' } ).click();

		await requestUtils.activatePlugin( 'custom-internationalized-plugin' );
		await requestUtils.activatePlugin( 'no-merge-translations' );
		await requestUtils.deactivatePlugin( 'merge-translations' );
	} );

	test.afterEach( async ( { requestUtils } ) => {
		await requestUtils.updateSiteSettings( {
			// @ts-ignore
			preferred_languages: '',
		} );

		await requestUtils.deactivatePlugin(
			'custom-internationalized-plugin'
		);
		await requestUtils.deactivatePlugin( 'no-merge-translations' );
	} );

	test( 'should correctly translate strings', async ( {
		admin,
		page,
		requestUtils,
	} ) => {
		// Just to ensure the setup in beforeAll() has worked.
		const installedLocales =
			// @ts-ignore
			( await requestUtils.getSiteSettings() ).preferred_languages;

		await expect( installedLocales ).toStrictEqual(
			'fr_FR,it_IT,de_CH,de_DE,es_ES'
		);

		await admin.visitAdminPage( 'index.php' );

		const defaultOutput = await page
			.getByTestId( 'notice-custom-i18n-plugin-locale-current' )
			.textContent();
		expect( defaultOutput ).toMatchSnapshot( 'Default' );

		const localeSwitching = await page
			.getByTestId( 'notice-custom-i18n-plugin-locale-switching' )
			.textContent();
		expect( localeSwitching ).toMatchSnapshot( 'Locale Switching' );

		const jsI18n = await page
			.getByTestId( 'notice-custom-i18n-plugin-js' )
			.textContent();
		expect( jsI18n ).toMatchSnapshot( 'JS Translations' );
	} );

	test.describe( 'Merging Translations', () => {
		test.beforeEach( async ( { requestUtils } ) => {
			await requestUtils.deactivatePlugin( 'no-merge-translations' );
			await requestUtils.activatePlugin( 'merge-translations' );
		} );

		test.afterEach( async ( { requestUtils } ) => {
			await requestUtils.activatePlugin( 'no-merge-translations' );
			await requestUtils.deactivatePlugin( 'merge-translations' );
		} );

		test( 'should correctly translate strings', async ( {
			admin,
			page,
		} ) => {
			await admin.visitAdminPage( 'index.php' );

			const defaultOutput = await page
				.getByTestId( 'notice-custom-i18n-plugin-locale-current' )
				.textContent();
			expect( defaultOutput ).toMatchSnapshot( 'Default - Merging' );

			const localeSwitching = await page
				.getByTestId( 'notice-custom-i18n-plugin-locale-switching' )
				.textContent();
			expect( localeSwitching ).toMatchSnapshot(
				'Locale Switching - Merging'
			);

			const jsI18n = await page
				.getByTestId( 'notice-custom-i18n-plugin-js' )
				.textContent();
			expect( jsI18n ).toMatchSnapshot( 'JS Translations - Merging' );
		} );
	} );
} );
