import { Div } from '@base-framework/atoms';
import { Button } from '../../atoms/buttons/buttons.js';

/**
 * YearSelector
 *
 * Renders a grid of year buttons (101 years around current).
 *
 * @param {object} props
 * @param {number} props.currentMonth
 * @param {number} props.currentYear
 * @param {function} props.onSelect
 * @returns {object}
 */
export const YearSelector = ({ currentMonth, currentYear, onSelect }) =>
{
	const start = currentYear - 50;
	const years = Array.from({ length: 101 }, (_, i) => start + i);

	return Div(
		{ class: 'grid grid-cols-4 gap-2 overflow-y-auto max-h-72' },
		years.map(
			(yr) =>
				Button(
					{
						click: (e) =>
                        {
                            e.preventDefault();
                            e.stopPropagation();

                            onSelect(yr);
                        },
						variant: (yr === currentYear ? 'primary' : 'ghost'),
						'aria-label': `Select ${yr}`
					},
					yr.toString()
				)
		)
	);
};