import { Div } from '@base-framework/atoms';
import { Atom } from '@base-framework/base';
import { Input } from "../../atoms/form/inputs/inputs.js";
import { Icon } from "../../atoms/icon.js";

const CLOSE_DELAY = 100;

/**
 * This will create a search input.
 *
 * @param {object} props - The properties of the component.
 * @returns {object} - The search input component.
 */
export const SearchInput = Atom((props) => (
	Div({ class: 'relative flex items-center' }, [
		Input({
			cache: 'input',
			placeholder: props.placeholder ?? 'Search...',
			bind: (props.bind ?? [props.state, 'searchQuery']),
			keyup: (e, parent) =>
			{
				if (parent.state)
				{
					parent.state.open = false;
				}

				if (typeof props.filterOptions === 'function')
				{
					props.filterOptions();
				}

				if (parent.dropdown)
				{
					parent.dropdown.updatePosition();
				}

				if (props.keyup)
				{
					props.keyup(e, parent);
				}
			},
			pointerup: (e, parent) =>
			{
				if (typeof parent.toggleDropdown === 'function')
				{
					parent.toggleDropdown();
				}
			},
			keydown: (e) =>
			[
				(typeof props.handleKeyDown === 'function') && props.handleKeyDown(e)
			],
		}),
		props.icon && Div({ class: 'absolute flex right-0 mr-2' }, [
			Icon(props.icon)
		])
	])
));

export default SearchInput;