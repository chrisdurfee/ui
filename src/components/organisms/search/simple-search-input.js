import { Input as BaseInput, Div } from '@base-framework/atoms';
import { Atom } from '@base-framework/base';
import { UniversalIcon } from "../../atoms/universal-icon.js";
import { Icons } from '../../icons/icons.js';

/**
 * This will create a simple search input with icon on left and pill shape.
 *
 * @param {object} props - The properties of the component.
 * @returns {object} - The simple search input component.
 */
// @ts-ignore
export const SimpleSearchInput = Atom((props) =>
{
	// @ts-ignore
	const icon = props.icon ?? Icons.magnifyingGlass.default;

	return Div({
		// @ts-ignore
		class: `relative flex items-center w-full rounded-xl bg-muted/30 focus-within:ring-2 focus-within:ring-ring transition-all ${props.containerClass || ''}`
	}, [
		Div({ class: 'absolute left-4 flex items-center pointer-events-none text-muted-foreground' }, [
			UniversalIcon({ size: 'sm' }, icon)
		]),
		BaseInput({
			type: 'text',
			// @ts-ignore
			cache: props.cache ?? 'input',
			// @ts-ignore
			class: `w-full bg-transparent border-none outline-none pl-12 pr-4 py-4 text-base text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-0 ${props.class || ''}`,
			// @ts-ignore
			placeholder: props.placeholder ?? 'Search...',
			// @ts-ignore
			bind: props.bind,
			// @ts-ignore
			value: props.value,
			// @ts-ignore
			keyup: props.keyup,
			// @ts-ignore
			keydown: props.keydown,
			// @ts-ignore
			input: props.input,
			// @ts-ignore
			change: props.change,
			// @ts-ignore
			focus: props.focus,
			// @ts-ignore
			blur: props.blur
		})
	]);
});

export default SimpleSearchInput;
