import { Div } from '@base-framework/atoms';
import { Atom } from '@base-framework/base';
import CalendarHeader from './calendar-header.js';
import { DaysOfWeekHeader } from './days-of-week-header.js';
import { RangeDaysGrid } from './range-days-grid.js';

/**
 * Create a month calendar component.
 *
 * @param {object} props
 * @param {function} props.onMonthClick
 * @param {function} props.onYearClick
 * @param {function} props.next
 * @param {function} props.previous
 * @param {Array} props.cells
 * @returns {object}
 */
export const MonthCalendar = Atom((props, children) => (
	Div({ class: 'fex flex-auto flex-col' }, [
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
					RangeDaysGrid({ cells: props.cells })
				]
			]
		})
	])
));