import { Th, UseParent } from '@base-framework/atoms';
import { Checkbox } from '../../atoms/form/inputs/checkbox.js';

/**
 * This will toggle the checkbox.
 *
 * @param {object} parent
 * @param {object} checkbox
 * @returns {void}
 */
const toggleCheckbox = (parent, checkbox) =>
{
	const isSelected = parent.toggleAllSelectedRows();
	checkbox.state.checked =(!isSelected);
};

/**
 * CheckboxCol Atom
 *
 * Renders a checkbox column for the table.
 *
 * @param {object} props
 * @returns {object}
 */
export const CheckboxCol = (props) => (
	Th({ class: `cursor-pointer py-3 px-4 text-base w-10 ${props.class || '' }` }, [
		UseParent((parent) => new Checkbox({ class: 'mr-2', onChange: (checked, checkbox) => toggleCheckbox(parent, checkbox) })),
	])
);
