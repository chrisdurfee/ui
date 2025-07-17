import { Div } from '@base-framework/atoms';
import { FormatDate } from '../utils.js';
import { RangeDayCell } from './range-day-cell.js';

/**
 * RangeDaysGrid
 *
 * Renders the grid of date cells.
 *
 * @param {object} props
 * @param {object} props.today - Today's date info
 * @param {object} props.current - Current month/year and selection info
 * @param {boolean} props.blockPriorDates - Whether to disable past dates
 * @param {function} props.onDateClick - Click handler for date cells
 * @returns {object}
 */
export const RangeDaysGrid = ({ today, current, blockPriorDates, onDateClick }) =>
{
	const { start, end } = current;
	const firstDay = new Date(current.year, current.month, 1).getDay();
	const daysInMonth = new Date(current.year, current.month + 1, 0).getDate();
	const cells = [];

	// Add empty cells for days before the first day of the month
	for (let i = 0; i < firstDay; i++)
	{
		cells.push(null);
	}

	// Add cells for each day of the month
	for (let d = 1; d <= daysInMonth; d++)
	{
		const iso = FormatDate(current.year, current.month, d);
		const dateObj = new Date(current.year, current.month, d);
		const todayObj = new Date(today.year, today.month, today.date);
		const isBefore = dateObj < todayObj;
		const disabled = blockPriorDates && isBefore;
		const isStart = start === iso;
		const isEnd = end === iso;
		const isBetween = start && end && iso > start && iso < end;

		cells.push({
			day: d,
			iso,
			disabled,
			isStart,
			isEnd,
			isBetween,
			click: () => onDateClick(iso)
		});
	}

	return Div({ class: 'grid grid-cols-7 gap-1' },
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
};
