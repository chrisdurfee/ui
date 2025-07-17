import { Div, OnState } from '@base-framework/atoms';
import { Component, Data, DateTime } from '@base-framework/base';
import { FormatDate } from '../utils.js';
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
			current: {
				date: now.getDate(),
				month: initialMonth,
				year: initialYear
			}
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
	 * @returns {{view:string,selecting:string,start:string|null,end:string|null}}
	 */
	setupStates()
	{
		return {
			view: 'calendar', // 'calendar', 'months', or 'years'
			selecting: 'start',
			start: this.startDate,
			end: this.endDate
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
		console.log('handleClick called with:', isoDate);
		console.log('Current state:', this.state);

		if (this.state.selecting === 'start')
		{
			this.state.start = isoDate;
			this.state.end = null;
			this.state.selecting = 'end';
		}
		else
		{
			// If end date is before start date, swap them
			if (this.state.start && isoDate < this.state.start)
			{
				this.state.end = this.state.start;
				this.state.start = isoDate;
			}
			else
			{
				this.state.end = isoDate;
			}

			this.state.selecting = 'start';

			if (typeof this.onRangeSelect === 'function')
			{
				this.onRangeSelect(this.state.start, this.state.end);
			}
		}

		console.log('New state:', this.state);
	}

	/**
	 * Update current month/year in data.
	 *
	 * @param {{month:number,year:number}} obj
	 * @returns {void}
	 */
	setCurrent({ month, year })
	{
		const d = this.data.current;
		d.month = (month + 12) % 12;
		d.year = year + (month < 0 ? -1 : month > 11 ? 1 : 0);

		this.data.monthName = this.getMonthName(d.month);
	}

	/**
	 * Render the range calendar.
	 *
	 * @returns {object}
	 */
	render()
	{
		const { today, current } = this.data;
		const { start, end, selecting } = this.state;
		const firstDay = new Date(current.year, current.month, 1).getDay();
		const daysInMonth = new Date(current.year, current.month + 1, 0).getDate();
		const cells = [];

		for (let i = 0; i < firstDay; i++)
		{
			cells.push(null);
		}

		for (let d = 1; d <= daysInMonth; d++)
		{
			const iso = FormatDate(current.year, current.month, d);
			const dateObj = new Date(current.year, current.month, d);
			const todayObj = new Date(today.year, today.month, today.date);
			const isBefore = dateObj < todayObj;
			const disabled = this.blockPriorDates && isBefore;
			const isStart = start === iso;
			const isEnd = end === iso;
			const isBetween = start && end && iso > start && iso < end;

			cells.push({
				day: d,
				iso,
				disabled,
				isStart,
				isEnd,
				isBetween,
				click: this.handleClick.bind(this, iso)
			});
		}

		return Div({ class: 'range-calendar bg-background border border-border rounded-lg shadow-md p-4 w-full max-w-sm' }, [
			RangeToggle({
				start,
				end,
				selecting,
				onSelectStart: () => this.state.selecting = 'start',
				onSelectEnd: () => this.state.selecting = 'end'
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
								},
								cells
							});
					}
				})
		]);
	}
}