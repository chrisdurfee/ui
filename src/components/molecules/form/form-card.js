import { Div, H2, P } from "@base-framework/atoms";
import { Atom } from "@base-framework/base";
import { Card } from "../../atoms/cards/card.js";
import { FormGroup } from "../../atoms/form/form-group.js";

/**
 * FormCard
 *
 * A card component for displaying a form.
 *
 * @param {object} props - The component props.
 * @param {string} props.title - The title of the form.
 * @param {array} children - The children to render inside the card.
 * @returns {object} The rendered form card component.
 */
export const FormCard = Atom((props, children = []) => (
	Card({ class: 'space-y-0', margin: 'm-0', padding: 'p-0' }, [
		props.title && H2({ class: 'text-lg font-semibold py-4 px-6' }, props.title),
		props.description && P({ class: 'text-sm text-muted-foreground pb-4 px-6 max-w-[700px]' }, props.description),
		...children
	])
));

/**
 * FormCardGroup
 *
 * A group of form cards.
 *
 * @param {object} props - The component props.
 * @param {array} children - The children to render inside the group.
 * @returns {object} The rendered form card group component.
 */
export const FormCardGroup = Atom((props, children = []) => (
	FormGroup({ label: props.label, description: props.description, class: 'py-4 px-6', border: props.border }, [
		Div({ class: 'flex flex-col space-y-6' }, children)
	])
));

/**
 * FormCardGroup
 *
 * A group of form cards.
 *
 * @param {object} props - The component props.
 * @param {array} children - The children to render inside the group.
 * @returns {object} The rendered form card group component.
 */
export const FormCardContent = Atom((props, children = []) =>
{
	const border = props.border ? 'border-t' : '';
	return Div({ ...props, class: `flex flex-col pb-4 px-6 space-y-4 ${border} ${props.class || ''}` }, children);
});
