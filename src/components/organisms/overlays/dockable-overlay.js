import { Div } from "@base-framework/atoms";
import { DataTracker } from "@base-framework/base";
import { Overlay } from "./overlay.js";

/**
 * This will register the dockable overlay type
 * to the data tracker to track if the
 * container is being removed and the component
 * is not docked.
 */
DataTracker.addType('dockableOverlay', (data) =>
{
	if (!data)
	{
		return;
	}

	/**
	 * This will check if the component is rendered and not docked
	 * and then destroy it.
	 */
	const component = data.component;
	if (component && component.rendered === true && component.state.docked === false)
	{
		component.destroy();
	}
});

/**
 * DockableOverlay
 *
 * This will create an dockable overlay.
 *
 * @class
 * @extends Overlay
 */
export class DockableOverlay extends Overlay
{
	/**
	 * This will stop presistence.
	 *
	 * @returns {void}
	 */
	onCreated()
	{
		// @ts-ignore
		this.dockSize = this.maxSize || 1024;
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
				onState: [
					['loading', {
						loading: true,
					}],
					['docked', (docked, ele) =>
					{
						if (docked)
						{
							ele.className = this.getDockedClassName();
							originalContainer.appendChild(ele);

							/**
							 * This will resume page scrolling.
							 */
							document.documentElement.style.overflowY = 'auto';
						}
						else
						{
							ele.className = this.getClassName();
							// @ts-ignore
							app.root.appendChild(ele);

							/**
							 * This will hide the scroll bar so the page doesn't jump.
							 */
							document.documentElement.style.overflowY = 'hidden';
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
		return 'flex flex-auto flex-col bg-background flex will-change-contents ' + (this.class || '');
	}

	/**
	 * This will setup and render the component.
	 *
	 * @param {object} container
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
	 * This will check the dock size.
	 *
	 * @returns {void}
	 */
	afterSetup()
	{
		/**
		 * This will add the dockable overlay to the data tracker
		 * so we can keep track of it.
		 */
		DataTracker.add(this.container, 'dockableOverlay',
		{
			component: this
		});

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
			['resize', window, () => this.onResize()]
		];
	}

	/**
	 * This will check if the overlay can dock.
	 *
	 * @returns {boolean}
	 */
	canDock()
	{
		return (window.innerWidth >= this.dockSize);
	}

	/**
	 * This will handle the overlay resize.
	 *
	 * @returns {void}
	 */
	onResize()
	{
		this.state.docked = this.canDock();
	}

	/**
	 * This will resume scrolling when the overlay is being removed.
	 *
	 * @returns {void}
	 */
	beforeDestroy()
	{
		document.documentElement.style.overflowY = 'auto';
	}
}

export default DockableOverlay;