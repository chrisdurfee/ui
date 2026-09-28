import { Component, Dom, Events, Html } from "@base-framework/base";

/**
 * DelayComponent
 *
 * A component that adds a delay before removing itself from the DOM.
 *
 * @property {string} removingClass - The class name to be added before destruction.
 *
 * @class
 * @extends Component
 */
export class DelayComponent extends Component
{
	/**
	 * This will declare the props for the compiler.
	 *
	 * @returns {void}
	 */
	declareProps()
	{
		/**
		 * @member {string} removingClass
		 * @default ''
		 */
		this.removingClass = '';

		/**
		 * The max time (ms) to wait for the removing animation
		 * before the element is removed.
		 *
		 * @member {number} removeDelay
		 * @default 1000
		 */
		this.removeDelay = 1000;
	}

	/**
	 * This will remove the component from the DOM after a delay.
	 *
	 * @returns {void}
	 */
	remove()
	{
		/**
		 * prepareDestroy also removes the context.
		 */
		this.prepareDestroy();

		const panel = this.panel,
		className = this.removingClass;
		if (!className)
		{
			// @ts-ignore
			Html.removeElement(panel);
			return;
		}

		let removed = false;
		let timer = null;
		const removeElement = () =>
		{
			if (removed)
			{
				return;
			}

			removed = true;
			globalThis.clearTimeout(timer);
			// @ts-ignore
			Events.off('animationend', panel, removeElement);
			// @ts-ignore
			Html.removeElement(panel);
		};

		// @ts-ignore
		Dom.addClass(panel, className);
		// @ts-ignore
		Events.on('animationend', panel, removeElement);

		/**
		 * The element is still removed if the animation never
		 * ends (no animation, reduced motion, hidden tab).
		 */
		const delay = (typeof this.removeDelay === 'number' && this.removeDelay >= 0) ? this.removeDelay : 1000;
		timer = globalThis.setTimeout(removeElement, delay);
	}
}