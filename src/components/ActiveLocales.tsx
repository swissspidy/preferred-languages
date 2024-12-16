import { useLayoutEffect, useRef } from '@wordpress/element';
import { Button } from '@wordpress/components';
import { __, sprintf } from '@wordpress/i18n';
import { speak } from '@wordpress/a11y';
import { useShortcut } from '@wordpress/keyboard-shortcuts';

import { reorder } from '../utils';
import type { Language } from '../types';

interface ActiveLocalesProps {
	languages: Language[];
	selectedLanguage?: Language;
	showOptionSiteDefault?: boolean;
	setLanguages: ( cb: ( languages: Language[] ) => Language[] ) => void;
	setSelectedLanguage: ( language: Language ) => void;
}

export function ActiveLocales( {
	languages,
	setLanguages,
	showOptionSiteDefault = false,
	selectedLanguage,
	setSelectedLanguage,
}: ActiveLocalesProps ) {
	const listRef = useRef< HTMLUListElement >();

	const isEmpty = languages.length === 0;

	useLayoutEffect( () => {
		const selectedEl = listRef.current.querySelector(
			'[aria-selected="true"]'
		);

		if ( ! selectedEl ) {
			return;
		}

		selectedEl.scrollIntoView( {
			behavior: 'smooth',
			block: 'nearest',
		} );
	}, [ selectedLanguage, languages ] );

	useShortcut( 'preferred-languages/select-first', ( event ) => {
		event.preventDefault();

		if ( isEmpty ) {
			return;
		}

		setSelectedLanguage( languages.at( 0 ) );
	} );

	useShortcut( 'preferred-languages/select-last', ( event ) => {
		event.preventDefault();

		if ( isEmpty ) {
			return;
		}

		setSelectedLanguage( languages.at( -1 ) );
	} );

	useShortcut( 'preferred-languages/select-previous', ( event ) => {
		event.preventDefault();

		if ( isEmpty ) {
			return;
		}

		const foundIndex = languages.findIndex(
			( { locale } ) => locale === selectedLanguage.locale
		);

		if ( languages[ foundIndex - 1 ] ) {
			setSelectedLanguage( languages[ foundIndex - 1 ] );
		}
	} );

	useShortcut( 'preferred-languages/select-next', ( event ) => {
		event.preventDefault();

		if ( isEmpty ) {
			return;
		}

		const foundIndex = languages.findIndex(
			( { locale } ) => locale === selectedLanguage.locale
		);

		if ( languages[ foundIndex + 1 ] ) {
			setSelectedLanguage( languages[ foundIndex + 1 ] );
		}
	} );

	const onRemove = () => {
		const foundIndex = languages.findIndex(
			( { locale } ) => locale === selectedLanguage.locale
		);

		setSelectedLanguage(
			languages[ foundIndex + 1 ] || languages[ foundIndex - 1 ]
		);

		setLanguages( ( prevLanguages ) =>
			prevLanguages.filter(
				( { locale } ) => locale !== selectedLanguage.locale
			)
		);

		speak( __( 'Locale removed from list', 'preferred-languages' ) );

		if ( languages.length === 1 ) {
			let emptyMessageA11y = sprintf(
				/* translators: %s: English (United States) */
				__(
					'No languages selected. Falling back to %s.',
					'preferred-languages'
				),
				'English (United States)'
			);

			if ( showOptionSiteDefault ) {
				emptyMessageA11y = __(
					'No languages selected. Falling back to Site Default.',
					'preferred-languages'
				);
			}

			speak( emptyMessageA11y );
		}
	};

	const onMoveUp = () => {
		setLanguages( ( prevLanguages ) => {
			const srcIndex = prevLanguages.findIndex(
				( { locale } ) => locale === selectedLanguage.locale
			);
			return reorder(
				Array.from( prevLanguages ),
				srcIndex,
				srcIndex - 1
			);
		} );

		speak( __( 'Locale moved up', 'preferred-languages' ) );
	};

	const onMoveDown = () => {
		setLanguages( ( prevLanguages ) => {
			const srcIndex = prevLanguages.findIndex(
				( { locale } ) => locale === selectedLanguage.locale
			);
			return reorder< Language[] >(
				Array.from( prevLanguages ),
				srcIndex,
				srcIndex + 1
			);
		} );

		speak( __( 'Locale moved down', 'preferred-languages' ) );
	};

	const activeDescendant = isEmpty ? '' : selectedLanguage.locale;

	const className = isEmpty
		? 'active-locales-list empty-list'
		: 'active-locales-list';

	let emptyMessage = sprintf(
		/* translators: %s: English (United States) */
		__( 'Falling back to %s.', 'preferred-languages' ),
		'English (United States)'
	);

	if ( showOptionSiteDefault ) {
		emptyMessage = __(
			'Falling back to Site Default.',
			'preferred-languages'
		);
	}

	return (
		<div className="active-locales wp-clearfix">
			{ isEmpty && (
				<div className="active-locales-empty-message">
					{ __( 'Nothing set.', 'preferred-languages' ) }
					<br />
					{ emptyMessage }
				</div>
			) }
			<ul
				role="listbox"
				aria-labelledby="preferred-languages-label"
				tabIndex={ 0 }
				aria-activedescendant={ activeDescendant }
				className={ className }
				ref={ listRef }
			>
				{ languages.map( ( language ) => {
					const { locale, nativeName, lang } = language;
					return (
						// eslint-disable-next-line jsx-a11y/click-events-have-key-events
						<li
							key={ locale }
							role="option"
							aria-selected={
								locale === selectedLanguage?.locale
							}
							id={ locale }
							lang={ lang }
							className="active-locale"
							onClick={ () => setSelectedLanguage( language ) }
						>
							{ nativeName }
						</li>
					);
				} ) }
			</ul>
			<ActiveControls
				languages={ languages }
				selectedLanguage={ selectedLanguage }
				onMoveUp={ onMoveUp }
				onMoveDown={ onMoveDown }
				onRemove={ onRemove }
			/>
		</div>
	);
}

function ActiveControls( {
	languages,
	selectedLanguage,
	onMoveUp,
	onMoveDown,
	onRemove,
} ) {
	const isMoveUpDisabled =
		! selectedLanguage ||
		languages[ 0 ]?.locale === selectedLanguage?.locale;
	const isMoveDownDisabled =
		! selectedLanguage ||
		languages[ languages.length - 1 ]?.locale === selectedLanguage?.locale;
	const isRemoveDisabled = ! selectedLanguage;

	useShortcut( 'preferred-languages/move-up', ( event ) => {
		event.preventDefault();

		if ( isMoveUpDisabled ) {
			return;
		}

		onMoveUp();
	} );

	useShortcut( 'preferred-languages/move-down', ( event ) => {
		event.preventDefault();

		if ( isMoveDownDisabled ) {
			return;
		}

		onMoveDown();
	} );

	useShortcut( 'preferred-languages/remove', ( event ) => {
		event.preventDefault();

		if ( isRemoveDisabled ) {
			return;
		}

		onRemove();
	} );

	return (
		<div className="active-locales-controls">
			<ul>
				<li>
					<Button
						variant="secondary"
						showTooltip
						aria-keyshortcuts="Alt+ArrowUp"
						aria-label={ sprintf(
							/* translators: accessibility text */
							__( 'Move up (%s)', 'preferred-languages' ),
							/* translators: keyboard shortcut (Arrow Up) */
							__( 'Up', 'preferred-languages' )
						) }
						label={
							/* translators: keyboard shortcut (Arrow Up) */
							__( 'Up', 'preferred-languages' )
						}
						disabled={ isMoveUpDisabled }
						onClick={ onMoveUp }
					>
						{ __( 'Move Up', 'preferred-languages' ) }
					</Button>
				</li>
				<li>
					<Button
						variant="secondary"
						showTooltip
						aria-keyshortcuts="Alt+ArrowDown"
						aria-label={ sprintf(
							/* translators: accessibility text */
							__( 'Move down (%s)', 'preferred-languages' ),
							/* translators: keyboard shortcut (Arrow Down) */
							__( 'Down', 'preferred-languages' )
						) }
						label={
							/* translators: keyboard shortcut (Arrow Down) */
							__( 'Down', 'preferred-languages' )
						}
						disabled={ isMoveDownDisabled }
						onClick={ onMoveDown }
					>
						{ __( 'Move Down', 'preferred-languages' ) }
					</Button>
				</li>
				<li>
					<Button
						variant="secondary"
						showTooltip
						aria-keyshortcuts="Delete"
						aria-label={ sprintf(
							/* translators: accessibility text */
							__(
								'Remove from list (%s)',
								'preferred-languages'
							),
							/* translators: keyboard shortcut (Delete / Backspace) */
							__( 'Delete', 'preferred-languages' )
						) }
						label={
							/* translators: keyboard shortcut (Delete / Backspace) */
							__( 'Delete', 'preferred-languages' )
						}
						disabled={ isRemoveDisabled }
						onClick={ onRemove }
					>
						{ __( 'Remove', 'preferred-languages' ) }
					</Button>
				</li>
			</ul>
		</div>
	);
}

export default ActiveLocales;
