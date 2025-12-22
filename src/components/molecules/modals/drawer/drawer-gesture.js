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
			canDrag: false
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
		if (!this.modalBody)
		{
			return;
		}

		const touch = e.touches[0];
		this.state.startY = touch.clientY;
		this.state.currentY = touch.clientY;
		this.state.startScrollTop = this.modalBody.scrollTop;

		// Can drag only if at the top of scroll
		this.state.canDrag = this.modalBody.scrollTop === 0;
	}

	/**
	 * Handles touch move event
	 *
	 * @param {TouchEvent} e - The touch event
	 * @returns {void}
	 */
	handleTouchMove(e)
	{
		if (!this.modalContent || !this.modalBody)
		{
			return;
		}

		const touch = e.touches[0];
		this.state.currentY = touch.clientY;
		const deltaY = this.getDeltaY();

		// Check if we should start dragging
		if (!this.state.isDragging && this.state.canDrag && deltaY > 0)
		{
			// User is pulling down and we're at top of scroll
			if (this.modalBody.scrollTop === 0)
			{
				this.state.isDragging = true;
			}
		}

		// If dragging, move the drawer
		if (this.state.isDragging && deltaY > 0)
		{
			e.preventDefault();

			// Apply transform with rubber band effect
			const translateY = this.calculateTranslateY(deltaY);
			this.modalContent.style.transform = `translateY(${translateY}px)`;
			this.modalContent.style.transition = 'none';

			// Calculate and update backdrop opacity
			const opacity = this.calculateBackdropOpacity(deltaY);
			this.updateBackdropOpacity(opacity);
		}
		else if (this.modalBody.scrollTop > 0)
		{
			// Content is scrolling, disallow drag
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
		if (!this.modalContent)
		{
			return;
		}

		const deltaY = this.getDeltaY();

		if (this.state.isDragging)
		{
			this.modalContent.style.transition = 'transform 0.3s ease-out, opacity 0.3s ease-out';

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
		this.state.isDragging = false;
		this.state.canDrag = false;
	}

	/**
	 * Gets current drag delta Y
	 *
	 * @returns {number} The vertical drag distance in pixels
	 */
	getDeltaY()
	{
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
	 * Animates the drawer closing by translating it off-screen
	 *
	 * @returns {void}
	 */
	animateClose()
	{
		if (!this.modalContent)
		{
			return;
		}

		this.modalContent.style.transform = 'translateY(100%)';
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
		if (!this.modalContent)
		{
			return;
		}

		this.modalContent.style.transform = 'translateY(0)';
		this.updateBackdropOpacity(1);
	}

	/**
	 * Checks if currently dragging
	 *
	 * @returns {boolean}
	 */
	isDragging()
	{
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
		this.modalContent = null;
		this.modalBody = null;
		this.onClose = null;
	}
}
