import { Atom } from "@base-framework/base";
import { Template } from "./template.js";

/**
 * This will create a full template.
 *
 * @param {object} props
 * @param {array} children
 * @returns {object}
 */
export const FullTemplate = Atom((props, children) =>
{
	// @ts-ignore
	const className = props.class ? ' ' + props.class : '';

	return Template({
		...props,
		class: 'body full-container flex flex-auto flex-col' + className
	}, children);
});

export default FullTemplate;
