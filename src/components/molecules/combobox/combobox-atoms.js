import { Button, Div, I, Li, OnState, Span, Ul } from '@base-framework/atoms';
import { Icon } from '../../atoms/icon.js';
import { Icons } from '../../icons/icons.js';
import { PopOver } from '../popover.js';

/**
 * This will create the dropdown button.
 *
 * @param {object} props
 * @returns {object}
 */
export const DropdownButton = ({ toggleDropdown }) => (
	Button({
		cache: 'button',
		class: 'relative z-[2] inline-flex items-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border bg-input hover:bg-muted h-10 px-4 py-2 justify-between',
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
export const ComboboxItem = (item, onSelect, state) => {
	return Li({
		class: 'flex flex-auto items-center cursor-pointer p-2 hover:bg-muted/50 rounded-sm',
		click: () => onSelect(item),
		onState: [state, 'selectedValue', { 'bg-secondary': item.value }]
	}, [
		item.icon && Span({ class: 'mr-2 flex items-baseline' }, [ Icon({ size: 'xs' }, item.icon)]),
		Span({ class: 'text-base font-normal' }, item.label),
	]);
};

/**
 * ComboboxDropdown Atom
 *
 * @param {function} handleSelect
 * @param {object} state
 * @returns {object}
 */
export const ComboboxDropdown = (handleSelect, state) => (
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
export const DropdownContainer = ({ onSelect, state }) => (
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
