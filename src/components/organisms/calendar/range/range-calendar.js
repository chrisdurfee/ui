import { Div, OnState } from '@base-framework/atoms';
import { Component, Data, DateTime } from '@base-framework/base';
import { pad } from '../utils.js';
import { MonthCalendar } from './month-calendar.js';
import { MonthSelector } from './month-selector.js';
import { RangeToggle } from './range-toggle.js';
import { YearSelector } from './year-selector.js';

/**
 * RangeCalendar
 *
 * A calendar component for selecting a start and end date.
 *
 * @class RangeCalendar
 */
export class RangeCalendar extends Component
{
	/**
	 * Declare compiler props.
	 *
	 * @returns {void}
	 */
	declareProps()
	{
		/**
		 * Initial start ISO date (YYYY-MM-DD).
		 * @member {string|null} startDate
		 */
		this.startDate = null;

		/**
		 * Initial end ISO date (YYYY-MM-DD).
		 * @member {string|null} endDate
		 */
		this.endDate = null;

		/**
		 * Callback after both dates are chosen.
		 * @member {function|null} onRangeSelect
		 */
		this.onRangeSelect = null;

		/**
		 * Block dates before today.
		 * @member {boolean} blockPriorDates
		 */
		this.blockPriorDates = false;
	}

	/**
	 * Initialize reactive data for today and current view.
	 *
	 * @returns {Data}
	 */
	setData()
	{
		const now = new Date();
		const startMonth = this.startDate ? new Date(this.startDate + 'T00:00:00') : now;
		const initialMonth = startMonth.getMonth();
		const initialYear = startMonth.getFullYear();

		return new Data({
			today: {
				date: now.getDate(),
				month: now.getMonth(),
				year: now.getFullYear()
			},
			monthName: this.getMonthName(initialMonth),
			currentData: `${startMonth.getFullYear()}-${pad(startMonth.getMonth() + 1)}-${pad(startMonth.getDate())}`,
			current: {
				date: now.getDate(),
				month: initialMonth,
				year: initialYear,
				start: this.startDate,
				end: this.endDate
			},
			selecting: 'start'
		});
	}

	/**
	 * This will get the name of the month.
	 *
	 * @param {number} month
	 * @returns {string}
	 */
	getMonthName(month)
	{
		const monthNames = DateTime.monthNames;
		return monthNames[month];
	}

	/**
	 * Initialize component state.
	 *
	 * @returns {{view:string}}
	 */
	setupStates()
	{
		return {
			view: 'calendar' // 'calendar', 'months', or 'years'
		};
	}

	/**
	 * Handle a date cell click.
	 *
	 * @param {string} isoDate
	 * @returns {void}
	 */
	handleClick(isoDate)
	{
		if (this.data.selecting === 'start')
		{
			this.data.current.start = isoDate;
			this.data.current.end = null;
			this.data.selecting = 'end';

			const date = new Date(isoDate);
			// set current date to start date
			this.setContext({
				month: date.getMonth(),
				year: date.getFullYear(),
				date: date.getDate()
			});
		}
		else
		{
			// If end date is before start date, swap them
			if (this.data.current.start && isoDate < this.data.current.start)
			{
				this.data.current.end = this.data.current.start;
				this.data.current.start = isoDate;
			}
			else
			{
				this.data.current.end = isoDate;
			}

			this.data.selecting = 'start';

			// set current date to end date
			const date = new Date(isoDate);
			this.setContext({
				month: date.getMonth(),
				year: date.getFullYear(),
				date: date.getDate()
			});

			if (typeof this.onRangeSelect === 'function')
			{
				this.onRangeSelect(this.data.current.start, this.data.current.end);
			}
		}
	}

	/**
	 * Update current month/year in data.
	 *
	 * @param {object} obj
	 * @returns {void}
	 */
	setCurrent({ month, year, date = null })
	{
		const d = this.data.current;
		d.month = (month + 12) % 12;
		d.year = year + (month < 0 ? -1 : month > 11 ? 1 : 0);

		if (date !== null)
		{
			d.date = date;
		}

		this.data.monthName = this.getMonthName(d.month);
		this.data.currentDate = `${year}-${pad(month + 1)}-${pad(d.date)}`;
	}

	/**
	 * Render the range calendar.
	 *
	 * @returns {object}
	 */
	render()
	{
		const { today, current, selecting } = this.data;
		const { start, end } = current;

		return Div({ class: 'range-calendar bg-background border border-border rounded-lg shadow-md p-4 w-full max-w-sm' }, [
			RangeToggle({
				start,
				end,
				selecting,
				onSelectStart: () => this.data.selecting = 'start',
				onSelectEnd: () => this.data.selecting = 'end'
			}),
			OnState('view', (view) =>
				{
					switch (view)
					{
						case 'months':
							return MonthSelector(
								{
									currentMonth: current.month,
									currentYear:  current.year,
									onSelect: (m) =>
									{
										this.setCurrent({ month: m, year: current.year });
										this.state.view = 'calendar';
									}
								}
							);
						case 'years':
							return YearSelector(
								{
									currentYear: current.year,
									onSelect: (y) =>
									{
										this.setCurrent({ month: current.month, year: y });
										this.state.view = 'calendar';
									}
								}
							);
						default:
							return MonthCalendar({
								monthName: this.data.monthName,
								year: current.year,
								today,
								current,
								blockPriorDates: this.blockPriorDates,
								onDateClick: (iso) => this.handleClick(iso),
								onMonthClick: () => this.state.view = 'months',
								onYearClick: () => this.state.view = 'years',
								next: () =>
								{
									const current = this.data.current;
									const selectingDate = (current.month === 11)? { month: 0, year: current.year + 1 } : { month: current.month + 1, year: current.year };
									this.setCurrent(selectingDate);
								},
								previous: () =>
								{
									const current = this.data.current;
									const selectingDate = (current.month === 0)? { month: 11, year: current.year - 1 } : { month: current.month - 1, year: current.year };
									this.setCurrent(selectingDate);
								}
							});
					}
				})
		]);
	}
}