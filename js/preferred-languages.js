(function( $, settings ) {
	var $activeLocales           = $( '.active-locales-list' ),
	    $activeLocalesControls   = $( '.active-locales-controls' ),
	    $inactiveLocales         = $( '.inactive-locales-list' ),
	    $inactiveLocalesControls = $( '.inactive-locales-controls' ),
	    $selectedLocale          = $activeLocales.find( 'li[aria-selected="true"]' ),
	    $inputField              = $( 'input[name="preferred_languages"]' );

	// Set initial button state.
	function changeButtonState( activeLocale ) {
		$activeLocalesControls.find( '.locales-move-up' ).attr( 'disabled', 0 === activeLocale.index() );
		$activeLocalesControls.find( '.locales-move-down' ).attr( 'disabled', activeLocale.index() === $activeLocales.children( 'li' ).length - 1 );
		$activeLocalesControls.find( '.locales-remove' ).attr( 'disabled', 1 === $activeLocales.children( 'li' ).length );
	}

	function toggleLocale( locale ) {
		var selected = locale.attr( 'aria-selected' ),
		    newState = !!selected;

		// It's already the current locale, so nothing to do here.
		if ( true === selected ) {
			return;
		}

		$selectedLocale.attr( 'aria-selected', false );

		locale.attr( 'aria-selected', newState );

		if ( true === newState ) {
			$selectedLocale = locale;

			$activeLocales.attr( 'aria-activedescendant', $selectedLocale.attr( 'id' ) );
		}

		changeButtonState( locale );
	}

	function updateHiddenInput() {
		var locales = [];

		$activeLocales.children( 'li' ).each( function() {
			locales.push( $( this ).attr( 'id' ) );
		} );

		$inputField.val( locales.join( ',' ) );
	}

	function moveLocaleUp() {
		// 1. Change position if possible.
		$selectedLocale.insertBefore( $selectedLocale.prev() );

		// 2. Update hidden input field.
		updateHiddenInput();

		// 3. Update buttons.
		changeButtonState( $selectedLocale );
	}

	function moveLocaleDown() {
		// 1. Change position if possible.
		$selectedLocale.insertAfter( $selectedLocale.next() );

		// 2. Update hidden input field.
		updateHiddenInput();

		// 3. Update buttons.
		changeButtonState( $selectedLocale );
	}

	function removeLocale() {
		var locale = $selectedLocale.attr( 'id' ),
		    $successor;

		// There must be at least one locale.
		if ( 1 === $activeLocales.children( 'li' ).length ) {
			return;
		}

		$successor = $selectedLocale.prev();

		if ( 0 === $successor.length ) {
			$successor = $selectedLocale.next();
		}

		// 1. Remove selected locale.
		$selectedLocale.remove();

		// 2. Make another locale the current one.
		toggleLocale( $successor );

		// 3. Update buttons.
		changeButtonState( $selectedLocale );

		// 4. Update hidden input field.
		updateHiddenInput();

		if ( 'en_US' === locale ) {
			locale = '';
		}

		// 5. Make visible in dropdown again.
		$inactiveLocales.find( 'select option[value="' + locale + '"]' ).show();
	}

	changeButtonState( $selectedLocale );

	// Todo: Remove original WPLANG setting using JavaScript.

	// Arrow key handler.
	$activeLocales.on( 'keydown', function( e ) {
		// Up.
		if ( 38 === e.which ) {
			if ( e.altKey ) {
				moveLocaleUp();
			} else {
				$selectedLocale.prev().length && toggleLocale( $selectedLocale.prev() );
			}

			e.preventDefault();
		}

		// Down.
		if ( 40 === e.which ) {
			if ( e.altKey ) {
				moveLocaleDown();
			} else {
				$selectedLocale.next().length && toggleLocale( $selectedLocale.next() );
			}

			e.preventDefault();
		}

		// Backspace.
		if ( 8 === e.which ) {
			removeLocale();
			e.preventDefault();
		}
	} );

	// Add new locale to list.
	$inactiveLocalesControls.find( '.locales-add' ).on( 'click', function() {
		var $option    = $inactiveLocales.find( 'select option:selected' ),
		    $newLocale = $( '<li/>', { 'id': $option.val() || 'en_US', text: $option.text(), 'aria-selected': false } );

		// 1. Hide from dropdown.
		$option.hide();

		// 2. Add to list.
		$activeLocales.append( $newLocale );

		toggleLocale( $newLocale );

		// 4. Scroll into view.
		$activeLocales.animate( {
			scrollTop: $newLocale.offset().top - $activeLocales.offset().top + $activeLocales.scrollTop()
		} );

		// 5. Update hidden input field.
		updateHiddenInput();
	} );

	// Select a locale.
	$activeLocales.on( 'click', 'li', function() {
		toggleLocale( $( this ) );
	} );

	$activeLocalesControls.find( '.locales-move-up' ).on( 'click', moveLocaleUp );

	$activeLocalesControls.find( '.locales-move-down' ).on( 'click', moveLocaleDown );

	// Remove locale from list.
	$activeLocalesControls.find( '.locales-remove' ).on( 'click', removeLocale );
})( jQuery, window.preferredLanguages );
