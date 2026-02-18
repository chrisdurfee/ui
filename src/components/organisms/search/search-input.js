import { Div } from '@base-framework/atoms';
import { Atom } from '@base-framework/base';
import { Input } from "../../atoms/form/inputs/inputs.js";
import { UniversalIcon } from "../../atoms/universal-icon.js";

const CLOSE_DELAY = 100;

/**
 * This will create a search input.
 *
 * @param {object} props - The properties of the component.
 * @returns {object} - The search input component.
 */
// @ts-ignore
export const SearchInput = Atom((props) => (
	Div({ class: 'relative flex flex-auto items-center' }, [
		Input({
			cache: 'input',
			// @ts-ignore
			class: props.class ?? '',
			// @ts-ignore
			placeholder: props.placeholder ?? 'Search...',
			// @ts-ignore
			bind: (props.bind ?? [props.state, 'searchQuery']),
			keyup: (e, parent) =>
			{
				if (parent.state)
				{
					parent.state.open = false;
				}

				// @ts-ignore
				if (typeof props.filterOptions === 'function')
				{
					// @ts-ignore
					props.filterOptions();
				}

				if (parent.dropdown)
				{
					parent.dropdown.updatePosition();
				}

				// @ts-ignore
				if (props.keyup)
				{
					// @ts-ignore
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
				// @ts-ignore
				(typeof props.handleKeyDown === 'function') && props.handleKeyDown(e)
			],
		}),
		// @ts-ignore
		props.icon && Div({ class: 'absolute flex right-0 mr-2' }, [
			// @ts-ignore
			UniversalIcon({ size: 'sm' }, props.icon)
		])
	])
));

export default SearchInput;
