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

	function removeActiveLocale() {
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
		$inactiveLocales.find( 'select option[value="' + locale + '"]' ).removeClass('hidden');
	}

	function removeInactiveLocale( option ) {
		var $newLocale = $( '<li/>', { 'id': option.val() || 'en_US', text: option.text(), 'aria-selected': false } ),
		    $successor;

		$successor = option.prev( ':not(.hidden)' );

		if ( 0 === $successor.length ) {
			$successor = option.next( ':not(.hidden)' );
		}

		if ( 0 === $successor.length ) {
			$successor = $inactiveLocales.find( 'option' ).first();
		}

		// 1. Change selected value in dropdown.
		$successor.attr('selected', true);
		$inactiveLocalesControls.val( $successor.val() );

		// 2. Hide from dropdown.
		option.removeAttr('selected').addClass('hidden');

		// It's already in the list of active locales, stop here.
		if ( $activeLocales.find( '#' + ( option.val() || 'en_US' ) ) ) {
			return;
		}

		// 3. Add to list.
		$activeLocales.append( $newLocale );

		toggleLocale( $newLocale );

		// 4. Scroll into view.
		$activeLocales.animate( {
			scrollTop: $newLocale.offset().top - $activeLocales.offset().top + $activeLocales.scrollTop()
		} );

		// 5. Update hidden input field.
		updateHiddenInput();
	}

	// Hide original language settings.
	$( '.user-language-wrap' ).remove();
	$( '#WPLANG' ).parent().parent().remove();

	// Change initial button state.
	changeButtonState( $selectedLocale );

	// Initially hide already active locales from dropdown.
	$.each( $inputField.val().split( ',' ), function( index, value ) {
		value = 'en_US' === value ? '' : value;

		removeInactiveLocale( $inactiveLocales.find( '[value="' + value + '"]') );
	} );

	// Enabling sorting locales using drag and drop.
	$activeLocales.sortable( {
		axis:   'y',
		cursor: 'move'
	} );

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
			removeActiveLocale();
			e.preventDefault();
		}
	} );

	// Add new locale to list.
	$inactiveLocalesControls.find( '.locales-add' ).on( 'click', function() {
		removeInactiveLocale( $inactiveLocales.find( 'select option:selected' ) );
	} );

	// Select a locale.
	$activeLocales.on( 'click', 'li', function() {
		toggleLocale( $( this ) );
	} );

	$activeLocalesControls.find( '.locales-move-up' ).on( 'click', moveLocaleUp );

	$activeLocalesControls.find( '.locales-move-down' ).on( 'click', moveLocaleDown );

	// Remove locale from list.
	$activeLocalesControls.find( '.locales-remove' ).on( 'click', removeActiveLocale );
})( jQuery, window.preferredLanguages );
