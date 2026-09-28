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
	const { flex: flexProp, ...rest } = props;

	/**
	 * A flex string is used as the flex classes. A truthy
	 * non-string value keeps the legacy "flex flex-none".
	 */
	let flex = "flex flex-auto flex-col";
	if (typeof flexProp === 'string' && flexProp !== '')
	{
		flex = flexProp;
	}
	else if (flexProp)
	{
		flex = "flex flex-none";
	}

	// @ts-ignore
	rest.class = 'col ' + flex + ' ' + (props.class || '');

	return {
		...rest,
		children
	};
});

export default MainColumn;
