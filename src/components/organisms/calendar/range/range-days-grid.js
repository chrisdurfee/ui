import { Div } from '@base-framework/atoms';
import { RangeDayCell } from './range-day-cell.js';

/**
 * RangeDaysGrid
 *
 * Renders the grid of date cells.
 *
 * @param {object} props
 * @param {Array<object|null>} props.cells
 * @returns {object}
 */
export const RangeDaysGrid = ({ cells }) =>
	Div({ class: 'grid grid-cols-7 gap-1' },
		cells.map((c, index) =>
			(!c) ? Div({ class: 'h-9' }) : RangeDayCell({
				day: c.day,
				iso: c.iso,
				disabled: c.disabled,
				isStart: c.isStart,
				isEnd: c.isEnd,
				isBetween: c.isBetween,
				click: c.click
			})
		)
	);
