import { Div } from "@base-framework/atoms";
import { DataTracker } from "@base-framework/base";
import { Overlay } from "./overlay.js";

/**
 * This will register the dockable overlay type to the data tracker.
 * When the container is removed, if the component is not docked it
 * will be destroyed.
 */
DataTracker.addType('dockableOverlay', (data) =>
{
	if (!data)
	{
		return;
	}

	const component = data.component;
	if (component && component.rendered === true)
	{
		component.state.docked = false;
		component.destroy();
	}
});

/**
 * DockableOverlay
 *
 * A dockable overlay that renders inline when the viewport is wide enough
 * and as a full-screen overlay when it is not.
 *
 * @class
 * @extends Overlay
 */
export class DockableOverlay extends Overlay
{
	/**
	 * This will declare the props for the component.
	 *
	 * @returns {void}
	 */
	declareProps()
	{
		super.declareProps();

		/**
		 * @member {string|null} animateIn
		 * @default null
		 */
		this.animateIn = null;

		/**
		 * @member {string|null} animateOut
		 * @default null
		 */
		this.animateOut = null;

		/**
		 * @member {number} maxSize - Viewport width threshold at which the overlay docks.
		 * @default 1024
		 */
		this.maxSize = 1024;

		/**
		 * @member {string} class
		 * @default ''
		 */
		this.zIndex = 'z-30';
	}

	/**
	 * This will set the dock size threshold from the maxSize prop.
	 *
	 * @returns {void}
	 */
	onCreated()
	{
		this.dockSize = this.maxSize;
	}

	/**
	 * This will render the component.
	 *
	 * @returns {object}
	 */
	render()
	{
		const originalContainer = this.container;

		return Div(
			{
				animateIn: this.animateIn ?? null,
				animateOut: this.animateOut ?? null,
				onState: [
					['loading', {
						loading: true,
					}],
					['docked', (docked, ele) =>
					{
						if (docked)
						{
							ele.className = this.getDockedClassName();
							// @ts-ignore
							originalContainer.appendChild(ele);
						}
						else
						{
							ele.className = this.getClassName();
							globalThis.app.root.appendChild(ele);
						}
					}]
				]
			},
			[
				this.addBody()
			]
		);
	}

	/**
	 * This will get the docked className.
	 *
	 * @returns {string}
	 */
	getDockedClassName()
	{
		return `flex flex-auto flex-col bg-background will-change-contents ${this.class || ''}`.trim();
	}

	/**
	 * This will set up and render the component inside the given container.
	 *
	 * @param {HTMLElement} container
	 * @returns {void}
	 */
	setup(container)
	{
		this.container = container;
		this.initialize();
	}

	/**
	 * This will setup the overlay states.
	 *
	 * @returns {object}
	 */
	setupStates()
	{
		return {
			loading: false,
			docked: this.canDock()
		};
	}

	/**
	 * This will register this overlay with the data tracker and
	 * perform an initial dock-state check.
	 *
	 * @returns {void}
	 */
	afterSetup()
	{
		// @ts-ignore
		DataTracker.add(this.container, 'dockableOverlay', { component: this });
		this.onResize();
	}

	/**
	 * This will setup the overlay events.
	 *
	 * @returns {Array<object>}
	 */
	setupEvents()
	{
		return [
			['resize', globalThis, () => this.onResize()]
		];
	}

	/**
	 * This will check if the viewport is wide enough to dock the overlay.
	 *
	 * @returns {boolean}
	 */
	canDock()
	{
		// @ts-ignore
		return globalThis.innerWidth >= this.dockSize;
	}

	/**
	 * This will update the docked state when the viewport is resized.
	 *
	 * @returns {void}
	 */
	onResize()
	{
		// @ts-ignore
		this.state.docked = this.canDock();
	}

	/**
	 * docks the overlay before the component is destroyed to ensure it is in the correct container
	 *
	 * @returns {void}
	 */
	beforeDestroy()
	{
		// @ts-ignore
		this.state.docked = false;
	}
}

export default DockableOverlay;