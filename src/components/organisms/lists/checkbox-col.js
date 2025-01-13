import { Th } from '@base-framework/atoms';
import { Checkbox } from '../../atoms/form/inputs/checkbox.js';

/**
 * This will toggle the checkbox.
 *
 * @param {object} e
 * @param {object} parent
 * @returns {void}
 */
const toggleCheckbox = (e, parent) =>
{
    const isSelected = parent.toggleAllSelectedRows();
    e.target.checked =(!isSelected);
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
        new Checkbox({ class: 'mr-2', onChange: toggleCheckbox }),
    ])
);
