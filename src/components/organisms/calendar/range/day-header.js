import { Div } from '@base-framework/atoms';

/**
 * DayHeader
 *
 * Renders one weekday label cell.
 *
 * @param {string} day
 * @returns {object}
 */
export const DayHeader = (day) =>
	Div({ class: 'h-9 flex items-center justify-center font-medium' }, day);
