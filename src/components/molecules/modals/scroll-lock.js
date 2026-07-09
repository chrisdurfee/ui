/**
 * Body scroll lock manager.
 *
 * Page scrolling is suppressed purely by intercepting scroll-producing events
 * (`touchmove`, `wheel`, and scroll keys) at the document level — NOT by
 * mutating `overflow` or `position` on the document scroller.
 *
 * Two layout techniques were tried and rejected:
 *
 * 1. `position: fixed` on body collapses it, which on iOS standalone (PWA)
 *    recomputes the visual viewport / safe-area insets and shifts fixed UI
 *    (the bottom tab nav visibly raised while open and dropped back on close).
 *
 * 2. `overflow: hidden` on the root scroller (html/body) is worse than it
 *    looks: applying it instantly clamps the scroll offset to 0, so the page
 *    visibly jumps to the top when an overlay opens and the router then
 *    restores the saved position on close — a jarring jump-up / jump-back.
 *    iOS WebKit also re-enables body scrolling under `overflow: hidden` once a
 *    text field is focused and the keyboard opens, defeating the lock.
 *
 * Event interception avoids all of this: the document is never reflowed, the
 * scroll offset is never clamped, so the page stays exactly where it is and
 * fixed chrome never shifts. `overscroll-behavior: none` is still applied
 * (it neither reflows nor clamps) to kill iOS rubber-band / pull-to-refresh.
 *
 * Scroll events that originate inside an open overlay's own scrollable panel
 * are allowed through ONLY when a scroll container between the touch target
 * and the panel can actually consume the gesture in that direction. iOS
 * chains an unconsumable scroll (content shorter than the panel, or already
 * at a scroll boundary) to the page behind the overlay — `overscroll-behavior`
 * does not help there because it only applies to elements that can scroll.
 *
 * The window scroll position is also pinned while locked. iOS scrolls the
 * page programmatically when the keyboard opens to "reveal" the focused
 * field — that is not a touch/wheel event, so the guards cannot cancel it.
 * Re-pinning on `scroll` keeps the page (and anything visible beneath the
 * keyboard) exactly where it was.
 *
 * The lock is reference counted so stacked overlays (e.g. a drawer opening a
 * confirmation) do not prematurely release the lock when the inner overlay
 * closes.
 */

/**
 * Number of overlays currently requesting a scroll lock.
 *
 * @type {number}
 */
let lockCount = 0;

/**
 * The inline styles captured before locking, restored on release.
 *
 * @type {object|null}
 */
let savedStyles = null;

/**
 * The overlay panels whose interiors are allowed to scroll while locked. One
 * entry is pushed per lock acquisition (top of stack is the active overlay).
 *
 * @type {Array<Element>}
 */
const allowedPanels = [];

/**
 * Last single-touch position, tracked while locked so touchmove guards can
 * derive the gesture direction.
 *
 * @type {number}
 */
let lastTouchY = 0;

/**
 * @type {number}
 */
let lastTouchX = 0;

/**
 * The window scroll offset captured when the lock engages. While locked any
 * window scroll (e.g. iOS auto-scrolling to reveal a focused field when the
 * keyboard opens) is reverted to this position.
 *
 * @type {{x: number, y: number}|null}
 */
let savedScrollPosition = null;

/**
 * Keys that produce a page scroll and must therefore be blocked while locked
 * (unless the focus is inside an overlay panel / editable field).
 *
 * @type {Set<string>}
 */
const SCROLL_KEYS = new Set([
	'ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End', ' ', 'Spacebar'
]);

/**
 * Determines whether an event should be allowed to scroll. Allowed only when
 * the target is inside one of the open overlay panels; everything else
 * (backdrop, body, fixed chrome) is blocked.
 *
 * @param {EventTarget|null} target
 * @returns {boolean}
 */
const isInsideAllowedPanel = (target) =>
{
	if (!(target instanceof Node))
	{
		return false;
	}

	for (let i = 0; i < allowedPanels.length; i++)
	{
		const panel = allowedPanels[i];
		if (panel && panel.contains(target))
		{
			return true;
		}
	}

	return false;
};

/**
 * Finds the open overlay panel that contains the target, if any.
 *
 * @param {EventTarget|null} target
 * @returns {Element|null}
 */
const findAllowedPanel = (target) =>
{
	if (!(target instanceof Node))
	{
		return null;
	}

	for (let i = allowedPanels.length - 1; i >= 0; i--)
	{
		const panel = allowedPanels[i];
		if (panel && panel.contains(target))
		{
			return panel;
		}
	}

	return null;
};

/**
 * Determines whether an element is a real vertical scroll container with
 * overflowing content.
 *
 * @param {Element} element
 * @returns {boolean}
 */
const isScrollableElement = (element) =>
{
	if (element.scrollHeight <= element.clientHeight + 1)
	{
		return false;
	}

	const overflowY = window.getComputedStyle(element).overflowY;
	return (overflowY === 'auto' || overflowY === 'scroll');
};

/**
 * Walks from the touch target up to (and including) the overlay panel looking
 * for a scroll container that can actually consume a vertical gesture in the
 * given direction. If none can, iOS would chain the scroll to the page behind
 * the overlay, so the gesture must be cancelled.
 *
 * @param {EventTarget|null} target - The touch target.
 * @param {Element} panel - The overlay panel containing the target.
 * @param {number} deltaY - Positive when the finger moves down (content
 *     scrolls up), negative when the finger moves up (content scrolls down).
 * @returns {boolean}
 */
const canPanelConsumeScroll = (target, panel, deltaY) =>
{
	let node = (target instanceof Element) ? target : null;
	while (node)
	{
		if (isScrollableElement(node))
		{
			if (deltaY > 0 && node.scrollTop > 0)
			{
				return true;
			}

			if (deltaY < 0 && (node.scrollTop + node.clientHeight) < (node.scrollHeight - 1))
			{
				return true;
			}
		}

		if (node === panel)
		{
			break;
		}

		node = node.parentElement;
	}

	return false;
};

/**
 * Document-level touchstart tracker. Records the starting touch position so
 * the touchmove guard can derive the gesture direction.
 *
 * @param {TouchEvent} event
 * @returns {void}
 */
const onTouchStart = (event) =>
{
	if (event.touches && event.touches.length === 1)
	{
		lastTouchY = event.touches[0].clientY;
		lastTouchX = event.touches[0].clientX;
	}
};

/**
 * Document-level touchmove guard. Cancels page scroll gestures that originate
 * outside an overlay panel, and gestures inside a panel that no scroll
 * container can consume (which iOS would otherwise chain to the page behind
 * the overlay). Multi-touch (pinch-zoom) is left untouched.
 *
 * @param {TouchEvent} event
 * @returns {void}
 */
const onTouchMove = (event) =>
{
	if (event.touches && event.touches.length > 1)
	{
		return;
	}

	const touch = event.touches[0];
	const deltaY = touch.clientY - lastTouchY;
	const deltaX = touch.clientX - lastTouchX;
	lastTouchY = touch.clientY;
	lastTouchX = touch.clientX;

	const panel = findAllowedPanel(event.target);
	if (!panel)
	{
		if (event.cancelable)
		{
			event.preventDefault();
		}
		return;
	}

	/**
	 * Horizontal-dominant gestures (carousels, sliders) cannot chain into a
	 * vertical page scroll, so they are left alone.
	 */
	if (Math.abs(deltaX) > Math.abs(deltaY))
	{
		return;
	}

	/**
	 * Allow the gesture only when something between the touch target and the
	 * panel can actually scroll in that direction. Otherwise cancel it so iOS
	 * cannot chain the scroll to the page behind the overlay (e.g. a drawer
	 * whose content is shorter than the panel, or overscroll at a boundary).
	 * Drag-to-close still works: DrawerGesture tracks the raw touch positions
	 * and applies its own transform, it does not rely on native scrolling.
	 */
	if (canPanelConsumeScroll(event.target, panel, deltaY))
	{
		return;
	}

	if (event.cancelable)
	{
		event.preventDefault();
	}
};

/**
 * Window scroll guard. While locked the page must not move at all; iOS still
 * scrolls the window programmatically when the on-screen keyboard opens to
 * reveal a focused field (no cancellable event involved). Since the overlay
 * is fixed-position, that scroll only exposes the page beneath — so it is
 * reverted immediately.
 *
 * @returns {void}
 */
const onWindowScroll = () =>
{
	if (!savedScrollPosition)
	{
		return;
	}

	if (window.scrollX !== savedScrollPosition.x || window.scrollY !== savedScrollPosition.y)
	{
		window.scrollTo(savedScrollPosition.x, savedScrollPosition.y);
	}
};

/**
 * Document-level wheel/trackpad guard. Cancels page scroll that originates
 * outside an overlay panel, or inside a panel that cannot consume the scroll
 * (desktop parity for the touch guard).
 *
 * @param {WheelEvent} event
 * @returns {void}
 */
const onWheel = (event) =>
{
	const panel = findAllowedPanel(event.target);
	if (panel)
	{
		if (Math.abs(event.deltaX) > Math.abs(event.deltaY))
		{
			return;
		}

		/**
		 * Wheel deltaY is inverted relative to touch: positive wheel delta
		 * scrolls the content down (like a finger moving up).
		 */
		if (canPanelConsumeScroll(event.target, panel, -event.deltaY))
		{
			return;
		}
	}

	if (event.cancelable)
	{
		event.preventDefault();
	}
};

/**
 * Document-level keydown guard. Blocks scroll keys (space, arrows, page
 * up/down, home/end) unless the focus is inside an overlay panel or an
 * editable field, so the composer and form inputs keep working.
 *
 * @param {KeyboardEvent} event
 * @returns {void}
 */
const onKeyDown = (event) =>
{
	if (!SCROLL_KEYS.has(event.key))
	{
		return;
	}

	const target = event.target;
	if (isInsideAllowedPanel(target))
	{
		return;
	}

	if (target instanceof HTMLElement)
	{
		const tag = target.tagName;
		if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || target.isContentEditable)
		{
			return;
		}
	}

	if (event.cancelable)
	{
		event.preventDefault();
	}
};

/**
 * Locks page scrolling. Safe to call for every overlay; only the first call
 * binds the document-level guards, but every call registers its panel so the
 * active overlay can still scroll internally.
 *
 * @param {Element} [panel] - The overlay's scrollable panel element.
 * @returns {void}
 */
export const lockBodyScroll = (panel) =>
{
	allowedPanels.push(panel);

	if (lockCount === 0)
	{
		const root = document.documentElement;
		const body = document.body;

		savedStyles = {
			rootOverscroll: root.style.overscrollBehavior,
			bodyOverscroll: body.style.overscrollBehavior
		};

		/**
		 * `overscroll-behavior: none` defeats iOS rubber-band / pull-to-refresh
		 * without reflowing the document or clamping the scroll offset, so the
		 * page does not jump and fixed elements (e.g. the bottom tab nav) stay
		 * put. The actual scroll suppression is done by the event guards below.
		 */
		root.style.overscrollBehavior = 'none';
		body.style.overscrollBehavior = 'none';

		/**
		 * Suppress page scroll via events instead of CSS. Non-passive so the
		 * handlers can call `preventDefault()`. This preserves the current
		 * scroll position exactly (no jump) and cannot be overridden by iOS
		 * re-enabling body scroll when the keyboard opens.
		 */
		document.addEventListener('touchstart', onTouchStart, { passive: true });
		document.addEventListener('touchmove', onTouchMove, { passive: false });
		document.addEventListener('wheel', onWheel, { passive: false });
		document.addEventListener('keydown', onKeyDown, { passive: false });

		/**
		 * Pin the page where it is. Any window scroll that slips past the
		 * guards (notably iOS auto-scrolling to reveal a focused field when
		 * the keyboard opens) is reverted on the next scroll event.
		 */
		savedScrollPosition = { x: window.scrollX, y: window.scrollY };
		window.addEventListener('scroll', onWindowScroll, { passive: true });
	}

	lockCount++;
};

/**
 * Releases a previously acquired scroll lock. Only the final release restores
 * the original styles and detaches the guards.
 *
 * @param {HTMLElement} [panel] - The panel passed to `lockBodyScroll`. When
 *     provided, that specific panel is removed from the allow-list so
 *     out-of-order closes don't strip the wrong overlay's scroll permission.
 * @returns {void}
 */
export const unlockBodyScroll = (panel) =>
{
	if (lockCount === 0)
	{
		return;
	}

	if (panel)
	{
		const index = allowedPanels.indexOf(panel);
		if (index !== -1)
		{
			allowedPanels.splice(index, 1);
		}
		else
		{
			allowedPanels.pop();
		}
	}
	else
	{
		allowedPanels.pop();
	}

	lockCount--;
	if (lockCount > 0 || !savedStyles)
	{
		return;
	}

	const root = document.documentElement;
	const body = document.body;

	// @ts-ignore
	root.style.overscrollBehavior = savedStyles.rootOverscroll;
	// @ts-ignore
	body.style.overscrollBehavior = savedStyles.bodyOverscroll;

	document.removeEventListener('touchstart', onTouchStart);
	document.removeEventListener('touchmove', onTouchMove);
	document.removeEventListener('wheel', onWheel);
	document.removeEventListener('keydown', onKeyDown);
	window.removeEventListener('scroll', onWindowScroll);

	savedScrollPosition = null;
	savedStyles = null;
};
