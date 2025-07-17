import { Div, OnState } from '@base-framework/atoms';
import { Component, Data } from '@base-framework/base';
import { MonthSelector } from '../month-selector.js';
import { FormatDate } from '../utils.js';
import { YearSelector } from '../year-selector.js';
import { MonthCalendar } from './month-calendar.js';
import { RangeToggle } from './range-toggle.js';

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
		return new Data({
			today: {
				date: now.getDate(),
				month: now.getMonth(),
				year: now.getFullYear()
			},
			current: {
				date: now.getDate(),
				month: now.getMonth(),
				year: now.getFullYear()
			}
		});
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
		if (this.state.selecting === 'start')
		{
			this.state.start = isoDate;
			this.state.end = null;
			this.state.selecting = 'end';
		}
		else
		{
			this.state.end = isoDate;
			this.state.selecting = 'start';

			if (typeof this.onRangeSelect === 'function')
			{
				this.onRangeSelect(this.state.start, this.state.end);
			}
		}
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
			const dateObj = new Date(iso + 'T00:00:00');
			const isBefore = dateObj < new Date(today.year, today.month, today.date);
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
				onClick: (i) => this.handleClick(i)
			});
		}

		return Div({ class: 'range-calendar p-4 rounded-md border min-w-80' }, [
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
									currentMonth: this.data.current.month,
									currentYear: this.data.current.year,
									onSelect: (m) =>
									{
										this.setCurrentDate(m, this.data.current.year);
										this.state.view = 'calendar';
									}
								}
							);
						case 'years':
							return YearSelector(
								{
									currentMonth: this.data.current.month,
									currentYear: this.data.current.year,
									onSelect: (y) =>
									{
										this.setCurrentDate(this.data.current.month, y);
										this.state.view = 'calendar';
									}
								}
							);
						default:
							return MonthCalendar({
								current: this.data.current,
								today: this.data.today,
								select: (date) => this.selectDate(date),
								next: () => this.goToNextMonth(),
								previous: () => this.goToPreviousMonth(),
								blockPriorDates: this.blockPriorDates || false,
								onMonthClick: (e) =>
								{
									e.preventDefault();
									e.stopPropagation();

									this.state.view = 'months';
								},
								onYearClick: (e) =>
								{
									e.preventDefault();
									e.stopPropagation();

									this.state.view = 'years';
								}
							});
					}
				})
		]);
	}
}