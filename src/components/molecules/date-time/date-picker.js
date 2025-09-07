import { Button, Div, I, Input, OnStateOpen } from '@base-framework/atoms';
import { Events } from '@base-framework/base';
import { Veil, VeilJot } from '../../atoms/veil.js';
import { Icons } from '../../icons/icons.js';
import { Calendar } from '../../organisms/calendar/calendar.js';
import { PopOver } from '../popover.js';

/**
 * This will create a hidden input atom for form binding.
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
 * This will create a visible input for direct typing.
 *
 * @param {object} props
 * @returns {object}
 */
const DateInput = ({ placeholder, handleInputChange, handleInputFocus }) => (
	Input({
		cache: 'dateInput',
		class: 'flex-1 bg-transparent outline-none placeholder:text-muted-foreground border-0',
		placeholder: placeholder || 'mm/dd/yyyy',
		input: handleInputChange,
		focus: handleInputFocus,
		onState: ['selectedDate', (value) =>
		{
			// Format the date for display in the input
			if (value)
			{
				const date = new Date(value);
				if (!isNaN(date.getTime()))
				{
					const month = (date.getMonth() + 1).toString().padStart(2, '0');
					const day = date.getDate().toString().padStart(2, '0');
					const year = date.getFullYear();
					return `${month}/${day}/${year}`;
				}
			}
			return '';
		}]
	})
);

/**
 * This will create the date input container with calendar button.
 *
 * @param {object} props
 * @returns {object}
 */
const DateInputContainer = ({ bind, required, toggleOpen, handleInputChange, handleInputFocus, placeholder }) => (
	Div(
		{
			class: 'relative flex items-center gap-2 w-full justify-between border bg-input hover:bg-muted rounded-md h-10 pr-4 py-2',
		},
		[
			HiddenImput({ bind, required }),
			DateInput({ placeholder, handleInputChange, handleInputFocus }),
			Button(
				{
					class: 'flex-shrink-0 hover:bg-muted/50 rounded p-1',
					click: toggleOpen,
				},
				[
					I({ html: Icons.calendar.days })
				]
			)
		]
	)
);

/**
 * This will create the calendar container.
 *
 * @param {object} props
 * @returns {object}
 */
const CalendarContainer = ({ handleDateSelect, blockPriorDates }) => (
	OnStateOpen((value, ele, parent) => (
		new PopOver({
			cache: 'dropdown',
			parent: parent,
			button: parent.panel,
			size: 'fit'
		}, [
			new Calendar({
				selectedDate: parent.state.selectedDate,
				selectedCallBack: handleDateSelect,
				blockPriorDates
			})
		]))
	)
);

/**
 * DatePicker Atom
 *
 * This will create a date picker component.
 *
 * @type {typeof Veil}
 */
export const DatePicker = VeilJot(
{
	/**
	 * The initial state of the DatePicker.
	 *
	 * @member {object} state
	 */
	state()
	{
		return {
			selectedDate: this.selectedDate ?? null,
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
			// @ts-ignore
			this.state.selectedDate = this.input.value;
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

		/**
		 * Handles direct input changes and formats the date.
		 */
		const handleInputChange = (e) =>
		{
			const inputValue = e.target.value;
			const cleanValue = inputValue.replace(/\D/g, ''); // Remove non-digits

			// Format as mm/dd/yyyy
			let formattedValue = '';
			if (cleanValue.length > 0)
			{
				formattedValue = cleanValue.substring(0, 2);
				if (cleanValue.length > 2)
				{
					formattedValue += '/' + cleanValue.substring(2, 4);
					if (cleanValue.length > 4)
					{
						formattedValue += '/' + cleanValue.substring(4, 8);
					}
				}
			}

			e.target.value = formattedValue;

			// If we have a complete date, validate and update state
			if (cleanValue.length === 8)
			{
				const month = parseInt(cleanValue.substring(0, 2), 10);
				const day = parseInt(cleanValue.substring(2, 4), 10);
				const year = parseInt(cleanValue.substring(4, 8), 10);

				if (month >= 1 && month <= 12 && day >= 1 && day <= 31 && year >= 1900)
				{
					const dateString = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
					this.state.selectedDate = dateString;
					this.input.value = dateString;
					Events.trigger('change', this.input);

					if (typeof this.onChange === 'function')
					{
						this.onChange(dateString);
					}
				}
			}
		};

		/**
		 * Handles input focus - select all text for easy editing.
		 */
		const handleInputFocus = (e) =>
		{
			e.target.select();
		};

		const handleDateSelect = (date) =>
		{
			this.state.selectedDate = date;
			this.state.open = false;
			this.input.value = date;
			Events.trigger('change', this.input);

			if (typeof this.onChange === 'function')
			{
				this.onChange(date);
			}
		};

		return Div(
			{ class: 'relative w-full max-w-[320px]' },
			[
				DateInputContainer({
					toggleOpen,
					bind: this.bind,
					required: this.required,
					handleInputChange,
					handleInputFocus,
					placeholder: this.placeholder
				}),
				CalendarContainer({
					handleDateSelect,
					blockPriorDates: this.blockPriorDates || false
				})
			]
		);
	}
});

export default DatePicker;
