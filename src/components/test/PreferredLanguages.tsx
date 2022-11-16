import {
	fireEvent,
	queryByRole,
	render,
	screen,
	waitFor,
} from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';

import { Language } from '../../types';
import PreferredLanguages from '../PreferredLanguages';
import { BACKSPACE, DOWN, END, HOME, UP } from '@wordpress/keycodes';

jest.mock( 'uuid', () => ( {} ) );

/* eslint-disable camelcase */

const de_DE: Language = {
	locale: 'de_DE',
	nativeName: 'Deutsch',
	lang: 'de',
	installed: true,
};

const en_GB: Language = {
	locale: 'en_GB',
	nativeName: 'English (UK)',
	lang: 'en',
	installed: true,
};

const fr_FR: Language = {
	locale: 'fr_FR',
	nativeName: 'Français',
	lang: 'fr',
	installed: true,
};

const es_ES: Language = {
	locale: 'es_ES',
	nativeName: 'Español',
	lang: 'es',
	installed: false,
};

const it_IT: Language = {
	locale: 'it_IT',
	nativeName: 'Italiano',
	lang: 'it',
	installed: false,
};

const scrollIntoView = jest.fn();
window.HTMLElement.prototype.scrollIntoView = scrollIntoView;

/**
 * Workaround to trigger keyboard events.
 *
 * @see https://github.com/WordPress/gutenberg/issues/45777
 */

function moveUp() {
	fireEvent.keyDown( screen.getByRole( 'listbox' ), {
		key: 'ArrowUp',
		keyCode: UP,
	} );
}

function moveDown() {
	fireEvent.keyDown( screen.getByRole( 'listbox' ), {
		key: 'ArrowDown',
		keyCode: DOWN,
	} );
}

function selectFirst() {
	fireEvent.keyDown( screen.getByRole( 'listbox' ), {
		key: 'Home',
		keyCode: HOME,
	} );
}

function selectLast() {
	fireEvent.keyDown( screen.getByRole( 'listbox' ), {
		key: 'End',
		keyCode: END,
	} );
}

function removeLocale() {
	fireEvent.keyDown( screen.getByRole( 'listbox' ), {
		key: 'Backspace',
		keyCode: BACKSPACE,
	} );
}

function addLocale() {
	fireEvent.keyDown( screen.getByRole( 'listbox' ), {
		key: 'A',
		keyCode: 65,
		altKey: true,
	} );
}

describe( 'PreferredLanguages', () => {
	it( 'shows missing translations notice', () => {
		render(
			<PreferredLanguages
				allLanguages={ [] }
				preferredLanguages={ [] }
				hasMissingTranslations
			/>
		);

		// Found multiple times due to aria-live.
		expect(
			screen.getAllByText( /Some of the languages are not installed/ )
		).not.toHaveLength( 0 );
	} );

	it( 'populates hidden form field', () => {
		render(
			<PreferredLanguages
				allLanguages={ [ de_DE, en_GB, fr_FR, es_ES ] }
				preferredLanguages={ [ de_DE, en_GB, fr_FR ] }
			/>
		);

		const hiddenInput = document.querySelector(
			'input[name="preferred_languages"][type="hidden"]'
		);

		expect( hiddenInput ).toHaveValue( 'de_DE,en_GB,fr_FR' );
	} );

	it( 'adds language to list', async () => {
		render(
			<PreferredLanguages
				allLanguages={ [ de_DE, en_GB, fr_FR, es_ES ] }
				preferredLanguages={ [ de_DE, fr_FR ] }
			/>
		);

		const add = screen.getByRole( 'button', { name: /Add/ } );
		await userEvent.click( add );
	} );

	it( 're-populates selected locale when empty dropdown is filled again', async () => {
		render(
			<PreferredLanguages
				allLanguages={ [ de_DE, fr_FR, es_ES ] }
				preferredLanguages={ [ de_DE, fr_FR ] }
			/>
		);

		const add = screen.getByRole( 'button', { name: /Add/ } );
		const remove = screen.getByRole( 'button', { name: /Remove/ } );
		const dropdown = screen.getByRole( 'combobox' );

		expect( add ).not.toBeDisabled();
		expect( dropdown ).not.toBeDisabled();
		expect( dropdown ).toHaveValue( 'es_ES' );

		await userEvent.click( add );

		await waitFor( () => {
			expect(
				screen.getByRole( 'option', { name: /Español/ } )
			).toHaveAttribute( 'aria-selected', 'true' );

			expect( dropdown ).not.toHaveValue();
			expect( dropdown ).toBeDisabled();
			expect(
				screen.getByRole( 'button', { name: /Add/ } )
			).toBeDisabled();
		} );

		await userEvent.click( remove );

		await waitFor( () => {
			expect( dropdown ).toHaveValue( 'es_ES' );
			expect( dropdown ).not.toBeDisabled();
			expect(
				screen.getByRole( 'button', { name: /Add/ } )
			).not.toBeDisabled();
		} );
	} );

	it( 'supports keyboard shortcuts', async () => {
		render(
			<PreferredLanguages
				allLanguages={ [ de_DE, en_GB, fr_FR, es_ES, it_IT ] }
				preferredLanguages={ [ de_DE, fr_FR, it_IT ] }
			/>
		);

		const listbox = screen.getByRole( 'listbox' );
		const dropdown = screen.getByRole( 'combobox' );

		expect(
			screen.getByRole( 'option', { name: /Deutsch/ } )
		).toHaveAttribute( 'aria-selected', 'true' );

		expect(
			screen.getByRole( 'button', { name: /Move language up/ } )
		).toBeDisabled();
		expect(
			screen.getByRole( 'button', { name: /Move language down/ } )
		).not.toBeDisabled();

		listbox.focus();

		moveDown();
		moveDown();
		moveDown();

		expect(
			screen.getByRole( 'button', { name: /Move language up/ } )
		).not.toBeDisabled();
		expect(
			screen.getByRole( 'button', { name: /Move language down/ } )
		).toBeDisabled();

		selectFirst();

		expect(
			screen.getByRole( 'option', { name: /Français/ } )
		).toHaveAttribute( 'aria-selected', 'true' );

		selectFirst();

		expect(
			screen.getByRole( 'option', { name: /Français/ } )
		).toHaveAttribute( 'aria-selected', 'true' );

		expect(
			screen.getByRole( 'button', { name: /Move language up/ } )
		).toBeDisabled();

		selectLast();

		expect(
			screen.getByRole( 'option', { name: /Deutsch/ } )
		).toHaveAttribute( 'aria-selected', 'true' );

		selectLast();

		expect(
			screen.getByRole( 'option', { name: /Deutsch/ } )
		).toHaveAttribute( 'aria-selected', 'true' );

		expect(
			screen.getByRole( 'button', { name: /Move language down/ } )
		).toBeDisabled();

		moveUp();
		moveUp();
		moveUp();

		expect(
			screen.getByRole( 'button', { name: /Move language down/ } )
		).not.toBeDisabled();

		removeLocale();

		expect(
			queryByRole( listbox, 'option', { name: /Deutsch/ } )
		).not.toBeInTheDocument();
		expect(
			queryByRole( dropdown, 'option', { name: /Deutsch/ } )
		).toBeInTheDocument();

		removeLocale();
		removeLocale();

		expect(
			screen.getByRole( 'button', { name: /Remove/ } )
		).toBeDisabled();

		removeLocale();

		expect(
			screen.getByRole( 'button', { name: /Remove/ } )
		).toBeDisabled();

		selectFirst();

		selectLast();

		expect(
			screen.getByRole( 'button', { name: /Remove/ } )
		).toBeDisabled();

		fireEvent.change( dropdown, { target: { value: 'en_GB' } } );
		expect( dropdown ).toHaveValue( 'en_GB' );

		addLocale();

		expect(
			queryByRole( listbox, 'option', { name: /English/ } )
		).toBeInTheDocument();

		expect( dropdown ).toHaveValue( 'fr_FR' );

		addLocale();

		expect( dropdown ).toHaveValue( 'de_DE' );

		addLocale();

		expect( dropdown ).toHaveValue( 'es_ES' );

		addLocale();

		expect( dropdown ).toHaveValue( 'it_IT' );

		addLocale();

		expect( dropdown ).toBeDisabled();

		addLocale();

		expect( dropdown ).toBeDisabled();
	} );
} );

/* eslint-enable camelcase */
