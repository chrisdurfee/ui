import { Button, Div, I, Input, OnState, Span, UseParent } from '@base-framework/atoms';
import { Format } from '../../../utils/format/format.js';
import { Veil, VeilJot } from '../../atoms/veil.js';
import { Icons } from '../../icons/icons.js';
import { RangeCalendar } from '../../organisms/calendar/range/range-calendar.js';
import { PopOver } from '../popover.js';

/**
 * This will create a hidden input atom.
 *
 * @param {object} props
 * @returns {object}
 */
const HiddenImput = ({ bind, required }) => (
	Input({
		cache: 'input',
		class: 'opacity-0 absolute top-0 left-0 w-full h-full pointer-events-none',
		bind,
		required
	})
);

/**
 * This will toggle the open state of the calendar.
 *
 * @param {object} props
 * @returns {object}
 */
const CalendarButton = ({ bind, required, toggleOpen }) => (
	Button({
		class: 'relative flex items-center gap-2 w-full justify-between border border-input bg-input hover:bg-muted rounded-md h-10 px-4 py-2',
		click: toggleOpen,
	}, [
		HiddenImput({ bind, required }),
		UseParent(({ state }) =>
        {
            return [
                Span(Format.date(['[[start]]', state], 'Start Date')),
                Span(' - '),
                Span(Format.date(['[[end]]', state], 'End Date')),
            ];
        }),
		I({ html: Icons.calendar.days })
	])
);

/**
 * This will create the calendar container.
 *
 * @param {object} props
 * @returns {object}
 */
const CalendarContainer = ({ handleDateSelect, blockPriorDates }) => (
	OnState('open', (value, ele, parent ) => (!value)
		? null
		: new PopOver({
			cache: 'dropdown',
			parent: parent,
			button: parent.panel,
			size: 'xl'
		}, [
			new RangeCalendar({
				startDate: parent.state.start,
				endDate: parent.state.end,
				onRangeSelect: handleDateSelect,
				blockPriorDates
			})
		])
	)
);

/**
 * DateRangePicker Atom
 *
 * This will create a date picker component.
 *
 * @type {typeof Veil}
 */
export const DateRangePicker = VeilJot(
{
	/**
	 * The initial state of the DateRangePicker.
	 *
	 * @member {object} state
	 */
	state()
	{
		return {
			start: this.start ?? null,
			end: this.end ?? null,
			open: false
		};
	},

	/**
	 * This is added to check the input after the component is rendered.
	 * to see if the bind updated the input value.
	 *
	 * @returns {void}
	 */
	after()
	{
		// @ts-ignore
		if (this.input.value)
		{
            const dates = this.input.value.split('-');
			// @ts-ignore
			this.state.start = dates[0];
			this.state.end = dates[1];
		}
	},

	/**
	 * Renders the DatePicker component.
	 *
	 * @returns {object}
	 */
	render()
	{
		const toggleOpen = (e, { state }) => state.toggle('open');
		const handleDateSelect = (start, end) =>
		{
			this.state.start = start;
			this.state.end = end;
			this.state.open = false;
			this.input.value = `${start}-${end}`;

			if (typeof this.onChange === 'function')
			{
				this.onChange({ start, end }, this.parent);
			}
		};

		return Div({ class: 'relative w-full max-w-[320px]' }, [
			CalendarButton({
				toggleOpen,
				bind: this.bind,
				required: this.required
			}),
			CalendarContainer({
				handleDateSelect,
				blockPriorDates: this.blockPriorDates || false
			})
		]);
	}
});

export default DateRangePicker;
