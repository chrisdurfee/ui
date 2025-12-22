/**
 * DrawerGesture
 *
 * Handles touch gesture tracking for drawer components.
 * Manages drag state, thresholds, and provides helper methods for swipe-to-close behavior.
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
	 * @param {HTMLElement|null} [options.modal=null] - The modal element (panel) reference
	 * @param {number} [options.closeThreshold=150] - Pixels to drag before closing
	 * @param {number} [options.snapThreshold=50] - Pixels to drag before snapping
	 * @param {Function|null} [options.onClose=null] - Callback when drawer should close
	 */
	constructor(options = {})
	{
		const { modal = null, closeThreshold = 150, snapThreshold = 50, onClose = null } = options;

		this.modal = modal;
		this.reset();
	}

	/**
	 * Reset drag state
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
	 * Check if viewport is mobile
	 *
	 * @returns {boolean}
	 */
	isMobile()
	{
		return window.innerWidth < 1024;
	}

	/**
	 * Handle touch start
	 *
	 * @param {TouchEvent} e
	 * @returns {void}
	 */
	handleTouchStart(e)
	{
		if (!this.modalBody) return;

		const touch = e.touches[0];
		this.state.startY = touch.clientY;
		this.state.currentY = touch.clientY;
		this.state.startScrollTop = this.modalBody.scrollTop;

		// Can drag if at top of scroll
		this.state.canDrag = this.modalBody.scrollTop === 0;
	}

	/**
	 * Handle touch move
	 *
	 * @param {TouchEvent} e
	 * @returns {void}
	 */
	handleTouchMove(e)
	{
		if (!this.modalContent || !this.modalBody) return;

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

			// Calculate backdrop opacity
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
	 * Handle touch end
	 *
	 * @param {TouchEvent} e
	 * @returns {void}
	 */
	handleTouchEnd(e)
	{
		if (!this.modalContent) return;

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
				// Snap back
				this.snapBack();
			}
		}

		// Reset drag state
		this.state.isDragging = false;
		this.state.canDrag = false;
	}

	/**
	 * Get current drag delta Y
	 *
	 * @returns {number}
	 */
	getDeltaY()
	{
		return this.state.currentY - this.state.startY;
	}

	/**
	 * Calculate translateY with rubber band damping
	 *
	 * @param {number} deltaY
	 * @returns {number}
	 */
	calculateTranslateY(deltaY)
	{
		const damping = 1 - (deltaY / (window.innerHeight * 2));
		return deltaY * Math.max(damping, 0.5);
	}

	/**
	 * Calculate backdrop opacity based on drag distance
	 *
	 * @param {number} deltaY
	 * @returns {number}
	 */
	calculateBackdropOpacity(deltaY)
	{
		return Math.max(0, 1 - (deltaY / this.closeThreshold));
	}

	/**
	 * Update backdrop opacity
	 *
	 * @param {number} opacity
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
	 * Animate drawer closing
	 *
	 * @returns {void}
	 */
	animateClose()
	{
		if (!this.modalContent) return;

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
	 * Snap drawer back to original position
	 *
	 * @returns {void}
	 */
	snapBack()
	{
		if (!this.modalContent) return;

		this.modalContent.style.transform = 'translateY(0)';
		this.updateBackdropOpacity(1);
	}

	/**
	 * Check if currently dragging
	 *
	 * @returns {boolean}
	 */
	isDragging()
	{
		return this.state.isDragging;
	}

	/**
	 * Cleanup
	 *
	 * @returns {void}
	 */
	destroy()
	{
		this.reset();
		this.onClose = null;
	}
}
