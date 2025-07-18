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
 * @param {boolean} props.isOtherMonth
 * @param {function} props.click
 * @returns {object}
 */
export const RangeDayCell = ({ day, iso, disabled, isStart, isEnd, isBetween, isOtherMonth, click }) =>
{
	let variant = 'ghost';
	let additionalClasses = '';

	if (isStart || isEnd)
	{
		variant = 'default';
		additionalClasses = 'bg-primary text-primary-foreground hover:bg-primary/90';
	}
	else if (isBetween)
	{
		additionalClasses = 'bg-accent text-accent-foreground hover:bg-accent/80';
	}

	if (disabled)
	{
		additionalClasses += ' opacity-50 cursor-not-allowed';
	}

	if (isOtherMonth)
	{
		additionalClasses += ' text-muted-foreground opacity-50';
	}

	return Button(
		{
			class: `flex items-center justify-center p-0 text-sm font-medium rounded-md transition-colors ${additionalClasses}`,
			variant,
			disabled,
			click: (e) =>
			{
				e.preventDefault();
				e.stopPropagation();

				if (!disabled)
				{
					click();
				}
			}
		},
		day.toString()
	);
};