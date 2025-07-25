import { Div } from '@base-framework/atoms';
import { DateTime } from '@base-framework/base';
import { Button } from '../../../atoms/buttons/buttons.js';

/**
 * MonthSelector
 *
 * Renders a grid of month buttons.
 *
 * @param {object} props
 * @param {number} props.currentMonth
 * @param {number} props.currentYear
 * @param {function} props.onSelect
 * @returns {object}
 */
export const MonthSelector = ({ currentMonth, currentYear, onSelect }) =>
	Div(
		{ class: 'grid grid-cols-3 gap-2' },
		DateTime.monthNames.map(
			(name, idx) =>
				Button(
					{
						click: (e) =>
						{
							e.preventDefault();
							e.stopPropagation();
							onSelect(idx);
						},
						variant: currentMonth === idx ? 'primary' : 'ghost',
						'aria-label': `Select ${name} ${currentYear}`
					},
					name.substring(0,3)
				)
		)
	);
