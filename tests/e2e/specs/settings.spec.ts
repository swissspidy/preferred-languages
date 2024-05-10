import { test, expect } from '@wordpress/e2e-test-utils-playwright';

test.describe( 'Settings Page', () => {
	test( 'should display the preferred languages form', async ( {
		admin,
		page,
	} ) => {
		await admin.visitAdminPage( 'options-general.php' );

		await expect( page.locator( '#WPLANG' ) ).toBeHidden();

		const introText = page.getByText(
			'Choose languages for displaying WordPress in, in order of preference.'
		);
		const fallbackText = page.getByText(
			'Falling back to English (United States).'
		);

		await expect( introText ).toBeVisible();
		await expect( fallbackText ).toBeVisible();

		await expect(
			page.locator( 'input[name="preferred_languages"]' )
		).toHaveValue( '' );

		await expect(
			page.getByRole( 'button', { name: /Move up/ } )
		).toBeDisabled();
		await expect(
			page.getByRole( 'button', { name: /Move down/ } )
		).toBeDisabled();
		await expect(
			page.getByRole( 'button', { name: /Remove from list/ } )
		).toBeDisabled();
		await expect(
			page.getByRole( 'button', { name: /Add to list/ } )
		).toBeEnabled();
	} );

	test( 'should add a language to the list', async ( { admin, page } ) => {
		await admin.visitAdminPage( 'options-general.php' );

		const addButton = page.getByRole( 'button', {
			name: /Add to list/,
		} );

		const activeLocales = page.getByRole( 'listbox', {
			name: 'Language',
		} );

		const localesDropdown = page.getByRole( 'combobox', {
			name: 'Inactive Locales',
		} );

		const newLocale = await localesDropdown.inputValue();

		await addButton.click();

		await expect(
			page.locator( 'input[name="preferred_languages"]' )
		).toHaveValue( newLocale );

		await expect(
			activeLocales.getByRole( 'option', {
				selected: true,
			} )
		).toHaveAttribute( 'id', newLocale );

		await expect(
			page.getByRole( 'button', { name: /Move up/ } )
		).toBeDisabled();
		await expect(
			page.getByRole( 'button', { name: /Move down/ } )
		).toBeDisabled();
		await expect(
			page.getByRole( 'button', { name: /Remove from list/ } )
		).toBeEnabled();
	} );

	test( 'should allow navigation using keyboard', async ( {
		admin,
		page,
	} ) => {
		await admin.visitAdminPage( 'options-general.php' );

		const addButton = page.getByRole( 'button', {
			name: /Add to list/,
		} );

		const activeLocales = page.getByRole( 'listbox', {
			name: 'Language',
		} );

		const localesDropdown = page.getByRole( 'combobox', {
			name: 'Inactive Locales',
		} );

		const selectedLocales = [];

		selectedLocales.push( await localesDropdown.inputValue() );

		await addButton.click();

		selectedLocales.push( await localesDropdown.inputValue() );
		await addButton.click();

		selectedLocales.push( await localesDropdown.inputValue() );
		await addButton.click();

		selectedLocales.push( await localesDropdown.inputValue() );
		await addButton.click();

		await expect(
			page.locator( 'input[name="preferred_languages"]' )
		).toHaveValue( selectedLocales.join( ',' ) );

		await expect(
			activeLocales.getByRole( 'option', {
				selected: true,
			} )
		).toHaveAttribute( 'id', selectedLocales[ 3 ] );

		await expect(
			page.getByRole( 'button', { name: /Move up/ } )
		).toBeEnabled();
		await expect(
			page.getByRole( 'button', { name: /Move down/ } )
		).toBeDisabled();
		await expect(
			page.getByRole( 'button', { name: /Remove from list/ } )
		).toBeEnabled();

		// After moving one position up, none of the buttons should be disabled anymore.
		await page.keyboard.press( 'ArrowUp' );

		await expect(
			page.getByRole( 'button', { name: /Move up/ } )
		).toBeEnabled();
		await expect(
			page.getByRole( 'button', { name: /Move down/ } )
		).toBeEnabled();
		await expect(
			page.getByRole( 'button', { name: /Remove from list/ } )
		).toBeEnabled();

		// After moving two up again, the "Move Up" button should be disabled because we reached the top.
		await page.keyboard.press( 'ArrowUp' );
		await page.keyboard.press( 'ArrowUp' );

		await expect(
			page.getByRole( 'button', { name: /Move up/ } )
		).toBeDisabled();
		await expect(
			page.getByRole( 'button', { name: /Move down/ } )
		).toBeEnabled();
		await expect(
			page.getByRole( 'button', { name: /Remove from list/ } )
		).toBeEnabled();

		await expect(
			activeLocales.getByRole( 'option', {
				selected: true,
			} )
		).toHaveAttribute( 'id', selectedLocales[ 3 ] );

		await expect(
			page.locator( 'input[name="preferred_languages"]' )
		).toHaveValue( 'fr_FR,de_CH,de_DE,es_ES' );
	} );
} );
