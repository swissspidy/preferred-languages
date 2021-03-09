import { visitAdminPage } from '@wordpress/e2e-test-utils';

describe( 'Settings Page', () => {
	it('should display the preferred languages form', async () => {
		await visitAdminPage( 'options-general.php' );
		await expect(page).toMatchElement('.site-preferred-languages-wrap');
	});
});
