import { Div, H4, P } from '@base-framework/atoms';
import { Atom } from '@base-framework/base';

/**
 * Creates a responsive form-group: label on the left, controls on the right.
 *
 * @param {object} props
 * @param {string|object} props.label
 * @param {object} [props.labelProps] any extra props for the label container
 * @param {string} [props.class] extra classes for the outer container
 * @param {array} children form controls (inputs, selects, etc)
 * @returns {object}
 */
export const FormGroup = Atom((props, children) =>
{
	const border = props.border === true ? 'border-t' : '';

	// Outer flex: column on mobile, row+centered on sm+
	return Div({
		...props,
		class: `grid grid-cols-1 gap-y-4 sm:grid-cols-[1fr_2fr] sm:gap-x-6 pt-8 ${border} ${props.class || ''}`
	}, [
		props.label && Div({
			...props.labelProps,
			class: `flex flex-auto flex-col gap-y-1 ${props.labelProps?.class || ''}`
		}, [
			H4({ class: 'text-base' }, props.label),
			props.description && P({ class: `text-sm text-muted-foreground` }, props.description)
		]),

		// Controls container: grows to fill remaining space, spacing between items
		Div({ class: 'flex flex-col gap-y-4' }, children)
	]);
});

export default FormGroup;
