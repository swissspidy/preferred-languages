document.addEventListener( 'DOMContentLoaded', () => {
	const widgetsWrap = document.getElementById( 'dashboard-widgets-wrap' );
	const adminNotice = document.createElement( 'div' );
	adminNotice.className = 'notice notice-success';
	adminNotice.setAttribute( 'data-testid', 'notice-custom-i18n-plugin-js' );

	const p1 = document.createElement( 'div' );
	p1.innerHTML = wp.i18n.__(
		'This is a dummy plugin',
		'custom-internationalized-plugin'
	);

	const p2 = document.createElement( 'div' );
	p2.innerHTML = wp.i18n.__(
		'This is another dummy plugin',
		'custom-internationalized-plugin'
	);

	adminNotice.appendChild( p1 );
	adminNotice.appendChild( p2 );

	widgetsWrap.parentElement.insertBefore( adminNotice, widgetsWrap );
} );
