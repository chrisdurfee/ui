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
 * are allowed through so the overlay content (lists, composer, etc.) still
 * scrolls normally.
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
 * Document-level touchmove guard. Cancels page scroll gestures that originate
 * outside an overlay panel. Multi-touch (pinch-zoom) is left untouched.
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

	if (isInsideAllowedPanel(event.target))
	{
		return;
	}

	if (event.cancelable)
	{
		event.preventDefault();
	}
};

/**
 * Document-level wheel/trackpad guard. Cancels page scroll that originates
 * outside an overlay panel (desktop parity for the touch guard).
 *
 * @param {WheelEvent} event
 * @returns {void}
 */
const onWheel = (event) =>
{
	if (isInsideAllowedPanel(event.target))
	{
		return;
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
		document.addEventListener('touchmove', onTouchMove, { passive: false });
		document.addEventListener('wheel', onWheel, { passive: false });
		document.addEventListener('keydown', onKeyDown, { passive: false });
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

	document.removeEventListener('touchmove', onTouchMove);
	document.removeEventListener('wheel', onWheel);
	document.removeEventListener('keydown', onKeyDown);

	savedStyles = null;
};
