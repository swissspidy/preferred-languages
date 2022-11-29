import { useEffect, useState } from '@wordpress/element';
import { useDispatch, useSelect } from '@wordpress/data';
import { __, _x } from '@wordpress/i18n';
import { Notice } from '@wordpress/components';
import {
	ShortcutProvider,
	store as keyboardShortcutsStore,
} from '@wordpress/keyboard-shortcuts';

import ActiveLocales from './ActiveLocales';
import InactiveLocales from './InactiveLocales';
import { Language } from '../types';

function MissingTranslationsNotice() {
	return (
		<Notice status="warning" isDismissible={ false }>
			{ __(
				'Some of the languages are not installed. Re-save changes to download translations.',
				'preferred-languages'
			) }
		</Notice>
	);
}

interface HiddenFormFieldProps {
	preferredLanguages: Language[];
}

function HiddenFormField( { preferredLanguages }: HiddenFormFieldProps ) {
	const value = preferredLanguages
		.filter( ( language ) => Boolean( language ) )
		.map( ( { locale } ) => locale )
		.join( ',' );

	return <input type="hidden" name="preferred_languages" value={ value } />;
}

interface PreferredLanguagesProps {
	allLanguages: Language[];
	preferredLanguages: Language[];
	hasMissingTranslations?: boolean;
	showOptionSiteDefault?: boolean;
}

function PreferredLanguages( props: PreferredLanguagesProps ) {
	const {
		allLanguages,
		hasMissingTranslations = false,
		showOptionSiteDefault = false,
	} = props;

	const { registerShortcut } = useDispatch( keyboardShortcutsStore );
	useEffect( () => {
		registerShortcut( {
			name: 'preferred-languages/move-up',
			category: 'global',
			description: __( 'Move language up', 'preferred-languages' ),
			keyCombination: {
				character: 'ArrowUp',
			},
		} );

		registerShortcut( {
			name: 'preferred-languages/move-down',
			category: 'global',
			description: __( 'Move language down', 'preferred-languages' ),
			keyCombination: {
				character: 'ArrowDown',
			},
		} );

		registerShortcut( {
			name: 'preferred-languages/select-first',
			category: 'global',
			description: __( 'Select first language', 'preferred-languages' ),
			keyCombination: {
				character: 'Home',
			},
		} );

		registerShortcut( {
			name: 'preferred-languages/select-last',
			category: 'global',
			description: __( 'Select last language', 'preferred-languages' ),
			keyCombination: {
				character: 'End',
			},
		} );

		registerShortcut( {
			name: 'preferred-languages/remove',
			category: 'global',
			description: __( 'Remove from list', 'preferred-languages' ),
			keyCombination: {
				character: 'Backspace',
			},
		} );

		registerShortcut( {
			name: 'preferred-languages/add',
			category: 'global',
			description: _x( 'Add to list', 'language', 'preferred-languages' ),
			keyCombination: {
				modifier: 'alt',
				character: 'a',
			},
		} );
	} );

	const [ preferredLanguages, setPreferredLanguages ] = useState<
		Language[]
	>( props.preferredLanguages );

	const [ selectedLanguage, setSelectedLanguage ] = useState< Language >(
		props.preferredLanguages[ 0 ]
	);

	const inactiveLocales = allLanguages.filter(
		( language ) =>
			! preferredLanguages.find(
				( { locale } ) => locale === language.locale
			)
	);

	const hasUninstalledPreferredLanguages = preferredLanguages.some(
		( { installed } ) => ! installed
	);

	useEffect( () => {
		if ( ! hasUninstalledPreferredLanguages ) {
			return;
		}

		const addSpinner = () => {
			const spinner = document.createElement( 'span' );
			spinner.className = 'spinner language-install-spinner is-active';

			const submit = document.querySelector( '#submit' );

			if ( ! submit ) {
				return;
			}

			submit.after( spinner );
		};

		const form = document.querySelector( 'form' );

		if ( ! form ) {
			return;
		}

		form.addEventListener( 'submit', addSpinner );

		return () => {
			form.removeEventListener( 'submit', addSpinner );
		};
	}, [ hasUninstalledPreferredLanguages ] );

	const onAddLanguage = ( locale ) => {
		setPreferredLanguages( ( current ) => [ ...current, locale ] );
		setSelectedLanguage( locale );
	};

	return (
		<ShortcutProvider>
			<div className="preferred-languages">
				<HiddenFormField preferredLanguages={ preferredLanguages } />
				<p>
					{ __(
						'Choose languages for displaying WordPress in, in order of preference.',
						'preferred-languages'
					) }
				</p>
				<ActiveLocales
					languages={ preferredLanguages }
					setLanguages={ setPreferredLanguages }
					showOptionSiteDefault={ showOptionSiteDefault }
					selectedLanguage={ selectedLanguage }
					setSelectedLanguage={ setSelectedLanguage }
				/>
				<InactiveLocales
					languages={ inactiveLocales }
					onAddLanguage={ onAddLanguage }
				/>
				{ hasMissingTranslations && <MissingTranslationsNotice /> }
			</div>
		</ShortcutProvider>
	);
}

export default PreferredLanguages;
