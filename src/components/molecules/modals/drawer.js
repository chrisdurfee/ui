import { DrawerGesture } from './drawer-gesture.js';
import { ModalContainer } from './modal-container.js';
import { Modal } from './modal.js';

/**
 * Drawer
 *
 * A mobile-first drawer component that slides up from the bottom on mobile
 * and appears as a centered modal on desktop. Supports swipe-to-close gestures.
 *
 * @export
 * @class Drawer
 * @extends {Modal}
 */
export class Drawer extends Modal
{
	/**
	 * This will declare the props for the compiler.
	 *
	 * @returns {void}
	 */
	declareProps()
	{
		super.declareProps();

		/**
		 * Force type to drawer
		 */
		this.type = 'drawer';

		/**
		 * @member {boolean} swipeToClose
		 * @default true
		 * @description Enable swipe-to-close gesture on mobile
		 */
		this.swipeToClose = true;

		/**
		 * @member {number} closeThreshold
		 * @default 150
		 * @description Pixels to drag before closing (mobile only)
		 */
		this.closeThreshold = 150;

		/**
		 * @member {number} snapThreshold
		 * @default 50
		 * @description Pixels to drag before snapping behavior kicks in
		 */
		this.snapThreshold = 50;
	}

	/**
	 * Setup after the component is created
	 *
	 * @returns {void}
	 */
	afterSetup()
	{
		if (this.swipeToClose)
		{
			this.gesture = new DrawerGesture({
				closeThreshold: this.closeThreshold,
				snapThreshold: this.snapThreshold,
				onClose: () => this.destroy()
			});
		}
	}

	/**
	 * Get extra props for ModalContainer
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
	 * Render the drawer with gesture handlers
	 *
	 * @returns {object}
	 */
	render()
	{
		const className = this.getMainClass();
		const title = this.title || '';
		const description = this.description || null;
		const containerProps = this.getContainerProps();

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
				aria: { expanded: ['open']},
				...containerProps
			},
			this.children
		);
	}

	/**
	 * Show the modal
	 *
	 * @protected
	 * @returns {void}
	 */
	showModal()
	{
		super.showModal();
	}

	/**
	 * Get gesture event handlers for modal content
	 * Returns event props to be spread onto the modal-content element
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
			touchstart: (e, parent) =>
            {
                // @ts-ignore
				const modalBody = this.modalBody;
				if (modalBody)
				{
					this.gesture.handleTouchStart(e, modalBody);
				}
			},
			touchmove: (e, parent) =>
            {
				const content = e.currentTarget;
                // @ts-ignore
				const modalBody = this.modalBody;
				if (modalBody)
				{
					this.gesture.handleTouchMove(e, content, modalBody);
				}
			},
			touchend: (e) =>
            {
				const content = e.currentTarget;
				this.gesture.handleTouchEnd(e, content);
			}
		};
	}

	/**
	 * Clean up before destroy
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
