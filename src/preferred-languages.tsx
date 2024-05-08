import { render } from '@wordpress/element';
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

	// If there are no installed languages and no available translations.
	if ( ! props.allLanguages.length ) {
		// Settings -> General.
		document.querySelector( '.site-preferred-languages-wrap' ).remove();

		// Network Settings.
		document.querySelector( '.network-preferred-languages-wrap' ).remove();

		return;
	}

	const root = document.querySelector( '#preferred-languages-root' );

	// Replace original language settings with the Preferred Languages UI.

	// User Profile.
	document
		.querySelector( '.user-language-wrap' )
		?.replaceWith( root.parentElement.parentElement );

	// Settings -> General.
	document
		.querySelector( '.options-general-php #WPLANG' )
		?.parentElement?.parentElement?.replaceWith(
			root.parentElement.parentElement
		);

	// Network Settings.
	document
		.querySelector( '.network-admin.settings-php #WPLANG' )
		?.parentElement?.parentElement?.replaceWith(
			root.parentElement.parentElement
		);

	render( <PreferredLanguages { ...props } />, root );
} );
