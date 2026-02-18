import { H1, Header } from "@base-framework/atoms";
import { Atom } from "@base-framework/base";

/**
 * This will create a top bar.
 *
 * @param {object} props
 * @param {array} children
 * @returns {object}
 */
export const TopBar = Atom((props, children) =>
{
	return Header([
		// @ts-ignore
		H1({ watch: props.watch }, props.text)
	], children);
});

/**
 * This will create a main column.
 *
 * @param {object} props
 * @param {array} children
 * @returns {object}
 */
export const MainColumn = Atom((props, children) =>
{
	// @ts-ignore
	const flex = (!props.flex) ? "flex flex-auto flex-col" : "flex flex-none";
	// @ts-ignore
	props.class = 'col ' + flex + ' ' + (props.class || '');

	return {
		...props,
		children
	};
});

export default MainColumn;
