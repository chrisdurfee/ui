import { Atom } from "@base-framework/base";

/**
 * This will create a row.
 *
 * @param {object} props
 * @param {array} children
 * @returns {object}
 */
export const Row = Atom((props, children) =>
{
	// @ts-ignore
	const flex = (!props.flex)? "flex flex-auto flex-col lg:flex-row" : props.flex;
	// @ts-ignore
	props.class = 'row ' + flex + ' ' + (props.class || '');

	return {
		...props,
		children
	};
});

export default Row;
