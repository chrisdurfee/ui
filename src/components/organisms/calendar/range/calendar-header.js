import { Div } from '@base-framework/atoms';
import { Button } from '../../../atoms/buttons/buttons.js';
import { NavigationButton } from './navigation-button.js';

/**
 * CalendarHeader
 *
 * Renders month and year ghost‐buttons plus prev/next controls.
 *
 * @param {object} props
 * @param {function} props.onMonthClick
 * @param {function} props.onYearClick
 * @param {function} props.next
 * @param {function} props.previous
 * @returns {object}
 */
export const CalendarHeader = ({ onMonthClick, onYearClick, next, previous }) =>
	Div({ class: 'flex items-center justify-center space-x-2 relative min-h-12 text-sm font-medium' }, [
		Button({ click: onMonthClick, variant: 'ghost', 'aria-label': 'Select month' }, '[[monthName]]'),
		Button({ click: onYearClick, variant: 'ghost', 'aria-label': 'Select year' }, '[[current.year]]'),
		NavigationButton({ label: 'Previous', click: previous }),
		NavigationButton({ label: 'Next', click: next })
	]);

export default CalendarHeader;