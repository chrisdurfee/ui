import { FormatDate } from '../utils.js';
import { DayCell } from './day-cell.js';

/**
 * This will check if the date is today.
 *
 * @param {number} day
 * @param {number} month
 * @param {number} year
 * @param {object} today
 * @returns {boolean}
 */
const isDateToday = (day, month, year, today) =>
{
	return (
		day === today.date &&
		month === today.month &&
		year === today.year
	);
};

/**
 * This will create the calendar cells.
 *
 * If `blockPriorDates` is true, any day < today's date is disabled.
 *
 * @param {object} current
 * @param {object} today
 * @param {function} selectCallBack
 * @param {boolean} blockPriorDates
 * @returns {object[]}
 */
export const CalendarCells = (current, today, selectCallBack, blockPriorDates = false) =>
{
	const { year, month } = current;
	const selectedDate = FormatDate(year, month, current.date);

	const firstDay = new Date(year, month, 1).getDay();
	const daysInMonth = new Date(year, month + 1, 0).getDate();
	const prevMonthDays = new Date(year, month, 0).getDate();

	const cells = [];

	const prevMonth = month === 0 ? 11 : month - 1;
	const prevYear = month === 0 ? year - 1 : year;

	// Previous month's last days
	for (let i = firstDay - 1; i >= 0; i--)
	{
		const dayNum = prevMonthDays - i;
		const isToday = isDateToday(dayNum, prevMonth, prevYear, today);

		// If blocking prior dates, see if this date is before "today"
		const isBeforeToday = new Date(prevYear, prevMonth, dayNum) < new Date(today.year, today.month, today.date);
		const disabled = blockPriorDates && isBeforeToday;

		cells.push(
			DayCell({
				day: dayNum,
				currentDate: selectedDate,
				date: FormatDate(prevYear, prevMonth, dayNum),
				isToday,
				isOutsideMonth: true,
				select: selectCallBack,
				disabled
			})
		);
	}

	// Current month's days
	for (let day = 1; day <= daysInMonth; day++)
	{
		const isToday = isDateToday(day, month, year, today);

		const isBeforeToday = new Date(year, month, day) < new Date(today.year, today.month, today.date);
		const disabled = blockPriorDates && isBeforeToday;

		cells.push(
			DayCell({
				day,
				currentDate: selectedDate,
				date: FormatDate(year, month, day),
				isToday,
				isOutsideMonth: false,
				select: selectCallBack,
				disabled
			})
		);
	}

	// Next month's first days to fill the last row
	const nextMonth = month === 11 ? 0 : month + 1;
	const nextYear = month === 11 ? year + 1 : year;
	const totalCells = cells.length;
	const nextMonthDays = (7 - (totalCells % 7)) % 7;

	for (let i = 1; i <= nextMonthDays; i++)
	{
		const isToday = isDateToday(i, nextMonth, nextYear, today);

		const isBeforeToday = new Date(nextYear, nextMonth, i) < new Date(today.year, today.month, today.date);
		const disabled = blockPriorDates && isBeforeToday;

		cells.push(
			DayCell({
				day: i,
				currentDate: selectedDate,
				date: FormatDate(nextYear, nextMonth, i),
				isToday,
				isOutsideMonth: true,
				select: selectCallBack,
				disabled
			})
		);
	}

	return cells;
};