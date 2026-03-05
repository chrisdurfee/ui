import { Atom, Html } from '@base-framework/base';
import { commonInputClasses } from './inputs/input-classes.js';

/**
 * This will create a select component.
 *
 * @param {object} props
 * @returns {object}
 */
export const Select = Atom((props) =>
{
	const { options, onCreated: userOnCreated, ...attrs } = props;
	return {
		tag: 'select',
		onCreated(ele)
		{
			if (options)
			{
				Html.setupSelectOptions(ele, options);
			}

			if (userOnCreated)
			{
				userOnCreated(ele);
			}
		},
		...attrs,
		class: `[&>option]:text-foreground [&>option]:bg-background ${commonInputClasses} ${attrs.class || ''}`.trim()
	};
});

export default Select;
