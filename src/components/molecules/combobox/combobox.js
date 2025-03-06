import { Div, Input } from '@base-framework/atoms';
import { Component, Data, Jot } from '@base-framework/base';
import { DropdownButton, DropdownContainer } from './combobox-atoms.js';

/**
 * Combobox
 *
 * This will render a combobox component.
 *
 * @property {Array<object>} items
 * @property {string} class
 * @property {string} maxWidth
 * @property {string} width
 * @property {string} name
 * @property {boolean} required
 * @property {boolean} selectFirst
 * @property {function} onSelect
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
	 * This will set the state item.
	 *
	 * @param {object} item
	 * @returns {void}
	 */
	setStateItem(item)
	{
		// @ts-ignore
		const state = this.state;
		state.selectedValue = item.value;
		state.selectedLabel = item.label;
		state.open = false;
	},

	/**
	 * Handles the selection of an item.
	 *
	 * @param {object} item
	 * @returns {void}
	 */
	select(item)
	{
		// @ts-ignore
		this.setStateItem(item);

		// @ts-ignore
		if (typeof this.onSelect === 'function')
		{
			// @ts-ignore
			this.onSelect(item, this.parent);
		}
	},

	/**
	 * Selects the first item in the list.
	 *
	 * @returns {void}
	 */
	selectFirstItem()
	{
		// @ts-ignore
		const item = this.data.items[0];
		// @ts-ignore
		this.select(item);
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
	 * This will run after the component is set up.
	 *
	 * @returns {void}
	 */
	after()
	{
		// @ts-ignore
		if (this.selectFirst === true)
		{
			// @ts-ignore
			const item = this.data.items[0];
			if (item)
			{
				// @ts-ignore
				this.setStateItem(item);
			}
		}
	},

	/**
	 * This will render the component.
	 *
	 * @returns {object}
	 */
	render()
	{
		// @ts-ignore
		const className = this.class || '';
		// @ts-ignore
		const maxWidth = this.maxWidth || 'max-w-[250px]';
		// @ts-ignore
		const width = this.width || 'w-full';

		return Div({ class: `relative ${width} flex flex-auto flex-col ${maxWidth} ${className}` }, [
			// @ts-ignore
			DropdownButton({ toggleDropdown: this.toggleDropdown.bind(this) }),
			DropdownContainer({
				// @ts-ignore
				state: this.state,
				// @ts-ignore
				onSelect: this.select.bind(this)
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
