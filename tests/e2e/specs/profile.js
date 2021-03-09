import { visitAdminPage } from '@wordpress/e2e-test-utils';

describe( 'User Profile', () => {
	it( 'should display the preferred languages form', async () => {
		await visitAdminPage( 'profile.php' );
		await expect( page ).toMatchElement( '.user-preferred-languages-wrap' );
	} );
} );
