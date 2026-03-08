/**
 * DrawerGesture
 *
 * Manages touch gesture tracking for drawer components.
 * Handles drag state, velocity thresholds, and swipe-to-close behavior.
 *
 * This class provides methods for:
 * - Tracking touch start/move/end events
 * - Calculating drag deltas with rubber-band damping
 * - Determining when to close or snap back the drawer
 * - Managing backdrop opacity during drag
 *
 * @export
 * @class DrawerGesture
 */
export class DrawerGesture
{
	/**
	 * Creates an instance of DrawerGesture.
	 *
	 * @param {object} [options={}]
	 * @param {HTMLElement} [options.modal=null] - The modal element (panel) reference
	 * @param {HTMLElement} [options.modalContent=null] - The modal content element reference
	 * @param {HTMLElement} [options.modalBody=null] - The scrollable body element reference
	 * @param {number} [options.closeThreshold=150] - Pixels to drag before closing
	 * @param {number} [options.snapThreshold=50] - Pixels to drag before snapping
	 * @param {Function} [options.onClose=null] - Callback when drawer should close
	 */
	constructor(options = {})
	{
		const {
			modal = null,
			modalContent = null,
			modalBody = null,
			closeThreshold = 150,
			snapThreshold = 50,
			onClose = null
		} = options;

		this.modal = modal;
		this.modalContent = modalContent;
		this.modalBody = modalBody;
		this.closeThreshold = closeThreshold;
		this.snapThreshold = snapThreshold;
		this.onClose = onClose;

		this.reset();
	}

	/**
	 * Resets the drag state to initial values
	 *
	 * @returns {void}
	 */
	reset()
	{
		this.state = {
			isDragging: false,
			startY: 0,
			currentY: 0,
			startScrollTop: 0,
			canDrag: false,
			/**
			 * True if the body has scrolled during this gesture.
			 * Prevents drag from starting mid-gesture on iOS when rubber-band
			 * overscroll briefly resets scrollTop to 0 at the bottom boundary.
			 * @type {boolean}
			 */
			hasScrolled: false
		};
	}

	/**
	 * Checks if the viewport is mobile size
	 *
	 * @returns {boolean}
	 */
	isMobile()
	{
		return window.innerWidth < 1024;
	}

	/**
	 * Handles touch start event
	 *
	 * @param {TouchEvent} e - The touch event
	 * @returns {void}
	 */
	handleTouchStart(e)
	{
		if (!this.modal)
		{
			return;
		}

		const touch = e.touches[0];
		// @ts-ignore
		const scrollTop = this.modal.scrollTop;

		// @ts-ignore
		this.state.startY = touch.clientY;
		// @ts-ignore
		this.state.currentY = touch.clientY;
		// @ts-ignore
		this.state.startScrollTop = scrollTop;
		// @ts-ignore
		this.state.hasScrolled = false;

		// Allow drag only when at the very top of the scroll.
		// Use a small tolerance (<=1) to handle iOS sub-pixel scroll values
		// and rubber-band bounce that can leave a fractional scrollTop.
		// @ts-ignore
		this.state.canDrag = scrollTop <= 1;
	}

	/**
	 * Handles touch move event
	 *
	 * @param {TouchEvent} e - The touch event
	 * @returns {void}
	 */
	handleTouchMove(e)
	{
		if (!this.modal || !this.modalContent)
		{
			return;
		}

		const touch = e.touches[0];
		// @ts-ignore
		this.state.currentY = touch.clientY;
		const deltaY = this.getDeltaY();
		// @ts-ignore
		const currentScrollTop = this.modal.scrollTop;

		// Track if the body has scrolled at any point during this gesture.
		// On iOS, rubber-band bounce at the bottom boundary can briefly
		// reset scrollTop to 0 on the next touchstart. Once scrolling has
		// occurred we must not convert this gesture into a drag.
		// @ts-ignore
		if (currentScrollTop !== this.state.startScrollTop)
		{
			// @ts-ignore
			this.state.hasScrolled = true;
		}

		// Check if we should start dragging
		// @ts-ignore
		const canStartDrag = this.state.canDrag && !this.state.hasScrolled;
		// @ts-ignore
		if (!this.state.isDragging && canStartDrag && deltaY > 0)
		{
			// User is pulling down and we're at top of scroll (tolerance <=1 for iOS)
			if (currentScrollTop <= 1)
			{
				// @ts-ignore
				this.state.isDragging = true;
			}
		}

		// If dragging, move the drawer
		// @ts-ignore
		if (this.state.isDragging && deltaY > 0)
		{
			e.preventDefault();

			// Apply transform with rubber band effect to the entire modal
			const translateY = this.calculateTranslateY(deltaY);
			this.modal.style.transform = `translateY(${translateY}px)`;
			this.modal.style.transition = 'none';

			// Calculate and update backdrop opacity
			const opacity = this.calculateBackdropOpacity(deltaY);
			this.updateBackdropOpacity(opacity);
		}
		else if (currentScrollTop > 1)
		{
			// Content is scrolling, disallow drag for the remainder of this gesture
			// @ts-ignore
			this.state.canDrag = false;
		}
	}

	/**
	 * Handles touch end event
	 *
	 * @param {TouchEvent} e - The touch event
	 * @returns {void}
	 */
	handleTouchEnd(e)
	{
		if (!this.modal)
		{
			return;
		}

		const deltaY = this.getDeltaY();

		// @ts-ignore
		if (this.state.isDragging)
		{
			this.modal.style.transition = 'transform 0.3s ease-out, opacity 0.3s ease-out';

			// Close if dragged past threshold
			if (deltaY > this.closeThreshold)
			{
				this.animateClose();
			}
			else
			{
				// Snap back to original position
				this.snapBack();
			}
		}

		// Reset drag state
		// @ts-ignore
		this.state.isDragging = false;
		// @ts-ignore
		this.state.canDrag = false;
	}

	/**
	 * Gets current drag delta Y
	 *
	 * @returns {number} The vertical drag distance in pixels
	 */
	getDeltaY()
	{
		// @ts-ignore
		return this.state.currentY - this.state.startY;
	}

	/**
	 * Calculates translateY with rubber band damping effect.
	 * The further you drag, the more resistance is applied.
	 *
	 * @param {number} deltaY - The raw drag distance
	 * @returns {number} The damped translation distance
	 */
	calculateTranslateY(deltaY)
	{
		const damping = 1 - (deltaY / (window.innerHeight * 2));
		return deltaY * Math.max(damping, 0.5);
	}

	/**
	 * Calculates backdrop opacity based on drag distance.
	 * Opacity decreases as the drawer is dragged down.
	 *
	 * @param {number} deltaY - The drag distance
	 * @returns {number} Opacity value between 0 and 1
	 */
	calculateBackdropOpacity(deltaY)
	{
		return Math.max(0, 1 - (deltaY / this.closeThreshold));
	}

	/**
	 * Updates the backdrop opacity via CSS custom property
	 *
	 * @param {number} opacity - The opacity value (0-1)
	 * @returns {void}
	 */
	updateBackdropOpacity(opacity)
	{
		if (this.modal)
		{
			this.modal.style.setProperty('--backdrop-opacity', opacity.toString());
		}
	}

	/**
	 * Animates the drawer closing by translating the entire modal off-screen
	 *
	 * @returns {void}
	 */
	animateClose()
	{
		if (!this.modal)
		{
			return;
		}

		// Animate entire modal sliding down
		this.modal.style.transition = 'transform 0.3s ease-out, opacity 0.3s ease-out';
		this.modal.style.transform = 'translateY(100%)';
		this.updateBackdropOpacity(0);

		setTimeout(() => {
			if (this.onClose)
			{
				this.onClose();
			}
		}, 300);
	}

	/**
	 * Snaps the drawer back to its original position
	 *
	 * @returns {void}
	 */
	snapBack()
	{
		if (!this.modal)
		{
			return;
		}

		this.modal.style.transform = 'translateY(0)';
		this.updateBackdropOpacity(1);
	}

	/**
	 * Checks if currently dragging
	 *
	 * @returns {boolean}
	 */
	isDragging()
	{
		// @ts-ignore
		return this.state.isDragging;
	}

	/**
	 * Cleans up resources and resets state
	 *
	 * @returns {void}
	 */
	destroy()
	{
		this.reset();
		this.modal = null;
		this.onClose = null;
	}
}
