import { Button, Div, I, Input, Li, OnState, Span, Ul } from '@base-framework/atoms';
import { Component, Data, Jot } from '@base-framework/base';
import { Icon } from '../../atoms/icon.js';
import { Icons } from '../../icons/icons.js';
import { PopOver } from '../popover.js';

/**
 * This will create the dropdown button.
 *
 * @param {object} props
 * @returns {object}
 */
const DropdownButton = ({ toggleDropdown }) => (
	Button({
		cache: 'button',
		class: 'relative z-[2] inline-flex items-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-muted h-10 px-4 py-2 justify-between',
		click: toggleDropdown
	},
	[
		Span({ onState: ['selectedLabel', (value) => value || 'Select item...'] }),
		I({ html: Icons.chevron.upDown })
	])
);

/**
 * ComboboxItem Atom
 *
 * @param {object} item
 * @param {function} onSelect
 * @returns {object}
 */
const ComboboxItem = (item, onSelect, state) => {
	return Li({
		class: 'flex flex-auto items-center cursor-pointer p-2 hover:bg-muted/50 rounded-sm',
		click: () => onSelect(item),
		onState: [state, 'selectedValue', { 'bg-secondary': item.value }]
	}, [
		item.icon && Span({ class: 'mr-2 flex items-baseline' }, [ Icon({ size: 'xs' }, item.icon)]),
		Span(item.label),
	]);
};

/**
 * ComboboxDropdown Atom
 *
 * @param {function} handleSelect
 * @param {object} state
 * @returns {object}
 */
const ComboboxDropdown = (handleSelect, state) => (
	Div({ class: 'w-full border rounded-md' }, [
		Ul({ class: 'max-h-60 overflow-y-auto p-2 grid gap-1', for: ['items', (item) => ComboboxItem(item, handleSelect, state) ] }),
	])
);

/**
 * This will render a dropdown container.
 *
 * @param {object} props
 * @returns {object}
 */
const DropdownContainer = ({ onSelect, state }) => (
	Div({ class: 'flex flex-auto flex-col' }, [
		OnState('open', (isOpen, ele, parent) => (!isOpen)
			? null
			: new PopOver({
				cache: 'dropdown',
				parent: parent,
				button: parent.button,
			}, [
				ComboboxDropdown(onSelect, state)
			])
		)
	])
);

/**
 * Combobox
 *
 * This will render a combobox component.
 *
 * @type {typeof Component}
 */
export const Combobox = Jot(
{
	/**
	 * This will set up the data.
	 *
	 * @returns {Data}
	 */
	setData()
	{
		return new Data({
			// @ts-ignore
			items: this.items || []
		});
	},

	/**
	 * This will set up the states.
	 *
	 * @returns {object}
	 */
	state()
	{
		return {
			open: false,
			selectedLabel: '',
			selectedValue: ''
		};
	},

	/**
	 * Handles the selection of an item.
	 *
	 * @param {object} item
	 * @returns {void}
	 */
	handleSelect(item)
	{
		// @ts-ignore
		const state = this.state;
		state.selectedValue = item.value;
		state.selectedLabel = item.label;
		state.open = false;

		// @ts-ignore
		if (typeof this.onSelect === 'function')
		{
			// @ts-ignore
			this.onSelect(item);
		}
	},

	/**
	 * Toggles the dropdown open state.
	 *
	 * @returns {void}
	 */
	toggleDropdown()
	{
		// @ts-ignore
		this.state.toggle('open');
	},

	/**
	 * This will render the component.
	 *
	 * @returns {object}
	 */
	render()
	{
		return Div({ class: 'relative w-full flex flex-auto flex-col max-w-[250px]' }, [
			// @ts-ignore
			DropdownButton({ toggleDropdown: this.toggleDropdown.bind(this) }),
			DropdownContainer({
				// @ts-ignore
				state: this.state,
				// @ts-ignore
				onSelect: this.handleSelect.bind(this)
			}),

			// Hidden required input for form validation
			// @ts-ignore
			this.required &&
			Input({
				class: 'opacity-0 absolute top-0 left-0 z-[1]',
				type: 'text',
				// @ts-ignore
				name: this.name,
				required: true,
				// @ts-ignore
				value: ['[[selectedValue]]', this.state]
			})
		]);
	}
});
