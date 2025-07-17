import { Div } from '@base-framework/atoms';
import { DayHeader } from './day-header.js';

/**
 * DaysOfWeekHeader
 *
 * Renders the weekday labels row.
 *
 * @returns {object}
 */
export const DaysOfWeekHeader = () =>
	Div({ class: 'grid grid-cols-7 gap-1 text-center text-xs font-medium text-muted-foreground mb-2' },
		['Su','Mo','Tu','We','Th','Fr','Sa'].map(DayHeader)
	);
