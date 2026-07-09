import { Div, Span, Th } from '@base-framework/atoms';
import { MaterialIcon } from '../../atoms/material-icon.js';

/**
 * HeaderCol Atom
 *
 * Renders a header column for the table.
 *
 * @param {object} props
 * @returns {object}
 */
export const HeaderCol = ({ align, sortable, key, label, sort, class: className}) =>
{
	const alignClass = align || 'justify-start';
	return Th({
		class: `cursor-pointer py-3 px-4 text-base ${className || ''}`,
		click: sortable && (() => sort(key))
	}, [
		Div({ class: `flex flex-auto w-full items-center ${alignClass}` }, [
			Span(label),
			sortable && MaterialIcon({ name: 'unfold_more', size: 'xs', class: 'ml-2' })
		])
	]);
};

export default HeaderCol;
