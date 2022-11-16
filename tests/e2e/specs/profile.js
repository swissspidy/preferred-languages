import { visitAdminPage } from '@wordpress/e2e-test-utils';

describe( 'User Profile', () => {
	it( 'should display the preferred languages form', async () => {
		await visitAdminPage( 'profile.php' );

		await expect( page ).toMatchElement( '.user-preferred-languages-wrap' );
		await expect( page ).toMatch(
			'Choose languages for displaying WordPress in, in order of preference.'
		);
		await expect( page ).toMatch( 'Falling back to Site Default.' );

		const inactiveLocale = await page.$eval(
			'.inactive-locales-list select',
			( el ) => el.value
		);

		// On the profile page, en_US is the first item in the dropdown by default, which has an empty value.
		expect( inactiveLocale ).toStrictEqual( '' );
	} );
} );
