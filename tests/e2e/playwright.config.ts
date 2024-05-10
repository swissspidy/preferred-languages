import { defineConfig, devices } from '@playwright/test';

import baseConfig from '@wordpress/scripts/config/playwright.config';

const config = defineConfig( {
	...baseConfig,
	projects: [
		{
			name: 'chromium',
			use: {
				...devices[ 'Desktop Chrome' ],
			},
		},
		{
			name: 'webkit',
			use: { ...devices[ 'Desktop Safari' ] },
		},
		{
			name: 'firefox',
			use: {
				...devices[ 'Desktop Firefox' ],
			},
		},
	],
} );

export default config;
