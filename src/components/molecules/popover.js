import { Div } from '@base-framework/atoms';
import { Component, Data } from '@base-framework/base';
import { ensurePopoverApi, hidePopoverSafe } from '../../utils/popover-api.js';

/**
 * The min space between the popover and the viewport edge.
 *
 * @type {number}
 */
const EDGE_GAP = 8;

/**
 * This will clamp the x position so the container stays
 * inside the viewport.
 *
 * @param {number} x - The viewport x position.
 * @param {number} width - The container width.
 * @param {number} viewportWidth
 * @returns {number}
 */
export const clampX = (x, width, viewportWidth) =>
{
	const max = viewportWidth - width - EDGE_GAP;
	if (x > max)
	{
		x = max;
	}

	return (x < EDGE_GAP) ? EDGE_GAP : x;
};

/**
 * This will get the position of the element and
 * use the position and container to determine the
 * position of the container.
 *
 * @param {object} button
 * @param {object} container
 * @returns {object}
 */
export const getPosition = (button, container) =>
{
	const rect = button ? button.getBoundingClientRect() : { top: 0, bottom: 0, left: 0 };
	const containerRect = container.getBoundingClientRect();

	const PADDING = 10;
	const scrollX = globalThis.scrollX;
	const scrollY = globalThis.scrollY;

	// Initial position of the dropdown (clamped to the viewport)
	const x = clampX(rect.left, containerRect.width, globalThis.innerWidth) + scrollX;
	let y = rect.bottom + scrollY;

	// Space above and below the button
	const spaceBelow = globalThis.innerHeight - rect.bottom;
	const spaceAbove = rect.top;

	// Adjust position based on available space
	if (spaceBelow < containerRect.height && spaceAbove > spaceBelow)
	{
		// Move the dropdown above the button
		y = rect.top + scrollY - containerRect.height - PADDING;
	}
	else if (spaceBelow < containerRect.height)
	{
		// If there's not enough space, force it to fit below
		y = rect.bottom + scrollY - (containerRect.height - spaceBelow) - PADDING;
	}

	return { x, y };
};

/**
 * PopOver
 *
 * This will create a absolute cotnainer component.
 *
 * @export
 * @class PopOver
 * @extends {Component}
 */
export class PopOver extends Component
{
	/**
	 * This will set up the data.
	 *
	 * @returns {object}
	 */
	setData()
	{
		/**
		 * The parent data is shared so the children can bind to it.
		 * The position is not written to it; it is applied to the
		 * panel style directly (see updatePosition).
		 */
		// @ts-ignore
		return this.parent?.data || new Data();
	}

	/**
	 * This will get the class size.
	 *
	 * @returns {string}
	 */
	getSize()
	{
		// @ts-ignore
		const size = this.size || 'lg';
		switch (size)
		{
			// @ts-ignore
			case 'sm':
				return 'w-48';
			// @ts-ignore
			case 'md':
				return 'w-64';
			case 'lg':
				return 'w-[250px]';
			// @ts-ignore
			case 'xl':
				return 'w-96';
			// @ts-ignore
			case '2xl':
				return 'w-[400px]';
			// @ts-ignore
			case 'fit':
				return 'w-fit';
			// @ts-ignore
			case 'full':
				return 'w-full';
			default:
				return 'w-[250px]';
		}
	}

	/**
	 * This will render the modal component.
	 *
	 * @returns {object}
	 */
	render()
	{
		const size = this.getSize();
		// @ts-ignore
		const customClass = this.class || '';
		const bgClass = (customClass.includes('bg-')) ? '' : 'bg-popover';
		const roundedClass = (customClass.includes('rounded')) ? '' : 'rounded-md';

		return Div({
			class: `absolute inset-auto fadeIn mt-2 p-0 shadow-lg ${bgClass} ${roundedClass} min-h-12 max-w-[calc(100vw-1rem)] backdrop:bg-transparent text-inherit z-30 ${size} ${customClass}`,
			popover: 'manual',
			toggle: (e, { state }) => (e.newState === 'closed')? state.open = false : null
			// @ts-ignore
		}, this.children);
	}

	/**
	 * This will setup the states.
	 *
	 * @returns {object}
	 */
	setupStates()
	{
		// @ts-ignore
		const parent = this.parent;
		// @ts-ignore
		const id = parent.getId();

		return {
			open: {
				id,
				callBack: (state) =>
				{
					// @ts-ignore
					if (this.state.open === false)
					{
						// @ts-ignore
						this.destroy();
					}
				}
			}
		};
	}

	/**
	 * Updates the dropdown position.
	 *
	 * @returns {void}
	 */
	updatePosition()
	{
		// @ts-ignore
		const input = this.button ?? null;
		// @ts-ignore
		const dropdown = this.panel;
		if (!dropdown)
		{
			return;
		}

		const position = getPosition(input, dropdown);

		// @ts-ignore
		dropdown.style.top = position.y + 'px';
		// @ts-ignore
		dropdown.style.left = position.x + 'px';
	}

	/**
	 * This will update the position on the next animation
	 * frame. Repeated calls in the same frame are batched.
	 *
	 * @returns {void}
	 */
	schedulePosition()
	{
		// @ts-ignore
		if (this.positionFrame)
		{
			return;
		}

		const raf = globalThis.requestAnimationFrame;
		if (typeof raf !== 'function')
		{
			this.updatePosition();
			return;
		}

		// @ts-ignore
		this.positionFrame = raf(() =>
		{
			// @ts-ignore
			this.positionFrame = null;
			this.updatePosition();
		});
	}

	/**
	 * This will cancel a scheduled position update.
	 *
	 * @returns {void}
	 */
	cancelPosition()
	{
		// @ts-ignore
		if (!this.positionFrame)
		{
			return;
		}

		if (typeof globalThis.cancelAnimationFrame === 'function')
		{
			// @ts-ignore
			globalThis.cancelAnimationFrame(this.positionFrame);
		}
		// @ts-ignore
		this.positionFrame = null;
	}

	/**
	 * This will run after the setup.
	 *
	 * @returns {void}
	 */
	afterSetup()
	{
		// @ts-ignore
		if (ensurePopoverApi(this.panel))
		{
			// @ts-ignore
			this.panel.showPopover();
		}
		this.updatePosition();

		/**
		 * Outside clicks are ignored until the click that opened the
		 * popover has finished bubbling, otherwise a popover without
		 * a button would close as soon as it opens.
		 */
		// @ts-ignore
		this.acceptOutsideClicks = false;
		// @ts-ignore
		globalThis.setTimeout(() => this.acceptOutsideClicks = true, 0);
	}

	/**
	 * This will check if the element clicked was in the
	 * component of the button.
	 *
	 * @param {object} element
	 * @returns {boolean}
	 */
	isOutsideClick(element)
	{
		// @ts-ignore
		if (!this.panel || this.panel.contains(element))
		{
			return false;
		}

		// @ts-ignore
		return (!this.button || !this.button.contains(element));
	}

	/**
	 * This will set up the events.
	 *
	 * @returns {array}
	 */
	setupEvents()
	{
		return [
			['click', document, (e) =>
			{
				// @ts-ignore
				if (this.acceptOutsideClicks !== false && this.isOutsideClick(e.target))
				{
					// @ts-ignore
					this.state.open = false;
				}
			}],
			['resize', globalThis, (e) => this.schedulePosition()],

			/**
			 * Scroll is captured on the window so scrolling in
			 * nested containers also repositions the popover.
			 */
			['scroll', globalThis, (e) => this.schedulePosition(), true],
		];
	}

	/**
	 * This will override the set up to use the app shell.
	 *
	 * @param {object} container
	 */
	setContainer(container)
	{
		// @ts-ignore
		this.container = app.root;
	}

	/**
	 * This will hide the popover before destroying.
	 *
	 * @returns {void}
	 */
	beforeDestroy()
	{
		this.cancelPosition();
		// @ts-ignore
		hidePopoverSafe(this?.panel);
	}
}
