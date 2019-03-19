( ( ( wp, settings, $ ) => {
	const $document = $( document );
	const $activeLocales = $( '.active-locales-list' );
	const $activeLocalesControls = $( '.active-locales-controls' );
	const $emptyMessage = $( '#active-locales-empty-message' );
	const $inactiveLocalesWrap = $( '.inactive-locales-list' );
	const $inactiveLocales = $inactiveLocalesWrap.find( 'select' );
	const $inactiveLocalesControls = $( '.inactive-locales-controls' );
	const $inputField = $( 'input[name="preferred_languages"]' );
	let $selectedLocale = $activeLocales.find( 'li[aria-selected="true"]' );

	const KEY_UP = 38;
	const KEY_DOWN = 40;
	const KEY_BACKSPACE = 8;
	const KEY_A = 65;

	/**
	 * Changes the move button states.
	 *
	 * @since 1.0.0
	 *
	 * @param {jQuery} activeLocale Active locale element.
	 */
	function changeButtonState( activeLocale ) {
		const activeLocalesList = $activeLocales.find( '.active-locale' );

		$activeLocalesControls.find( '.locales-move-up' ).attr(
			'disabled',
			$activeLocales.hasClass( 'empty-list' ) || activeLocalesList.first().is( activeLocale )
		);
		$activeLocalesControls.find( '.locales-move-down' ).attr(
			'disabled',
			$activeLocales.hasClass( 'empty-list' ) || activeLocalesList.last().is( activeLocale )
		);
		$activeLocalesControls.find( '.locales-remove' ).attr(
			'disabled',
			$activeLocales.hasClass( 'empty-list' )
		);
		$inactiveLocalesControls.find( '.locales-add' ).attr(
			'disabled',
			'disabled' === $inactiveLocales.attr( 'disabled' )
		);
	}

	/**
	 * Toggles a locale.
	 *
	 * @since 1.0.0
	 *
	 * @param {jQuery} $locale Locale element.
	 */
	function toggleLocale( $locale ) {
		const selected = $locale.attr( 'aria-selected' );
		const newState = 'true' !== selected;

		// It's already the current locale, so nothing to do here.
		if ( 'true' === selected ) {
			return;
		}

		$selectedLocale.attr( 'aria-selected', false );

		$locale.attr( 'aria-selected', newState );

		if ( true === newState ) {
			$selectedLocale = $locale;

			$activeLocales.attr( 'aria-activedescendant', $selectedLocale.attr( 'id' ) );
		}

		changeButtonState( $locale );
	}

	/**
	 * Updates the preferred languages input field after a change.
	 *
	 * @since 1.0.0
	 */
	function updateHiddenInput() {
		const locales = [];

		$activeLocales.children( '.active-locale' ).each( ( index, el ) => {
			locales.push( $( el ).attr( 'id' ) );
		} );

		$inputField.val( locales.join( ',' ) );
	}

	/**
	 * Moves a locale up in the list.
	 *
	 * @since 1.0.0
	 */
	function moveLocaleUp() {
		// 1. Change position if possible.
		$selectedLocale.insertBefore( $selectedLocale.prev() );

		// 2. Update hidden input field.
		updateHiddenInput();

		// 3. Update buttons.
		changeButtonState( $selectedLocale );

		// 4. Announce to assistive technologies.
		wp.a11y.speak( settings.l10n.movedUp );
	}

	/**
	 * Moves a locale down in the list.
	 *
	 * @since 1.0.0
	 */
	function moveLocaleDown() {
		// 1. Change position if possible.
		$selectedLocale.insertAfter( $selectedLocale.next() );

		// 2. Update hidden input field.
		updateHiddenInput();

		// 3. Update buttons.
		changeButtonState( $selectedLocale );

		// 4. Announce to assistive technologies.
		wp.a11y.speak( settings.l10n.movedDown );
	}

	/**
	 * Displays a message in case the list of active locales is empty.
	 *
	 * @since 1.1.1
	 */
	function toggleEmptyListMessage() {
		if ( $activeLocales.hasClass( 'empty-list' ) ) {
			$activeLocales.removeClass( 'empty-list' );
			$emptyMessage.addClass( 'hidden' );
		} else {
			$activeLocales.addClass( 'empty-list' );
			$activeLocales.attr( 'aria-activedescendant', '' );
			$emptyMessage.removeClass( 'hidden' );

			wp.a11y.speak( $emptyMessage.data( 'a11y-message' ) );
		}
	}

	/**
	 * Removes an active locale from the list.
	 *
	 * @since 1.0.0
	 */
	function makeLocaleInactive() {
		const locale = $selectedLocale.attr( 'id' );
		let $successor;

		$successor = $selectedLocale.prevAll( ':first' );

		if ( 0 === $successor.length ) {
			$successor = $selectedLocale.nextAll( ':first' );
		}

		// 1. Remove selected locale.
		$selectedLocale.remove();

		// 2. Make another locale the current one.
		if ( $successor.length ) {
			toggleLocale( $successor );
		} else {
			toggleEmptyListMessage();
		}

		// 3. Make visible in dropdown again.
		$inactiveLocales.find( `option[value="${ locale }"]` ).removeClass( 'hidden' );
		$inactiveLocales.attr( 'disabled', false );

		// 4. Update hidden input field.
		updateHiddenInput();

		// 5. Update buttons.
		changeButtonState( $selectedLocale );

		// 6. Announce to assistive technologies.
		wp.a11y.speak( settings.l10n.localeRemoved );
	}

	/**
	 * Makes an inactive locale active.
	 *
	 * @since 1.0.0
	 *
	 * @param {jQuery} option The locale element.
	 */
	function makeLocaleActive( option ) {
		const locale = option.val() || 'en_US';
		let $successor;

		// 1. Hide from dropdown.
		option.removeAttr( 'selected' ).addClass( 'hidden' );

		$successor = option.prevAll( ':not(.hidden):first' );

		if ( ! $successor.length ) {
			$successor = option.nextAll( ':not(.hidden):first' );
		}

		// Empty optgroup, just select the first option we can find.
		if ( ! $successor.length ) {
			$successor = $inactiveLocales.find( 'option:not(.hidden):first' );
		}

		if ( ! $successor.length ) {
			$inactiveLocales.attr( 'disabled', true );
		}

		// 2. Change selected value in dropdown.
		$successor.attr( 'selected', true );
		$inactiveLocalesControls.val( $successor.val() );

		// It's already in the list of active locales, stop here.
		if ( $activeLocales.find( `#${ locale }` ).length ) {
			return;
		}

		// 3. Hide empty list message if present.
		if ( $activeLocales.hasClass( 'empty-list' ) ) {
			toggleEmptyListMessage();
		}

		const $newLocale = $( '<li/>', { text: option.text(), role: 'option', 'aria-selected': false, id: locale, class: 'active-locale' } );

		// 4. Add to list.
		$activeLocales.append( $newLocale );

		toggleLocale( $newLocale );

		// 5. Scroll into view.
		$activeLocales.animate( {
			scrollTop: $newLocale.offset().top - $activeLocales.offset().top + $activeLocales.scrollTop(),
		} );

		// 5. Update hidden input field.
		updateHiddenInput();

		// 6. Announce to assistive technologies.
		wp.a11y.speak( settings.l10n.localeAdded );
	}

	// Replace original language settings.
	$( '.user-language-wrap' ).replaceWith( $( '.user-preferred-languages-wrap' ) );
	$( '#WPLANG' ).parent().parent().replaceWith( $( '.site-preferred-languages-wrap' ) );

	// Remove en_US as an option from the dropdown.
	$inactiveLocalesWrap.filter( '[data-show-en_US="false"]' ).find( '[lang="en"][value=""]' ).remove();

	// Change initial button state.
	changeButtonState( $selectedLocale );

	// Initially hide already active locales from dropdown.
	if ( $inputField.val().length ) {
		$.each( $inputField.val().split( ',' ), ( index, value ) => {
			value = 'en_US' === value ? '' : value;

			const $option = $inactiveLocales.find( `[value="${ value }"]` );

			// 2. Hide from dropdown.
			$option.removeAttr( 'selected' ).addClass( 'hidden' );
		} );

		const $firstInactiveLocale = $inactiveLocales.find( 'option:not(.hidden):first' );

		$firstInactiveLocale.attr( 'selected', true );
		$inactiveLocalesControls.val( $firstInactiveLocale.val() );
	}

	// Disable controls if there are no more languages that could be added.
	if ( $inactiveLocales.find( ':not(.hidden)' ).length === 0 ) {
		$inactiveLocales.attr( 'disabled', true );
		$inactiveLocalesControls.find( '.locales-add' ).attr( 'disabled', true );
	}

	function onSortableUpdate() {
		updateHiddenInput();
		changeButtonState( $selectedLocale );
	}

	// Enabling sorting locales using drag and drop.
	$activeLocales.sortable( {
		axis: 'y',
		cursor: 'move',
		items: ':not(#active-locales-list-empty-message)',
		update: onSortableUpdate,
	} );

	// Active locales keyboard shortcuts.
	$document.on( 'keydown', ( e ) => {
		if ( ! document.querySelector( '.preferred-languages' ).contains( document.activeElement ) ) {
			return;
		}

		switch ( e.which ) {
			case KEY_UP:
				if ( e.altKey ) {
					moveLocaleUp();
				} else if ( $selectedLocale.prev().length ) {
					toggleLocale( $selectedLocale.prev() );
				} else {
					// We're at the top of the list.
					$activeLocales.focus();
				}

				e.preventDefault();
				break;

			case KEY_DOWN:
				if ( e.altKey ) {
					moveLocaleDown();
				} else if ( $selectedLocale.next().length ) {
					toggleLocale( $selectedLocale.next() );
				} else {
					// We're at the bottom of the list.
					$activeLocales.focus();
				}

				e.preventDefault();
				break;

			case KEY_A:
				if ( e.altKey ) {
					makeLocaleActive( $inactiveLocales.find( 'option:selected' ) );
				}

				e.preventDefault();
				break;

			case KEY_BACKSPACE:
				makeLocaleInactive();

				e.preventDefault();
				break;
		}
	} );

	// Add new locale to list.
	$inactiveLocalesControls.find( '.locales-add' ).on( 'click', () => {
		makeLocaleActive( $inactiveLocales.find( 'option:selected' ) );
	} );

	// Select a locale.
	$activeLocales.on( 'click', '.active-locale', ( e ) => {
		toggleLocale( $( e.currentTarget ) );
	} );

	$activeLocalesControls.find( '.locales-move-up' ).on( 'click', moveLocaleUp );

	$activeLocalesControls.find( '.locales-move-down' ).on( 'click', moveLocaleDown );

	// Remove locale from list.
	$activeLocalesControls.find( '.locales-remove' ).on( 'click', makeLocaleInactive );
} ) )( wp, preferredLanguages, jQuery );
