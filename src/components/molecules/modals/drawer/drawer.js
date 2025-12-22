import { ModalContainer } from '../modal-container.js';
import { Modal } from '../modal.js';
import { DrawerGesture } from './drawer-gesture.js';

/**
 * Drawer
 *
 * A mobile-first drawer component that slides up from the bottom on mobile
 * and appears as a centered modal on desktop. Supports swipe-to-close gestures.
 *
 * Extends the Modal component with:
 * - Mobile-optimized slide-up animation
 * - Touch gesture support for swipe-to-close
 * - Rubber-band drag effect
 * - Adaptive behavior (drawer on mobile, modal on desktop)
 *
 * @export
 * @class Drawer
 * @extends {Modal}
 */
export class Drawer extends Modal
{
	/**
	 * Declares the component props
	 *
	 * @returns {void}
	 */
	declareProps()
	{
		super.declareProps();

		/**
		 * Forces type to drawer for styling
		 * @type {string}
		 */
		this.type = 'drawer';

		/**
		 * Enables swipe-to-close gesture on mobile
		 * @type {boolean}
		 * @default true
		 */
		this.swipeToClose = true;

		/**
		 * Pixels to drag before closing (mobile only)
		 * @type {number}
		 * @default 150
		 */
		this.closeThreshold = 150;

		/**
		 * Pixels to drag before snapping behavior kicks in
		 * @type {number}
		 * @default 50
		 */
		this.snapThreshold = 50;

		/**
		 * DrawerGesture instance for handling touch events
		 * @type {DrawerGesture|null}
		 * @private
		 */
		this.gesture = null;

		/**
		 * Cached reference to modal content element (set via cache property)
		 * @type {HTMLElement|null}
		 */
		this.modalContent = null;

		/**
		 * Cached reference to modal body element (set via cache property)
		 * @type {HTMLElement|null}
		 */
		this.modalBody = null;
	}

	/**
	 * Gets extra props to pass to ModalContainer
	 *
	 * @returns {object}
	 */
	getContainerProps()
	{
		const props = {};

		// Add gesture handlers if enabled
		if (this.swipeToClose && this.gesture)
		{
			props.gestureHandlers = this.getGestureHandlers();
		}

		return props;
	}

	/**
	 * Renders the drawer with gesture handlers
	 *
	 * @returns {object}
	 */
	render()
	{
		const className = this.getMainClass();
		const title = this.title || '';
		const description = this.description || null;
		const containerProps = this.getContainerProps();

		return ModalContainer(
			{
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
				aria: { expanded: ['open'] },
				...containerProps
			},
			this.children
		);
	}

	/**
	 * Shows the modal and initializes gesture handling
	 *
	 * @protected
	 * @returns {void}
	 */
	showModal()
	{
		super.showModal();

		// Initialize gesture with cached element references after modal is shown
		if (this.swipeToClose && !this.gesture)
		{
			this.gesture = new DrawerGesture({
				modal: this.panel,
				modalContent: this.modalContent,
				modalBody: this.modalBody,
				closeThreshold: this.closeThreshold,
				snapThreshold: this.snapThreshold,
				onClose: () => this.destroy()
			});
		}
	}

	/**
	 * Gets gesture event handlers for modal content.
	 * Returns event props to be spread onto the modal-content element.
	 *
	 * @returns {object}
	 */
	getGestureHandlers()
	{
		if (!this.swipeToClose || !this.gesture || !this.gesture.isMobile())
		{
			return {};
		}

		return {
			touchstart: (e) => this.gesture.handleTouchStart(e),
			touchmove: (e) => this.gesture.handleTouchMove(e),
			touchend: (e) => this.gesture.handleTouchEnd(e)
		};
	}

	/**
	 * Cleans up before destroy
	 *
	 * @protected
	 * @returns {void}
	 */
	beforeDestroy()
	{
		if (this.gesture)
		{
			this.gesture.destroy();
			this.gesture = null;
		}

		super.beforeDestroy();
	}
}
