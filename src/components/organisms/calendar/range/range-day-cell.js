import { Button } from '../../../atoms/buttons/buttons.js';

/**
 * RangeDayCell
 *
 * Renders one date cell for range selection.
 *
 * @param {object} props
 * @param {number} props.day
 * @param {string} props.iso
 * @param {boolean} props.disabled
 * @param {boolean} props.isStart
 * @param {boolean} props.isEnd
 * @param {boolean} props.isBetween
 * @param {function} props.onClick
 * @returns {object}
 */
export const RangeDayCell = ({ day, iso, disabled, isStart, isEnd, isBetween, onClick }) =>
{
	const cls = isStart
	? 'bg-primary text-primary-foreground'
	: isEnd
	? 'bg-primary text-primary-foreground'
	: isBetween
	? 'bg-muted text-foreground'
	: '';

	return Button(
		{
			class: 'flex items-center justify-center h-9 p-0 text-sm rounded-md ' + cls,
			disabled,
			click: () => !disabled && onClick(iso)
		},
		day.toString()
	);
};