import { Div } from '@base-framework/atoms';
import { CalendarCells } from './calendar-cells.js';
import { CalendarHeader } from './calendar-header.js';
import { DayHeader } from './day-header.js';

/**
 * This will create the month header row.
 *
 * @returns {object}
 */
const HeaderCells = () =>
{
	const daysOfWeek = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
	return daysOfWeek.map(DayHeader);
};

/**
 * This will create the month calendar.
 *
 * If `props.blockPriorDates` is true, any date before today's date is disabled.
 *
 * @param {object} props
 * @returns {object}
 */
export const MonthCalendar = (props) => (
    Div({ class: 'rdp w-full space-y-1' }, [
		CalendarHeader({
			onMonthClick: props.onMonthClick,
			onYearClick: props.onYearClick,
			next: props.next,
			previous: props.previous
		}),
		Div({
			class: 'flex flex-auto flex-col w-full',
			onSet: [
				'currentDate',
				() =>
				[
					Div({ class: 'grid grid-cols-7' }, HeaderCells()),
					Div(
						{ class: 'grid grid-cols-7' },
						CalendarCells(
							props.current,
							props.today,
							props.select,
							props.blockPriorDates
						)
					)
				]
			]
		})
	])
);