import { Builder, Component } from "@base-framework/base";
import { Button } from "../../atoms/buttons/buttons.js";
import { ModalContainer } from "./modal-container.js";

/**
 * Body scroll lock with refcount.
 *
 * iOS Safari does not honor `overflow:hidden` on html/body when a
 * popover/modal is open, so the page underneath still scrolls. The
 * common workaround of pinning `body { position: fixed }` causes any
 * `position: fixed` UI (e.g. an installed PWA's bottom navigation that
 * sits above the safe-area inset) to visibly jump on open/close.
 *
 * Instead we leave layout alone and block `touchmove` on anything that
 * isn't inside a scrollable region of the modal. The modal's own
 * scroll container still works because we walk up from the touch
 * target and allow the gesture if a scrollable ancestor is found
 * inside `[data-scroll-lock-allow]`.
 */
let scrollLockCount = 0;
let savedOverflow = '';

const isScrollable = (el) =>
{
	if (!el || el.nodeType !== 1) return false;
	const style = getComputedStyle(el);
	const overflowY = style.overflowY;
	const canScroll = (overflowY === 'auto' || overflowY === 'scroll');
	return canScroll && el.scrollHeight > el.clientHeight;
};

const onTouchMove = (e) =>
{
	// Allow the gesture if it originates inside a scrollable region
	// that opted in via [data-scroll-lock-allow].
	let node = e.target;
	while (node && node !== document.body)
	{
		if (node.nodeType === 1 && node.hasAttribute && node.hasAttribute('data-scroll-lock-allow'))
		{
			if (isScrollable(node)) return;
		}
		node = node.parentNode;
	}

	if (e.cancelable)
	{
		e.preventDefault();
	}
};

const lockBodyScroll = () =>
{
	if (typeof document === 'undefined') return;
	if (scrollLockCount === 0)
	{
		savedOverflow = document.documentElement.style.overflow;
		// overflow:hidden on <html> is enough on desktop and Android.
		// iOS needs the touchmove guard below.
		document.documentElement.style.overflow = 'hidden';
		document.addEventListener('touchmove', onTouchMove, { passive: false });
	}
	scrollLockCount++;
};

const unlockBodyScroll = () =>
{
	if (typeof document === 'undefined') return;
	if (scrollLockCount === 0) return;
	scrollLockCount--;
	if (scrollLockCount === 0)
	{
		document.documentElement.style.overflow = savedOverflow;
		document.removeEventListener('touchmove', onTouchMove);
	}
};

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
					if (!state)
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
		render(this);
		this.showModal();
	}

	/**
	 * This will destroy the modal.
	 *
	 * @returns {void}
	 */
	close()
	{
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
		 * Lock background scroll. iOS Safari ignores `overflow:hidden`
		 * on html/body, so the page underneath still scrolls when the
		 * user pans on the drawer/modal. We pin the body in place and
		 * restore the scroll position on close. A refcount keeps things
		 * sane when nested modals are opened.
		 */
		lockBodyScroll();
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
		this?.panel?.hidePopover();
		// @ts-ignore
		this.state.open = false;

		if (typeof this.onClose === 'function')
		{
			this.onClose(this);
		}

		/**
		 * This will allow the body to scroll when the modal is closed.
		 */
		unlockBodyScroll();
	}
}