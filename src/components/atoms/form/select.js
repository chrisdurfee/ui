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
		if (props.options)
		{
			Html.setupSelectOptions(ele, props.options);
		}
	},
	...props,
	class: `${commonInputClasses} ${props.class || ''}`.trim()
}));

export default Select;