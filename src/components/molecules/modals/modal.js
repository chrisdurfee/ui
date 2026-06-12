import { Builder, Component } from "@base-framework/base";
import { Button } from "../../atoms/buttons/buttons.js";
import { ModalContainer } from "./modal-container.js";
import { acquireOpenLock, releaseOpenLock } from "./open-lock.js";
import { popOverlayHistory, pushOverlayHistory } from "./overlay-history.js";
import { lockBodyScroll, unlockBodyScroll } from "./scroll-lock.js";

/**
 * This will render the modal component.
 *
 * @param {object} component
 * @returns {object}
 */
// @ts-ignore
const render = (component) => { return Builder.render(component, app.root); };

/**
 * Modal
 *
 * This will create a modal component.
 *
 * @export
 * @class Modal
 * @extends {Component}
 */
export class Modal extends Component
{
	/**
	 * This will declare the props for the compiler.
	 *
	 * @returns {void}
	 */
	declareProps()
	{
		/**
		 * @member {string} title
		 */
		this.title = null;

		/**
		 * @member {string} description
		 */
		this.description = null;

		/**
		 * @member {string|null} size
		 * @default null
		 * @values 'sm', 'md', 'lg', 'xl'
		 */
		this.size = null;

		/**
		 * @member {string|null} type
		 * @default null
		 * @values 'right', 'left', 'drawer'
		 * @description This will set the type of modal.
		 */
		this.type = null;

		/**
		 * @member {boolean} hidePrimaryButton
		 * @default false
		 * @description This will hide the primary button.
		 * @values true, false
		 */
		this.hidePrimaryButton = false;

		/**
		 * @member {boolean} hideFooter
		 * @default false
		 * @description This will hide the footer.
		 * @values true, false
		 */
		this.hideFooter = false;

		/**
		 * @member {string} icon
		 */
		this.icon = null;

		/**
		 * @member {function|nll} onSubmit
		 */
		this.onSubmit = null;

		/**
		 * @member {function|null} onClose
		 */
		this.onClose = null;

		/**
		 * @member {boolean} back
		 */
		this.back = false;
	}

	/**
	 * This will render the modal component.
	 *
	 * @returns {object}
	 */
	render()
	{
		const className = this.getMainClass();
		const title = this.title || '';
		const description = this.description || null;

		return ModalContainer({
				class: className,
				title,
				description,
				options: this.headerOptions(),
				buttons: this.getButtons(),
				hideFooter: this.hideFooter,
				onSubmit: (parent) =>
				{
					let canClose = true;
					if (this.onSubmit)
					{
						canClose = this.onSubmit(parent);
					}

					if (canClose !== false)
					{
						this.destroy();
					}
				},
				icon: this.icon,
				back: this.back ?? false,
				aria: { expanded: ['open']}
			},
			this.children
		);
	}

	/**
	 * This will setup the states.
	 *
	 * @returns {object}
	 */
	setupStates()
	{
		return {
			open: {
				state: false,
				callBack: (state) =>
				{
					// @ts-ignore
					if (!state && !this.__destroying)
					{
						this.destroy();
					}
				}
			}
		};
	}

	/**
	 * This will get the header options.
	 *
	 * @returns {Array<object>}
	 */
	headerOptions()
	{
		return [];
	}

	/**
	 * This will get the buttons for the modal.
	 *
	 * @returns {array}
	 */
	getButtons()
	{
		return [
			Button({ variant: 'outline', click: () => this.destroy() }, 'Cancel'),
			this.hidePrimaryButton !== true && Button({ variant: 'primary', type: 'submit' }, 'Save')
		];
	}

	/**
	 * This will check if the click was outside the component.
	 *
	 * @param {object} element
	 * @returns {boolean}
	 */
	isOutsideClick(element)
	{
		// @ts-ignore
		return (!this.panel.contains(element));
	}

	/**
	 * This will get the size class.
	 *
	 * @returns {string}
	 */
	getSizeClass()
	{
		switch (this.size)
		{
			// case 'sm':
			// 	return 'sm max-w-[646px]';
			case 'lg':
				return 'lg max-w-[900px]';
			case 'xl':
				return 'xl max-w-[1400px]';
			default:
				return 'md max-w-[760px]';
		}
	}

	/**
	 * This will get the type class.
	 *
	 * @returns {string}
	 */
	getTypeClass()
	{
		switch (this.type)
		{
			case 'right':
				return 'right right-0';
			case 'left':
				return 'left left-0';
			case 'drawer':
				return 'drawer';
			default:
				return '';
		}
	}

	/**
	 * This will get the modal class.
	 *
	 * @returns {string}
	 */
	getMainClass()
	{
		return this.getSizeClass() + ' ' + this.getTypeClass();
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
	 * This will open the modal.
	 *
	 * @returns {void}
	 */
	open()
	{
		if (!acquireOpenLock())
		{
			return;
		}

		/**
		 * Push a neutral history entry so a mobile back-swipe (or the back
		 * button) closes this overlay instead of navigating away.
		 */
		pushOverlayHistory(this);
		// @ts-ignore
		this.overlayHistoryPushed = true;

		try
		{
			render(this);
			this.showModal();
		}
		catch (error)
		{
			releaseOpenLock();
			throw error;
		}
	}

	/**
	 * This will destroy the modal.
	 *
	 * @param {(function():void)|null} [afterSettle] - Optional callback invoked
	 *     once the overlay's history unwind has settled. Use this to navigate
	 *     (e.g. `app.navigate`) after closing so the pushed route is not reverted
	 *     by the close's own `history.back()` popstate.
	 * @returns {void}
	 */
	close(afterSettle = null)
	{
		// @ts-ignore
		this.__afterOverlaySettle = (typeof afterSettle === 'function') ? afterSettle : null;
		this.destroy();
	}

	/**
	 * This will show the modal.
	 *
	 * @protected
	 * @returns {void}
	 */
	showModal()
	{
		/**
		 * This will delay calling to show modal to make sure
		 * it is added to the DOM.
		 */
		const DELAY = 10;
		// @ts-ignore
		globalThis.setTimeout(() => this.panel.showPopover(), DELAY);
		// @ts-ignore
		this.state.open = true;

		/**
		 * This will lock the body (including iOS Safari / installed PWAs) so the
		 * page behind the overlay cannot scroll or rubber-band. The panel is
		 * passed so the overlay's own content can still scroll internally.
		 */
		// @ts-ignore
		lockBodyScroll(this.panel);
		// @ts-ignore
		this.overlayScrollLocked = true;
	}

	/**
	 * This will hide the modal.
	 *
	 * @protected
	 * @returns {void}
	 */
	beforeDestroy()
	{
		// @ts-ignore
		this.__destroying = true;
		releaseOpenLock();

		// @ts-ignore
		this?.panel?.hidePopover();
		// @ts-ignore
		this.state.open = false;

		/**
		 * This will allow the body to scroll again once the overlay is closed.
		 */
		// @ts-ignore
		if (this.overlayScrollLocked)
		{
			// @ts-ignore
			unlockBodyScroll(this.panel);
			// @ts-ignore
			this.overlayScrollLocked = false;
		}

		/**
		 * This will remove the history entry added on open (unless the close was
		 * itself triggered by a back navigation).
		 */
		// @ts-ignore
		if (this.overlayHistoryPushed)
		{
			// @ts-ignore
			this.overlayHistoryPushed = false;
			// @ts-ignore
			popOverlayHistory(this, this.__afterOverlaySettle);
			// @ts-ignore
			this.__afterOverlaySettle = null;
		}
		// @ts-ignore
		else if (typeof this.__afterOverlaySettle === 'function')
		{
			/**
			 * No history entry was pushed for this overlay, so there is no
			 * unwind to wait on. Honour the callback contract on the next tick.
			 */
			// @ts-ignore
			const after = this.__afterOverlaySettle;
			// @ts-ignore
			this.__afterOverlaySettle = null;
			// @ts-ignore
			globalThis.setTimeout(after, 0);
		}

		if (typeof this.onClose === 'function')
		{
			this.onClose(this);
		}
	}
}