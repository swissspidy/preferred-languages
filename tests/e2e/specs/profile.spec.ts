import { test, expect } from '@wordpress/e2e-test-utils-playwright';

test.describe( 'User Profile', () => {
	test( 'should display the preferred languages form', async ( {
		admin,
		page,
	} ) => {
		await admin.visitAdminPage( 'profile.php' );

		const activeLocales = page.getByRole( 'listbox', {
			name: 'Language',
		} );

		const localesDropdown = page.getByRole( 'combobox', {
			name: 'Inactive Locales',
		} );

		const addButton = page.getByRole( 'button', {
			name: /Add to list/,
		} );

		const introText = page.getByText(
			'Choose languages for displaying WordPress in, in order of preference.'
		);

		const fallbackText = page.getByText( 'Falling back to Site Default.' );

		await expect( activeLocales ).toBeVisible();
		await expect( localesDropdown ).toBeVisible();
		await expect( addButton ).toBeVisible();
		await expect( introText ).toBeVisible();
		await expect( fallbackText ).toBeVisible();

		// On the profile page, en_US is the first item in the dropdown by default.
		await expect( localesDropdown ).toHaveValue( 'en_US' );
	} );
} );
