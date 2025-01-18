import { Div } from '@base-framework/atoms';
import { Data, Jot } from '@base-framework/base';
import { PopOver } from "../../molecules/popover.js";
import { Dropdown } from "./dropdown.js";
import { SearchInput } from "./search-input.js";

/**
 * This will render a dropdown container.
 *
 * @param {object} props
 * @returns {object}
 */
const DropdownContainer = (props) => (
	Div({
		class: 'relative flex fle-auto flex-col',
		onState: ['open', (open, ele, parent) =>
		{
			if (open)
			{
				return new PopOver({
					cache: 'dropdown',
					parent: parent,
					button: parent.input,
					size: 'xl'
				}, [
					Dropdown(props)
				]);
			}
		}]
	})
);

/**
 * SearchDropdown
 *
 * This will create a search dropdown.
 *
 * @param {object} props - The properties of the component.
 * @returns {typeof Component} - The search dropdown component.
 */
export const SearchDropdown = Jot(
{
	/**
	 * This will set up the data object.
	 *
	 * @returns {object} - The data object.
	 */
	setData()
	{
		// @ts-ignore
		const options = this.options || [];
		return new Data({
			options,
			filteredOptions: options
		});
	},

	/**
	 * This will set up the state object.
	 *
	 * @returns {object} - The state object.
	 */
	state()
	{
		return {
			searchQuery: '',
			selectedIndex: -1,
			open: false,
		};
	},

	/**
	 * This will set the selected index by query.
	 *
	 * @returns {void}
	 */
	setSelectedIndexByQuery()
	{
		// @ts-ignore
		const filteredOptions = this.data.filteredOptions;
		// @ts-ignore
		let { searchQuery } = this.state;
		searchQuery = searchQuery.toLowerCase();

		const index = filteredOptions.findIndex(option => option.label.toLowerCase() === searchQuery);
		if (index >= 0)
		{
			// @ts-ignore
			this.state.selectedIndex = index;
		}
	},

	/**
	 * This will filter the options.
	 *
	 * @returns {void}
	 */
	filterOptions()
	{
		// @ts-ignore
		const query = this.state.searchQuery.toLowerCase();
		if (query === '' || query.length === 0)
		{
			// @ts-ignore
			this.data.filteredOptions = this.data.options;
			return;
		}

		// @ts-ignore
		const options = this.data.get('options');
		// @ts-ignore
		this.data.filteredOptions = options.filter(option =>
			option.label.toLowerCase().includes(query)
		);
	},

	/**
	 * This will get the selected value.
	 *
	 * @returns {object}
	 */
	getValue()
	{
		// @ts-ignore
		const { selectedIndex } = this.state;
		if (selectedIndex < 0)
		{
			return null;
		}

		// @ts-ignore
		return this.data.get(`filteredOptions[${selectedIndex}]`);
	},

	/**
	 * This will select an option.
	 *
	 * @param {number} index - The index of the option.
	 * @returns {void}
	 */
	selectOption(index)
	{
		// @ts-ignore
		this.state.selectedIndex = index;
		// @ts-ignore
		const selection = this.data.get(`filteredOptions[${index}]`);
		// @ts-ignore
		this.state.searchQuery = selection.label;
		// @ts-ignore
		this.state.open = false;

		// @ts-ignore
		if (typeof this.onSelect === 'function')
		{
			// @ts-ignore
			this.onSelect(selection);
		}
	},

	/**
	 * Toggles the dropdown open state.
	 */
	toggleDropdown()
	{
		// @ts-ignore
		this.state.toggle('open');

		// @ts-ignore
		if (this.state.open)
		{
			// @ts-ignore
			this.setSelectedIndexByQuery();
		}
	},

	/**
	 * This will handle key down events.
	 *
	 * @param {object} event - The event object.
	 * @returns {void}
	 */
	handleKeyDown(event)
	{
		// @ts-ignore
		const filteredOptions = this.data.filteredOptions;
		// @ts-ignore
		const { selectedIndex } = this.state;
		if (event.key === 'ArrowDown')
		{
			event.preventDefault();
			// @ts-ignore
			this.state.selectedIndex = Math.min(selectedIndex + 1, filteredOptions.length - 1);
		}
		else if (event.key === 'ArrowUp')
		{
			event.preventDefault();
			// @ts-ignore
			this.state.selectedIndex = Math.max(selectedIndex - 1, 0);
		}
		else if (event.key === 'Enter' && selectedIndex >= 0)
		{
			event.preventDefault();
			// @ts-ignore
			this.selectOption(selectedIndex);
		}
	},

	/**
	 * This will render the component.
	 *
	 * @returns {object} - The rendered component.
	 */
	render()
	{
		return Div({ class: 'relative w-full max-w-md' }, [

			SearchInput({
				// @ts-ignore
				state: this.state,
				// @ts-ignore
				icon: this.icon,
				// @ts-ignore
				placeholder: this.placeholder,
				// @ts-ignore
				filterOptions: this.filterOptions.bind(this),
				// @ts-ignore
				handleKeyDown: this.handleKeyDown.bind(this),
			}),

			DropdownContainer({
				// @ts-ignore
				state: this.state,
				// @ts-ignore
				setSelected: this.setSelectedIndexByQuery.bind(this),
				// @ts-ignore
				selectOption: this.selectOption.bind(this),
			})
		]);
	},
});

export default SearchDropdown;