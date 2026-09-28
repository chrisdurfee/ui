import { Atom } from "@base-framework/base";

/**
 * This will create a main section.
 *
 * @param {object} props
 * @param {array} children
 * @returns {object}
 */
export const MainSection = Atom((props, children) =>
{
	// @ts-ignore
	props.class = 'basic-page pt-[calc(var(--header-h,80px)_+_env(safe-area-inset-top,0px))] sm:pt-0 flex flex-auto flex-col ' + (props.class || '');

	return {
		tag: 'section',
		...props,
		children
	};
});

export default MainSection;
