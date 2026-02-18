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
			// @ts-ignore
			onMonthClick: props.onMonthClick,
			// @ts-ignore
			onYearClick: props.onYearClick,
			// @ts-ignore
			next: props.next,
			// @ts-ignore
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
						// @ts-ignore
						today: props.today,
						// @ts-ignore
						current: props.current,
						// @ts-ignore
						blockPriorDates: props.blockPriorDates,
						// @ts-ignore
						onDateClick: props.onDateClick
					})
				]
			]
		})
	])
));
