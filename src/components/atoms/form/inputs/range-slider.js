import { Div, Input, UseParent } from '@base-framework/atoms';
import { Veil, VeilJot } from '../../veil.js';
import { disabledClass, focusClass } from './input-classes.js';

/**
 * RangeSlider
 *
 * Creates a range slider with a custom style matching the provided design.
 *
 * @type {typeof Veil}
 */
export const RangeSlider = VeilJot(
{
	/**
	 * This will create the initial state of the RangeSlider.
	 *
	 * @returns {object}
	 */
	state()
	{
		return {
			value: this.value ?? 0,
			min: this.min ?? 0,
			max: this.max ?? 100,
			filledPercentage: this.getFillPercentage(this.value),
		};
	},

	/**
	 * This will get the fill percentage of the range slider.
	 *
	 * @param {number} value
	 * @returns {number}
	 */
	getFillPercentage(value)
	{
		return ((value - this.min) / (this.max - this.min)) * 100;
	},

	/**
	 * This will render the RangeSlider component.
	 *
	 * @returns {object}
	 */
	render()
	{
		return Div({ class: 'relative w-full h-4 flex items-center' }, [
			// Track
			Div({ class: 'absolute h-2 w-full rounded-full bg-muted' }),

			UseParent(({ state }) => ([
				// Filled Track
				Div({
					class: 'absolute h-2 bg-primary rounded-full',
					style: ['width: [[filledPercentage]]%', state],
				}),

				// Thumb
				Div({
					class: `
						absolute block h-5 w-5 rounded-full border-2 border-primary bg-background
						ring-offset-background transition-colors focus-visible:outline-none
						focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2
						disabled:pointer-events-none disabled:opacity-50 transform -translate-x-1/2
					`.trim(),
					style: ['left: [[filledPercentage]]%', state],
				}),

				// Hidden Range Input
				Input({
					type: 'range',
					min: ['[[min]]', state],
					max: ['[[max]]', state],
					value: ['[[value]]', state],
					// Incorporate your new classes here
					class: `
						absolute w-full h-full opacity-0 cursor-pointer
						${focusClass}
						${disabledClass}
						${this.class || ''}
					`.trim(),
					bind: this.bind,
					input: (e) =>
					{
						const value = Number(e.target.value);
						this.state.value = value;
						this.state.filledPercentage = this.getFillPercentage(value);

						if (typeof this.change === 'function')
						{
							this.change(value);
						}
					},
				})
			]))
		]);
	},
});

export default RangeSlider;