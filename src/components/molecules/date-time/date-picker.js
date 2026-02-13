import { Button, Div, I, Input, OnStateOpen } from '@base-framework/atoms';
import { DateTime, Events } from '@base-framework/base';
import { VeilJot } from '../../atoms/veil.js';
import { Icons } from '../../icons/icons.js';
import { Calendar } from '../../organisms/calendar/calendar.js';
import { PopOver } from '../popover.js';

/**
 * Formats a numeric string into mm/dd/yyyy format.
 *
 * @param {string} cleanValue - Numeric string (digits only)
 * @returns {string} Formatted date string
 */
const formatDateInput = (cleanValue) =>
{
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
	return formattedValue;
};

/**
 * Validates and converts a date input to ISO format.
 *
 * @param {string} cleanValue - Numeric string (8 digits: mmddyyyy)
 * @returns {string|null} ISO date string (yyyy-mm-dd) or null if invalid
 */
const validateAndFormatDate = (cleanValue) =>
{
	if (cleanValue.length !== 8)
	{
		return null;
	}

	const month = parseInt(cleanValue.substring(0, 2), 10);
	const day = parseInt(cleanValue.substring(2, 4), 10);
	const year = parseInt(cleanValue.substring(4, 8), 10);

	if (month >= 1 && month <= 12 && day >= 1 && day <= 31 && year >= 1900)
	{
		return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
	}

	return null;
};

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
		onState: ['selectedDate', (value) => (value ? DateTime.format('standard', value) : '')]
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
					class: 'shrink-0 hover:bg-muted/50 rounded p-1 cursor-pointer',
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
 * @returns {Component|null}
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
	 * Handles direct input changes and formats the date.
	 *
	 * @param {Event} e
	 */
	handleInputChange(e)
	{
		// @ts-ignore
		const inputValue = e.target.value;
		const cleanValue = inputValue.replace(/\D/g, ''); // Remove non-digits

		// Format as mm/dd/yyyy
		// @ts-ignore
		e.target.value = formatDateInput(cleanValue);

		// If we have a complete date, validate and update state
		const dateString = validateAndFormatDate(cleanValue);
		if (dateString)
		{
			this.state.selectedDate = dateString;
			this.input.value = dateString;
			Events.trigger('change', this.input);

			if (typeof this.onChange === 'function')
			{
				this.onChange(dateString);
			}
		}
	},

	/**
	 * Handles input focus - select all text for easy editing.
	 *
	 * @param {Event} e
	 */
	handleInputFocus(e)
	{
		// @ts-ignore
		e.target.select();
	},

	/**
	 * Handles date selection from calendar.
	 *
	 * @param {string} date
	 */
	handleDateSelect(date)
	{
		this.state.selectedDate = date;
		this.state.open = false;
		this.input.value = date;
		Events.trigger('change', this.input);

		if (typeof this.onChange === 'function')
		{
			this.onChange(date);
		}
	},

	/**
	 * Toggles the calendar popover.
	 *
	 * @param {Event} e
	 * @param {object} context
	 */
	toggleOpen(e, { state })
	{
		state.toggle('open');
	},

	/**
	 * Renders the DatePicker component.
	 *
	 * @returns {object}
	 */
	render()
	{
		return Div(
			{ class: 'relative w-full max-w-[320px]' },
			[
				DateInputContainer({
					toggleOpen: this.toggleOpen.bind(this),
					bind: this.bind,
					required: this.required,
					handleInputChange: this.handleInputChange.bind(this),
					handleInputFocus: this.handleInputFocus.bind(this),
					placeholder: this.placeholder
				}),
				CalendarContainer({
					handleDateSelect: this.handleDateSelect.bind(this),
					blockPriorDates: this.blockPriorDates || false
				})
			]
		);
	}
});

export default DatePicker;
