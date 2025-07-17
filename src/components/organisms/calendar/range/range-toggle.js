import { Div, On } from '@base-framework/atoms';
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
		On('selecting', (selecting) => {

			const variant = selecting === 'start' ? 'primary' : 'outline';

			return Button({
				click: onSelectStart,
				variant,
				class: 'flex-1'
			}, [
				Div({ class: 'font-medium' }, WatchDate('current.start', 'Start Date'))
			]);
		}),
		On('selecting', (selecting) => {

			const variant = selecting === 'end' ? 'primary' : 'outline';

			return Button({
				click: onSelectEnd,
				variant,
				class: 'flex-1'
			}, [
				Div({ class: 'font-medium' }, WatchDate('current.end', 'End Date'))
			]);
		})
	]);

/**
 * Set up a watcher for date display
 *
 * @param {string} prop - The date property to watch (e.g., 'current.start')
 * @param {string} defaultValue - The default value to return if the date is null
 * @return {Array} - An array with the property name and a function to format the date
 */
const WatchDate = (prop, defaultValue) =>
{
	return [`[[${prop}]]`, (value) => {

		if (value === null || value === undefined)
		{
			return defaultValue;
		}

		return formatDateDisplay(value);
	}];
}

/**
 * Format date for display
 * @param {string} isoDate
 * @returns {string}
 */
const formatDateDisplay = (isoDate) =>
{
	const date = new Date(isoDate + 'T00:00:00');
	const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
	const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

	return `${days[date.getDay()]}, ${date.getDate()} ${months[date.getMonth()]}`;
};
