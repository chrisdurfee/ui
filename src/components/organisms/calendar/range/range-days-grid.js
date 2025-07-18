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

	// Get previous month info for leading days
	const prevMonth = current.month === 0 ? 11 : current.month - 1;
	const prevYear = current.month === 0 ? current.year - 1 : current.year;
	const daysInPrevMonth = new Date(prevYear, prevMonth + 1, 0).getDate();

	// Get next month info for trailing days
	const nextMonth = current.month === 11 ? 0 : current.month + 1;
	const nextYear = current.month === 11 ? current.year + 1 : current.year;

	// Add cells for previous month's trailing days
	for (let i = firstDay - 1; i >= 0; i--)
	{
		const day = daysInPrevMonth - i;
		const iso = FormatDate(prevYear, prevMonth, day);
		const dateObj = new Date(prevYear, prevMonth, day);
		const todayObj = new Date(today.year, today.month, today.date);
		const isBefore = dateObj < todayObj;
		const disabled = blockPriorDates && isBefore;
		const isStart = start === iso;
		const isEnd = end === iso;
		const isBetween = start && end && iso > start && iso < end;

		cells.push({
			day,
			iso,
			disabled,
			isStart,
			isEnd,
			isBetween,
			isOtherMonth: true,
			click: () => onDateClick(iso)
		});
	}

	// Add cells for current month days
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
			isOtherMonth: false,
			click: () =>
			{
				console.log(iso);
				onDateClick(iso);
			}
		});
	}

	const totalCells = cells.length;
	const nextMonthDays = (7 - (totalCells % 7)) % 7;

	for (let d = 1; d <= nextMonthDays; d++)
	{
		const iso = FormatDate(nextYear, nextMonth, d);
		const dateObj = new Date(nextYear, nextMonth, d);
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
			isOtherMonth: true,
			click: () => onDateClick(iso)
		});
	}

	return Div({ class: 'grid grid-cols-7 gap-1' },
		cells.map((c, index) =>
			RangeDayCell({
				day: c.day,
				iso: c.iso,
				disabled: c.disabled,
				isStart: c.isStart,
				isEnd: c.isEnd,
				isBetween: c.isBetween,
				isOtherMonth: c.isOtherMonth,
				click: c.click
			})
		)
	);
};
