import { Div } from "@base-framework/atoms";
import { Component } from "@base-framework/base";
import { lockBodyScroll, unlockBodyScroll } from "../../../../molecules/modals/scroll-lock.js";
import { PopupHeader } from "./popup-header.js";

/**
 * This will create a backdrop for the popover.
 *
 * @returns {object}
 */
export const Backdrop = () => (
	Div({
		class: `
			absolute inset-0 bg-black/40 z-[-1] fadeIn
			transition-opacity duration-200
		`,
		click: (e, { state }) => state.open = false
	})
);

/**
 * PopOver
 *
 * This will create a absolute cotnainer component.
 *
 * @export
 * @class PopOver
 * @extends {Component}
 */
export class NavigationPopover extends Component
{
	/**
	 * This will declare the props for the compiler.
	 *
	 * @returns {void}
	 */
	declareProps()
	{
		/**
		 * This will set the title.
		 * @member {string} title
		 */
		this.title = '';
	}

	/**
	 * This will render the modal component.
	 *
	 * @returns {object}
	 */
	render()
	{
		return Div({
			class: `fixed inset-0 z-50`
		}, [
			Backdrop(),

			// Popover Content
			Div({
				class: `
					absolute popIn w-auto p-0 bg-popover m-auto shadow-lg rounded-md top-0 bottom-0 left-2 right-2 max-h-[85dvh] text-inherit block
				`,
				dataSet: ['open', ['expanded', true, 'true']]
			}, [
				Div({ cache: 'scrollPanel', class: 'flex flex-auto flex-col w-full h-full overflow-y-auto max-h-[85dvh] rounded-md bg-popover border' }, [
					PopupHeader({ title: this.title }),
					Div({ class: 'flex flex-auto flex-col' }, this.children)
				])
			])
		]);
	}

	/**
	 * This will setup the states.
	 *
	 * @returns {object}
	 */
	setupStates()
	{
		const parent = this.parent;
		// @ts-ignore
		const id = parent.getId();

		return {
			open: {
				id,
				callBack: (state) =>
				{
					if (state === false)
					{
						this.destroy();
					}
				}
			}
		};
	}

	/**
	 * This will add the body scroll lock.
	 *
	 * @returns {void}
	 */
	afterSetup()
	{
		/**
		 * This will prevent the body from scrolling when the popover is open.
		 * The shared scroll lock is reference counted, so it is safe to use
		 * alongside modals and drawers.
		 */
		if (this.scrollLocked === true)
		{
			return;
		}

		// @ts-ignore
		this.lockedPanel = this.scrollPanel || this.panel;
		// @ts-ignore
		lockBodyScroll(this.lockedPanel);
		this.scrollLocked = true;
	}

	/**
	 * This will release the body scroll lock. This runs for
	 * every teardown path (closing, route changes, parent
	 * destruction) so the page can never stay locked.
	 *
	 * @returns {void}
	 */
	beforeDestroy()
	{
		if (this.scrollLocked !== true)
		{
			return;
		}

		this.scrollLocked = false;
		// @ts-ignore
		unlockBodyScroll(this.lockedPanel);
		this.lockedPanel = null;
	}

	/**
	 * This will override the set up to use the body.
	 *
	 * @param {object} container
	 */
	setContainer(container)
	{
		// @ts-ignore
		this.container = app.root;
	}
}