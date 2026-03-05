import { Atom, Html } from '@base-framework/base';
import { commonInputClasses } from './inputs/input-classes.js';

/**
 * This will create a select component.
 *
 * @param {object} props
 * @returns {object}
 */
export const Select = Atom((props) =>
({
	tag: 'select',
	onCreated(ele)
	{
		// @ts-ignore
		if (props.options)
		{
			// @ts-ignore
			Html.setupSelectOptions(ele, props.options);
		}
	},
	...props,
	// @ts-ignore
	class: `[&>option]:text-foreground [&>option]:bg-background ${commonInputClasses} ${props.class || ''}`.trim()
}));

export default Select;
