import { Button, SelectControl } from '@wordpress/components';
import { __, _x, sprintf } from '@wordpress/i18n';
import { useEffect, useState } from '@wordpress/element';
import { speak } from '@wordpress/a11y';
import { useShortcut } from '@wordpress/keyboard-shortcuts';
import { shortcutAriaLabel, displayShortcut } from '@wordpress/keycodes';

import type { Language, Locale } from '../types';

interface InactiveLocalesProps {
	languages: Language[];
	onAddLanguage: ( language: Language ) => void;
}

function InactiveLocales( { languages, onAddLanguage }: InactiveLocalesProps ) {
	const [ selectedInactiveLanguage, setSelectedInactiveLanguage ] = useState(
		languages[ 0 ]
	);

	useEffect( () => {
		if ( ! selectedInactiveLanguage ) {
			setSelectedInactiveLanguage( languages[ 0 ] );
		}
	}, [ selectedInactiveLanguage, languages ] );

	const installedLanguages = languages.filter( ( { installed } ) =>
		Boolean( installed )
	);
	const availableLanguages = languages.filter(
		( { installed } ) => ! installed
	);

	const onChange = ( locale: string ) => {
		setSelectedInactiveLanguage(
			languages.find( ( language ) => locale === language.locale )
		);
	};

	const onClick = () => {
		onAddLanguage( selectedInactiveLanguage );

		const installedIndex = installedLanguages.findIndex(
			( { locale } ) => locale === selectedInactiveLanguage.locale
		);

		const availableIndex = availableLanguages.findIndex(
			( { locale } ) => locale === selectedInactiveLanguage.locale
		);

		let newSelected: Language | undefined;

		newSelected = installedLanguages[ installedIndex + 1 ];

		if (
			! newSelected &&
			installedLanguages[ 0 ] !== selectedInactiveLanguage
		) {
			newSelected = installedLanguages[ 0 ];
		}

		if ( ! newSelected ) {
			newSelected = availableLanguages[ availableIndex + 1 ];

			if ( availableLanguages[ 0 ] !== selectedInactiveLanguage ) {
				newSelected = availableLanguages[ 0 ];
			}
		}

		setSelectedInactiveLanguage( newSelected );

		speak( __( 'Locale added to list', 'preferred-languages' ) );
	};

	return (
		<div className="inactive-locales wp-clearfix">
			<div className="inactive-locales-list">
				<InactiveLocalesSelect
					installedLanguages={ installedLanguages }
					availableLanguages={ availableLanguages }
					value={ selectedInactiveLanguage?.locale }
					onChange={ onChange }
				/>
			</div>
			<InactiveControls
				onClick={ onClick }
				disabled={ ! selectedInactiveLanguage }
			/>
		</div>
	);
}

interface InactiveLocalesSelectProps {
	installedLanguages: Language[];
	availableLanguages: Language[];
	value: Locale;
	onChange: ( string ) => void;
}

function InactiveLocalesSelect( {
	installedLanguages,
	availableLanguages,
	value,
	onChange,
}: InactiveLocalesSelectProps ) {
	const hasItems = installedLanguages.length || availableLanguages.length;

	return (
		<SelectControl
			aria-label={ __( 'Inactive Locales', 'preferred-languages' ) }
			label={ __( 'Inactive Locales', 'preferred-languages' ) }
			hideLabelFromVision
			value={ value }
			onChange={ onChange }
			disabled={ ! hasItems }
			__nextHasNoMarginBottom
			__next40pxDefaultSize
		>
			{ installedLanguages.length > 0 && (
				<optgroup
					label={ _x(
						'Installed',
						'translations',
						'preferred-languages'
					) }
				>
					{ installedLanguages.map(
						( { locale, lang, nativeName } ) => (
							<option
								key={ locale }
								value={ locale }
								lang={ lang }
							>
								{ nativeName }
							</option>
						)
					) }
				</optgroup>
			) }
			{ availableLanguages.length > 0 && (
				<optgroup
					label={ _x(
						'Available',
						'translations',
						'preferred-languages'
					) }
				>
					{ availableLanguages.map(
						( { locale, lang, nativeName } ) => (
							<option
								key={ locale }
								value={ locale }
								lang={ lang }
							>
								{ nativeName }
							</option>
						)
					) }
				</optgroup>
			) }
		</SelectControl>
	);
}

interface InactiveControlsProps {
	disabled: boolean;
	onClick: () => void;
}

function InactiveControls( { disabled, onClick }: InactiveControlsProps ) {
	useShortcut( 'preferred-languages/add', ( event ) => {
		event.preventDefault();

		if ( disabled ) {
			return;
		}

		onClick();
	} );

	return (
		<div className="inactive-locales-controls">
			<Button
				variant="secondary"
				showTooltip
				aria-keyshortcuts="Alt+A"
				aria-label={ sprintf(
					/* translators: accessibility text. %s: keyboard shortcut. */
					_x( 'Add to list (%s)', 'language', 'preferred-languages' ),
					shortcutAriaLabel.alt( 'A' )
				) }
				label={ displayShortcut.alt( 'A' ) }
				disabled={ disabled }
				onClick={ onClick }
			>
				{ _x( 'Add', 'language', 'preferred-languages' ) }
			</Button>
		</div>
	);
}

export default InactiveLocales;
