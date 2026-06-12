import { Div } from '@base-framework/atoms';
import { Atom } from '@base-framework/base';

/**
 * This will create a card.
 *
 * @param {object} props
 * @param {array} children
 * @returns {object}
 */
export const Card = Atom((props, children) =>
{
	// @ts-ignore
	const margin = props.margin ?? 'my-5 mx-5';
	// @ts-ignore
	const padding = props.padding ?? 'p-4';
	// @ts-ignore
	const border = props.border ?? 'border-border';
	// @ts-ignore
	const hover = props.hover ? ' hover:shadow-lg hover:bg-muted/50' : '';

	return Div({
		...props,
		// @ts-ignore
		class: `rounded-lg ${border} bg-card text-card-foreground shadow-md min-w-[120px] min-h-[80px] ${margin} ${padding} ${props.class || ''}${hover}`
	}, children);
});
