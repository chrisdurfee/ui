import { Div } from '@base-framework/atoms';
import { Button } from '../../../atoms/buttons/buttons.js';

/**
 * RangeToggle
 *
 * Renders start/end selection pills.
 *
 * @param {object} props
 * @param {string|null} props.start
 * @param {string|null} props.end
 * @param {string} props.selecting
 * @param {function} props.onSelectStart
 * @param {function} props.onSelectEnd
 * @returns {object}
 */
export const RangeToggle = ({ start, end, selecting, onSelectStart, onSelectEnd }) =>
	Div({ class: 'flex space-x-2 mb-4' }, [
		Button({
			click: () => {
				console.log('Start button clicked');
				onSelectStart();
			},
			variant: selecting === 'start' ? 'default' : 'outline',
			class: 'flex-1 text-left justify-start px-3 py-2 text-sm font-medium rounded-md border min-h-[2.5rem] flex flex-col items-start'
		}, [
			Div({ class: 'text-xs text-muted-foreground mb-1' }, 'Start'),
			Div({ class: 'font-medium' }, start ? formatDateDisplay(start) : 'Select start')
		]),
		Button({
			click: () => {
				console.log('End button clicked');
				onSelectEnd();
			},
			variant: selecting === 'end' ? 'default' : 'outline',
			class: 'flex-1 text-left justify-start px-3 py-2 text-sm font-medium rounded-md border min-h-[2.5rem] flex flex-col items-start'
		}, [
			Div({ class: 'text-xs text-muted-foreground mb-1' }, 'End'),
			Div({ class: 'font-medium' }, end ? formatDateDisplay(end) : 'Select end')
		])
	]);

/**
 * Format date for display
 * @param {string} isoDate
 * @returns {string}
 */
const formatDateDisplay = (isoDate) => {
	const date = new Date(isoDate + 'T00:00:00');
	const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
	const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

	return `${days[date.getDay()]}, ${date.getDate()} ${months[date.getMonth()]}`;
};
