import { Div } from '@base-framework/atoms';
import { Atom } from '@base-framework/base';
import CalendarHeader from './calendar-header.js';
import { DaysOfWeekHeader } from './days-of-week-header.js';
import { RangeDaysGrid } from './range-days-grid.js';

/**
 * Create a month calendar component.
 *
 * @param {object} props
 * @param {string} props.monthName
 * @param {number} props.year
 * @param {object} props.today
 * @param {object} props.current
 * @param {boolean} props.blockPriorDates
 * @param {function} props.onDateClick
 * @param {function} props.onMonthClick
 * @param {function} props.onYearClick
 * @param {function} props.next
 * @param {function} props.previous
 * @returns {object}
 */
export const MonthCalendar = Atom((props, children) => (
	Div({ class: 'flex flex-auto flex-col' }, [
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
					DaysOfWeekHeader(),
					RangeDaysGrid({
						today: props.today,
						current: props.current,
						blockPriorDates: props.blockPriorDates,
						onDateClick: props.onDateClick
					})
				]
			]
		})
	])
));