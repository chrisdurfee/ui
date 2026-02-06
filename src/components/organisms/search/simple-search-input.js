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
export const SimpleSearchInput = Atom((props) =>
{
	const icon = props.icon ?? Icons.magnifyingGlass.default;

	return Div({
		class: `relative flex items-center w-full rounded-xl bg-muted/30 focus-within:ring-2 focus-within:ring-ring transition-all ${props.containerClass || ''}`
	}, [
		Div({ class: 'absolute left-4 flex items-center pointer-events-none text-muted-foreground' }, [
			UniversalIcon({ size: 'sm' }, icon)
		]),
		BaseInput({
			type: 'text',
			cache: props.cache ?? 'input',
			class: `w-full bg-transparent border-none outline-none pl-12 pr-4 py-4 text-base text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-0 ${props.class || ''}`,
			placeholder: props.placeholder ?? 'Search...',
			bind: props.bind,
			value: props.value,
			keyup: props.keyup,
			keydown: props.keydown,
			input: props.input,
			change: props.change,
			focus: props.focus,
			blur: props.blur
		})
	]);
});

export default SimpleSearchInput;
