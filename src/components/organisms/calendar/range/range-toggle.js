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
	Div({ class: 'flex space-x-2 mb-3' }, [
		Button({ click: onSelectStart, variant: selecting === 'start' ? 'primary' : 'ghost' },
			start ? `Start: ${start}` : 'Select start'
		),
		Button({ click: onSelectEnd, variant: selecting === 'end' ? 'primary' : 'ghost' },
			end ? `End: ${end}` : 'Select end'
		)
	]);
