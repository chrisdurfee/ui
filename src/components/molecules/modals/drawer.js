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
		this.initDragState();
	}

	/**
	 * Initialize drag state
	 *
	 * @private
	 * @returns {void}
	 */
	initDragState()
	{
		this.dragState = {
			isDragging: false,
			startY: 0,
			currentY: 0,
			startScrollTop: 0,
			canDrag: false
		};
	}

	/**
	 * Show the modal and attach gesture handlers
	 *
	 * @protected
	 * @returns {void}
	 */
	showModal()
	{
		super.showModal();

		if (this.swipeToClose && this.isMobile())
		{
			this.attachGestureHandlers();
		}
	}

	/**
	 * Check if we're on mobile viewport
	 *
	 * @private
	 * @returns {boolean}
	 */
	isMobile()
	{
		return window.innerWidth < 1024;
	}

	/**
	 * Attach touch gesture handlers
	 *
	 * @private
	 * @returns {void}
	 */
	attachGestureHandlers()
	{
		const content = this.panel.querySelector('.modal-content');
		const modalBody = this.panel.querySelector('.modal-body');

		if (!content || !modalBody)
		{
			return;
		}

		// Touch start
		this.touchStartHandler = (e) => this.onTouchStart(e, modalBody);
		content.addEventListener('touchstart', this.touchStartHandler, { passive: true });

		// Touch move
		this.touchMoveHandler = (e) => this.onTouchMove(e, content, modalBody);
		content.addEventListener('touchmove', this.touchMoveHandler, { passive: false });

		// Touch end
		this.touchEndHandler = (e) => this.onTouchEnd(e, content);
		content.addEventListener('touchend', this.touchEndHandler, { passive: true });

		// Store refs for cleanup
		this.gestureElements = { content, modalBody };
	}

	/**
	 * Handle touch start
	 *
	 * @private
	 * @param {TouchEvent} e
	 * @param {HTMLElement} modalBody
	 * @returns {void}
	 */
	onTouchStart(e, modalBody)
	{
		const touch = e.touches[0];
		this.dragState.startY = touch.clientY;
		this.dragState.currentY = touch.clientY;
		this.dragState.startScrollTop = modalBody.scrollTop;

		// Can drag if at top of scroll
		this.dragState.canDrag = modalBody.scrollTop === 0;
	}

	/**
	 * Handle touch move
	 *
	 * @private
	 * @param {TouchEvent} e
	 * @param {HTMLElement} content
	 * @param {HTMLElement} modalBody
	 * @returns {void}
	 */
	onTouchMove(e, content, modalBody)
	{
		const touch = e.touches[0];
		this.dragState.currentY = touch.clientY;
		const deltaY = this.dragState.currentY - this.dragState.startY;

		// Check if we should start dragging
		if (!this.dragState.isDragging && this.dragState.canDrag && deltaY > 0)
		{
			// User is pulling down and we're at top of scroll
			if (modalBody.scrollTop === 0)
			{
				this.dragState.isDragging = true;
			}
		}

		// If dragging, move the drawer
		if (this.dragState.isDragging && deltaY > 0)
		{
			e.preventDefault();

			// Apply transform with rubber band effect
			const damping = 1 - (deltaY / (window.innerHeight * 2));
			const translateY = deltaY * Math.max(damping, 0.5);

			content.style.transform = `translateY(${translateY}px)`;
			content.style.transition = 'none';

			// Update opacity of backdrop
			const opacity = Math.max(0, 1 - (deltaY / this.closeThreshold));
			this.updateBackdropOpacity(opacity);
		}
		else if (modalBody.scrollTop > 0)
		{
			// Content is scrolling, allow it
			this.dragState.canDrag = false;
		}
	}

	/**
	 * Handle touch end
	 *
	 * @private
	 * @param {TouchEvent} e
	 * @param {HTMLElement} content
	 * @returns {void}
	 */
	onTouchEnd(e, content)
	{
		const deltaY = this.dragState.currentY - this.dragState.startY;

		if (this.dragState.isDragging)
		{
			content.style.transition = 'transform 0.3s ease-out, opacity 0.3s ease-out';

			// Close if dragged past threshold
			if (deltaY > this.closeThreshold)
			{
				this.animateClose(content);
			}
			else
			{
				// Snap back
				content.style.transform = 'translateY(0)';
				this.updateBackdropOpacity(1);
			}
		}

		// Reset drag state
		this.dragState.isDragging = false;
		this.dragState.canDrag = false;
	}

	/**
	 * Animate drawer closing
	 *
	 * @private
	 * @param {HTMLElement} content
	 * @returns {void}
	 */
	animateClose(content)
	{
		content.style.transform = `translateY(100%)`;
		this.updateBackdropOpacity(0);

		setTimeout(() => {
			this.destroy();
		}, 300);
	}

	/**
	 * Update backdrop opacity
	 *
	 * @private
	 * @param {number} opacity
	 * @returns {void}
	 */
	updateBackdropOpacity(opacity)
	{
		const backdrop = this.panel.querySelector('::after');
		if (backdrop)
		{
			this.panel.style.setProperty('--backdrop-opacity', opacity.toString());
		}
	}

	/**
	 * Clean up gesture handlers before destroy
	 *
	 * @protected
	 * @returns {void}
	 */
	beforeDestroy()
	{
		this.removeGestureHandlers();
		super.beforeDestroy();
	}

	/**
	 * Remove gesture event listeners
	 *
	 * @private
	 * @returns {void}
	 */
	removeGestureHandlers()
	{
		if (!this.gestureElements)
		{
			return;
		}

		const { content } = this.gestureElements;

		if (this.touchStartHandler)
		{
			content.removeEventListener('touchstart', this.touchStartHandler);
		}
		if (this.touchMoveHandler)
		{
			content.removeEventListener('touchmove', this.touchMoveHandler);
		}
		if (this.touchEndHandler)
		{
			content.removeEventListener('touchend', this.touchEndHandler);
		}

		this.gestureElements = null;
	}
}
