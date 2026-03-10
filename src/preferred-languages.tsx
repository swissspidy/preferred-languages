import { createRoot, StrictMode } from '@wordpress/element';
import domReady from '@wordpress/dom-ready';

import './preferred-languages.css';

import PreferredLanguages from './components/PreferredLanguages';
import type { PreferredLanguagesConfig } from './types';

declare global {
	interface Window {
		PreferredLanguages: PreferredLanguagesConfig;
	}
}

domReady( () => {
	const props = window.PreferredLanguages;

	const container = document.querySelector( '#preferred-languages-root' );

	// Replace original language settings with the Preferred Languages UI.

	// User Profile.
	document
		.querySelector( '.user-language-wrap' )
		?.replaceWith( container.parentElement.parentElement );

	// Settings -> General.
	document
		.querySelector( '.options-general-php #WPLANG' )
		?.parentElement?.parentElement?.replaceWith(
			container.parentElement.parentElement
		);

	// Network Settings.
	document
		.querySelector( '.network-admin.settings-php #WPLANG' )
		?.parentElement?.parentElement?.replaceWith(
			container.parentElement.parentElement
		);

	const root = createRoot( container );

	root.render(
		<StrictMode>
			<PreferredLanguages { ...props } />
		</StrictMode>
	);
} );
