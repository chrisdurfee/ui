import { Button as BaseButton, Div, OnState, Span } from '@base-framework/atoms';
import { Component, Data } from '@base-framework/base';
import { Button } from '../../atoms/buttons/buttons.js';
import { UniversalIcon } from '../../atoms/universal-icon.js';
import { PopOver } from '../popover.js';
import { Dropdown } from './dropdown.js';

/**
 * This will render a dropdown button.
 *
 * @param {object} props
 * @returns {object}
 */
const DropdownButton = ({ label, icon, toggleDropdown, variant, btnClass }) =>
{
	if (variant !== null && variant !== undefined)
	{
		return Button({
			cache: 'button',
			variant,
			class: btnClass || '',
			click: toggleDropdown
		}, [
			label && Span(label),
			icon && UniversalIcon({}, icon)
		]);
	}

	return BaseButton({
		cache: 'button',
		class: `inline-flex items-center justify-between rounded-md border
			px-2 py-2 text-sm font-medium hover:bg-muted
			focus:outline-none transition duration-150 ease-in-out ${btnClass || ''}`,
		click: toggleDropdown
	}, [
		label && Span(label),
		icon && UniversalIcon({}, icon)
	]);
};

/**
 * This will render a dropdown container.
 *
 * @param {object} props
 * @returns {object}
 */
const DropdownContainer = ({ onSelect, class: popoverClass }) => (
	Div([
		OnState('open', (isOpen, ele, parent) => (!isOpen)
			? null
			: new PopOver({
				cache: 'dropdown',
				class: popoverClass || '',
				parent: parent,
				button: parent.button,
			}, [
				Dropdown(onSelect)
			])
		)
	])
);

/**
 * Dropdown Component
 *
 * A generic dropdown component that allows for customizable items.
 *
 * @param {object} props
 * @param {array} children - Dropdown button content
 * @returns {object}
 */
export class DropdownMenu extends Component
{
	/**
	 * This will declare the props for the compiler.
	 *
	 * @returns {void}
	 */
	declareProps()
	{
		/**
		 * @member {string} label
		 */
		this.label = null;

		/**
		 * @member {string} icon
		 * @default null
		 */
		this.icon = null;

		/**
		 * @member {function} onSelect
		 */
		this.onSelect = null;

		/**
		 * @member {array} groups
		 */
		this.groups = [];

		/**
		 * @member {string|null} variant - Button variant (e.g. 'ghost', 'outline', 'primary').
		 */
		this.variant = null;

		/**
		 * @member {string|null} btnClass - Additional CSS classes for the button.
		 */
		this.btnClass = null;

		/**
		 * @member {string|null} class - Additional CSS classes for the dropdown container.
		 */
		this.popoverClass = null;
	}

	/**
	 * Initializes component data.
	 *
	 * @returns {Data}
	 */
	setData()
	{
		return new Data({
			groups: this.groups || []
		});
	}

	/**
	 * Initializes the component state.
	 *
	 * @returns {object}
	 */
	setupStates()
	{
		return {
			open: false,
			selectedItem: null
		};
	}

	/**
	 * Toggles the dropdown open state.
	 *
	 * @returns {void}
	 */
	toggleDropdown()
	{
		// @ts-ignore
		this.state.toggle('open');
	}

	/**
	 * Handles item selection within the dropdown.
	 *
	 * @param {object} item - The selected item object
	 * @returns {void}
	 */
	handleSelect(item)
	{
		// @ts-ignore
		this.state.selectedItem = item;
		// @ts-ignore
		this.state.open = false;

		if (typeof this.onSelect === 'function')
		{
			this.onSelect(item);
		}
	}

	/**
	 * Renders the Dropdown component.
	 *
	 * @returns {object}
	 */
	render()
	{
		return Div({ class: 'relative' }, [
			DropdownButton({
				label: this.label,
				icon: this.icon,
				toggleDropdown: this.toggleDropdown.bind(this),
				variant: this.variant,
				btnClass: this.btnClass
			}),
			DropdownContainer({ class: this.popoverClass, onSelect: this.handleSelect.bind(this) })
		]);
	}
}
