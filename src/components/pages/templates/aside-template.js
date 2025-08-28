import { Atom } from "@base-framework/base";
import { Row } from "./row.js";
import { MainColumn } from "./template-atoms.js";
import { Template } from "./template.js";

/**
 * This will create a aside template.
 *
 * @param {object} props
 * @param {array} children
 * @returns {object}
 */
export const AsideTemplate = Atom((props, children) =>
{
	return Template({ class: 'body aside-container flex flex-auto flex-col max-w-[100vw] h-full' }, [
		Row([
			MainColumn({
				class: 'drawer control w-full md:max-w-[320px]',
				flex: 'flex flex-none md:flex-auto flex-col'
			}, [
				props.left
			]),
			MainColumn({
				class: 'flex-grow flex-col',
				flex: 'flex flex-grow flex-col'
			}, [
				props.right
			])
		])
	]);
});

export default AsideTemplate;