import { Jot } from "@base-framework/base";

/**
 * Veil Component
 *
 * This will create a component that can accept data from a parent component
 * or it will use the parent's data or context data to set a local context
 * to act as if it's data scope is the parent component.
 *
 * @param {object} props
 * @param {array} children
 * @returns {object}
 */
export const Veil = Jot(
{
	/**
	 * This will get the child scope instance of the component.
	 *
	 * @returns {object}
	 */
	getChildScope()
	{
		// @ts-ignore
		return this.parent ?? this;
	},

	/**
	 * This will set the component context.
	 *
	 * @param {object|null} context
	 * @returns {object|null}
	 */
	setContext(context)
	{
		// @ts-ignore
		if (this.data)
		{
			return null;
		}

		// @ts-ignore
		const data = (this?.parent?.data ?? this?.parent?.context?.data ?? this?.parent?.state ?? null);
		if (!data)
		{
			return null;
		}

		return { data };
	}
});

/**
 * This will create a Veil component.
 *
 * @param  {*} props
 * @returns {import("node_modules/@base-framework/base/dist/types/modules/component/jot").ComponentConstructor}
 */
export const VeilJot = (props) => Jot(props, Veil);
