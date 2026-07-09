import { Button, Div, Input, OnStateOpen } from '@base-framework/atoms';
import { Events } from '@base-framework/base';
import { VeilJot } from '../../atoms/veil.js';
import { MaterialSymbols } from '../../icons/material-symbols.js';
import { MaterialIcon } from '../../atoms/material-icon.js';
import { PopOver } from '../popover.js';

/**
 * Formats a numeric string into hh:mm format.
 *
 * @param {string} inputValue - Numeric string (digits only)
 * @returns {string} Formatted time string
 */
function formatTimeInput(inputValue)
{
	let formattedValue = '';
	if (inputValue.length > 0)
	{
		formattedValue = inputValue.substring(0, 2);
		if (inputValue.length > 2)
		{
			formattedValue += ':' + inputValue.substring(2, 4);
		}
	}
	return formattedValue;
}

/**
 * Converts 24-hour time input to 12-hour format with AM/PM.
 *
 * @param {string} inputValue - Numeric string (4 digits: hhmm)
 * @returns {{ formattedTime: string|null, hour: string|null, minute: string|null, meridian: string|null }}
 */
function convertTo12HourFormat(inputValue)
{
	if (inputValue.length < 4)
	{
		return { formattedTime: null, hour: null, minute: null, meridian: null };
	}

	const hour = parseInt(inputValue.substring(0, 2), 10);
	const minute = parseInt(inputValue.substring(2, 4), 10);

	if (hour < 0 || hour > 23 || minute < 0 || minute > 59)
	{
		return { formattedTime: null, hour: null, minute: null, meridian: null };
	}

	let displayHour = hour;
	let meridian = 'AM';

	if (hour === 0)
	{
		displayHour = 12;
	}
	else if (hour > 12)
	{
		displayHour = hour - 12;
		meridian = 'PM';
	}
	else if (hour === 12)
	{
		meridian = 'PM';
	}

	const formattedTime = `${displayHour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')} ${meridian}`;

	return {
		formattedTime,
		hour: displayHour.toString().padStart(2, '0'),
		minute: minute.toString().padStart(2, '0'),
		meridian
	};
}

/**
 * Hidden input for the TimePicker.
 *
 * @param {object} props
 * @returns {object}
 */
function HiddenInput({ bind, required })
{
	return Input({
		cache: 'input',
		class: 'opacity-0 absolute top-0 left-0 w-full h-full pointer-events-none',
		bind,
		required
	});
}

/**
 * Visible input for direct time typing.
 *
 * @param {object} props
 * @returns {object}
 */
function TimeInput({ placeholder, handleInputChange, handleInputFocus })
{
	return Input({
		cache: 'timeInput',
		class: 'flex-1 bg-transparent outline-none placeholder:text-muted-foreground border-0',
		placeholder: placeholder || 'hh:mm AM/PM',
		input: handleInputChange,
		focus: handleInputFocus,
		onState: ['selectedTime', (value) => value || '']
	});
}

/**
 * Container that holds the time input and clock button.
 *
 * @param {object} props
 * @returns {object}
 */
function TimeInputContainer({ bind, required, toggleOpen, handleInputChange, handleInputFocus, placeholder })
{
	return Div(
		{
			class: 'relative flex items-center gap-2 w-full justify-between border bg-input hover:bg-muted rounded-md h-10 pr-4 py-2',
		},
		[
			HiddenInput({ bind, required }),
			TimeInput({ placeholder, handleInputChange, handleInputFocus }),
			Button(
				{
					class: 'shrink-0 hover:bg-muted/50 rounded p-1 cursor-pointer',
					click: toggleOpen,
				},
				[
					MaterialIcon({ name: MaterialSymbols.schedule, size: 'sm' })
				]
			)
		]
	);
}

/**
 * A generic time-column that lists hours, minutes, or meridians.
 *
 * @param {object} props
 * @returns {object}
 */
function TimeColumn({ items, handleTimeSelect, state, stateValue, pad = false })
{
	return Div(
		{ class: 'flex flex-col max-h-[200px] overflow-y-auto' },
		items.map((item) =>
		{
			let displayItem = pad
				? item.toString().padStart(2, '0')
				: item.toString();

			return Button({
				text: displayItem,
				class: 'hover:bg-muted/50 rounded-md pr-2 py-1',
				click: () => handleTimeSelect({ [stateValue]: displayItem }),
				onState: [state, stateValue, { 'bg-muted': displayItem }]
			});
		})
	);
}

/**
 * Container and wrapper logic for the time columns (Hours, Minutes, AM/PM).
 *
 * @param {object} props
 * @returns {object}
 */
function TimeContainer({ handleTimeSelect })
{
	return OnStateOpen((value, ele, parent) =>
		new PopOver(
			{
				cache: 'dropdown',
				parent: parent,
				button: parent.panel,
				size: 'fit'
			},
			[
				Div(
					{ class: 'flex flex-auto flex-col border rounded-md shadow-md' },
					[
						Div(
							{ class: 'grid grid-cols-3 gap-2 p-4 text-center max-h-[220px] min-w-[240px]' },
							[
								// Hours column
								TimeColumn({
									items: Array.from({ length: 12 }, (_, i) => i + 1),
									handleTimeSelect,
									state: parent.state,
									stateValue: 'hour',
									pad: true
								}),
								// Minutes column
								TimeColumn({
									items: Array.from({ length: 60 }, (_, i) => i),
									handleTimeSelect,
									state: parent.state,
									stateValue: 'minute',
									pad: true
								}),
								// AM/PM column
								TimeColumn({
									items: ['AM', 'PM'],
									handleTimeSelect,
									state: parent.state,
									stateValue: 'meridian'
								})
							]
						)
					]
				)
			]
		)
	);
}

/**
 * Parses a time string (e.g., "02:30 PM", "14:00:00") and returns hour, minute, meridian.
 *
 * @param {string|null} time
 * @returns {{ hour: string|null, minute: string|null, meridian: string|null }}
 */
function parseAndSetTime(time)
{
	if (!time)
	{
		return { hour: null, minute: null, meridian: null };
	}

	// Regex to match "HH:MM AM/PM", "HH:MM:SS AM/PM", or 24-hour time "HH:MM:SS" or "HH:MM"
	const timeRegex = /^(\d{1,2}):(\d{2})(?::(\d{2}))?\s?(AM|PM)?$/i;
	const match = time.match(timeRegex);

	if (!match)
	{
		return { hour: null, minute: null, meridian: null };
	}

	let [, parsedHour, parsedMinute, , parsedMeridian] = match;
	let hour = parseInt(parsedHour, 10);
	let minute = parseInt(parsedMinute, 10);

	// Validate hour and minute
	if (hour < 0 || hour > 23 || minute < 0 || minute > 59)
	{
		return { hour: null, minute: null, meridian: null };
	}

	// If meridian is missing, convert from 24-hour format
	if (!parsedMeridian)
	{
		if (hour === 0)
		{
			parsedMeridian = 'AM';
			hour = 12;
		}
		else if (hour < 12)
		{
			parsedMeridian = 'AM';
		}
		else if (hour === 12)
		{
			parsedMeridian = 'PM';
		}
		else
		{
			parsedMeridian = 'PM';
			hour -= 12;
		}
	}
	else
	{
		// Handle user-provided AM/PM
		parsedMeridian = parsedMeridian.toUpperCase();
		if (parsedMeridian === 'PM' && hour < 12)
		{
			hour += 12;
		}
		else if (parsedMeridian === 'AM' && hour === 12)
		{
			hour = 12;
		}
	}

	return {
		hour: hour.toString().padStart(2, '0'),
		minute: minute.toString().padStart(2, '0'),
		meridian: parsedMeridian
	};
}

/**
 * TimePicker Atom
 *
 * This will create a time picker component.
 *
 * @returns {Component}
 */
export const TimePicker = VeilJot(
{
	/**
	 * The initial shallow state of the TimePicker.
	 *
	 * @member {object} state
	 */
	state()
	{
		const selectedTime = this.selectedTime ?? null;
		const { hour, minute, meridian } = parseAndSetTime(selectedTime);

		return {
			selectedTime,
			open: false,
			hour,
			minute,
			meridian
		};
	},

	/**
	 * Updates the state after the input is rendered.
	 *
	 * @returns {void}
	 */
	after()
	{
		if (this.input.value)
		{
			const { hour, minute, meridian } = parseAndSetTime(this.input.value);

			this.state.set({
				hour,
				minute,
				meridian,
				selectedTime: this.input.value
			});
		}
	},

	/**
	 * Toggles the time picker popover.
	 *
	 * @param {Event} e
	 * @param {object} context
	 */
	toggleOpen(e, { state })
	{
		state.toggle('open');
	},

	/**
	 * Handles direct input changes and formats the time.
	 *
	 * @param {Event} e
	 */
	handleInputChange(e)
	{
		// @ts-ignore
		let inputValue = e.target.value.replace(/[^\d]/g, ''); // Remove non-digits

		// Format as hh:mm
		let formattedValue = formatTimeInput(inputValue);

		// If we have a complete time (4 digits), add AM/PM based on hour
		const result = convertTo12HourFormat(inputValue);
		if (result.formattedTime)
		{
			formattedValue = result.formattedTime;

			// Update the component state
			this.state.set({
				hour: result.hour,
				minute: result.minute,
				meridian: result.meridian,
				selectedTime: result.formattedTime
			});

			this.input.value = result.formattedTime;
			Events.trigger('change', this.input);

			if (typeof this.change === 'function')
			{
				this.change(result.formattedTime);
			}
		}

		// @ts-ignore
		e.target.value = formattedValue;
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
	 * Handles time selection from the picker columns.
	 *
	 * @param {object} params
	 */
	handleTimeSelect({ hour, minute, meridian })
	{
		if (hour) this.state.hour = hour;
		if (minute) this.state.minute = minute;
		if (meridian) this.state.meridian = meridian;

		if (this.state.hour && this.state.minute && this.state.meridian)
		{
			const formattedTime = `${this.state.hour}:${this.state.minute} ${this.state.meridian}`;
			this.state.selectedTime = formattedTime;
			this.state.open = false;
			this.input.value = formattedTime;
			Events.trigger('change', this.input);

			if (typeof this.change === 'function')
			{
				this.change(formattedTime);
			}
		}
	},

	/**
	 * Renders the TimePicker component.
	 *
	 * @returns {object}
	 */
	render()
	{
		return Div(
			{ class: 'relative w-full max-w-[320px]' },
			[
				TimeInputContainer({
					toggleOpen: this.toggleOpen.bind(this),
					bind: this.bind,
					required: this.required,
					handleInputChange: this.handleInputChange.bind(this),
					handleInputFocus: this.handleInputFocus.bind(this),
					placeholder: this.placeholder
				}),
				TimeContainer({
					handleTimeSelect: this.handleTimeSelect.bind(this)
				})
			]
		);
	}
});

export default TimePicker;