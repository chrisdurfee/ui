/**
 * Overlay history guard.
 *
 * Without this, a mobile back-swipe (or the browser/hardware back button) while
 * a drawer or modal is open navigates the app to the previous route instead of
 * closing the overlay. To fix this we push a history entry when an overlay
 * opens; a subsequent back navigation pops that entry and we close the top
 * overlay instead of letting the route change.
 *
 * THE TRICKY PART — not re-rendering the page underneath.
 *
 * The framework router listens to `popstate` and re-runs `select()` on the
 * active route whenever the popped-to entry's state has `location === locationId`
 * (its session id). That re-render rebuilds the page (e.g. it reloads the home
 * feed list and scrolls to top). A naive "pushState on open, history.back() on
 * close" therefore reloads the page behind the overlay on every close.
 *
 * To prevent that we neutralize the entry the overlay will fall back to: on open
 * we `replaceState` a marker WITHOUT a `location` onto the current entry (so the
 * router ignores the close `popstate`), then `pushState` a fresh entry the
 * overlay lives on. When the overlay closes we land back on the neutralized
 * entry (router ignores it — no re-render) and immediately `replaceState` its
 * original router state back so future navigation still works.
 *
 * Overlays are tracked as a LIFO stack so stacked overlays close in order.
 */

/**
 * The LIFO stack of open overlays. Each entry stores the router state that must
 * be restored to the neutralized fall-back entry when the overlay closes.
 *
 * @type {Array<{ instance: object, realState: object|null }>}
 */
const stack = [];

/**
 * Whether the global popstate listener has been bound.
 *
 * @type {boolean}
 */
let bound = false;

/**
 * Number of `history.back()` calls we triggered ourselves and must therefore
 * ignore in the gesture branch of the popstate handler.
 *
 * @type {number}
 */
let pendingPops = 0;

/**
 * The router state to restore after a self-triggered (programmatic) back lands
 * on the neutralized entry.
 *
 * @type {object|null}
 */
let pendingRestore = null;

/**
 * Closes the supplied overlay instance using whichever teardown method it
 * exposes.
 *
 * @param {object} instance
 * @returns {void}
 */
const closeInstance = (instance) =>
{
	if (typeof instance.close === 'function')
	{
		instance.close();
		return;
	}

	if (typeof instance.destroy === 'function')
	{
		instance.destroy();
	}
};

/**
 * Restores a router state onto the current (neutralized) history entry so the
 * page's own back/forward navigation keeps working after the overlay closes.
 *
 * @param {object|null} realState
 * @returns {void}
 */
const restoreState = (realState) =>
{
	try
	{
		window.history.replaceState(realState ?? {}, '', window.location.href);
	}
	catch (e)
	{
		// History access can throw in sandboxed contexts; ignore.
	}
};

/**
 * Handles back navigations while overlays are open.
 *
 * @returns {void}
 */
const onPopState = () =>
{
	if (pendingPops > 0)
	{
		/**
		 * This popstate is the result of our own `history.back()` during a
		 * programmatic close. Restore the neutralized entry and stop.
		 */
		pendingPops--;
		restoreState(pendingRestore);
		pendingRestore = null;
		return;
	}

	const top = stack.pop();
	if (!top)
	{
		return;
	}

	/**
	 * The user navigated back (gesture or button). We've landed on the
	 * neutralized fall-back entry, so the router ignored this popstate. Restore
	 * that entry's real router state, then close the overlay. The flag tells
	 * `popOverlayHistory` the entry is already consumed (no cleanup back()).
	 */
	restoreState(top.realState);
	top.instance.__overlayFromHistory = true;
	closeInstance(top.instance);
};

/**
 * Binds the global popstate listener once.
 *
 * @returns {void}
 */
const ensureBound = () =>
{
	if (bound)
	{
		return;
	}

	bound = true;
	window.addEventListener('popstate', onPopState);
};

/**
 * Registers an overlay with the history guard.
 *
 * Neutralizes the current entry (so closing the overlay won't re-render the
 * page) and pushes a fresh entry for the overlay to live on.
 *
 * @param {object} instance - The Modal/Drawer instance being opened.
 * @returns {void}
 */
export const pushOverlayHistory = (instance) =>
{
	ensureBound();

	/**
	 * The router state of the entry the overlay will fall back to on close.
	 * Saved so it can be restored after the overlay is dismissed.
	 */
	const realState = window.history.state;

	try
	{
		/**
		 * Strip `location` from the fall-back entry so the router's popstate
		 * handler ignores the back navigation that closes the overlay.
		 */
		window.history.replaceState({ __overlayNeutral: true }, '', window.location.href);

		/**
		 * Push the entry the overlay lives on. It carries the real router state
		 * so a higher stacked overlay can neutralize and later restore it.
		 */
		window.history.pushState(realState ?? { __overlay: true }, '', window.location.href);
	}
	catch (e)
	{
		// If history access fails the overlay still works; back just navigates.
	}

	stack.push({ instance, realState });
};

/**
 * Unregisters an overlay from the history guard. When the overlay was closed
 * programmatically (button, swipe-down, outside click) the pushed entry is
 * popped and the neutralized fall-back entry restored.
 *
 * @param {object} instance - The Modal/Drawer instance being closed.
 * @returns {void}
 */
export const popOverlayHistory = (instance) =>
{
	if (instance.__overlayFromHistory)
	{
		/**
		 * Closed in response to a back navigation — already handled in
		 * `onPopState` (entry popped, state restored).
		 */
		instance.__overlayFromHistory = false;
		return;
	}

	const index = stack.findIndex((entry) => entry.instance === instance);
	if (index === -1)
	{
		return;
	}

	const entry = stack[index];
	stack.splice(index, 1);

	/**
	 * Only drive `history.back()` when this overlay owns the top entry. For the
	 * rare non-LIFO close we just drop our record and leave the stale entry to
	 * be cleaned up when the real top overlay closes.
	 */
	const wasTop = (index === stack.length);
	if (!wasTop)
	{
		return;
	}

	pendingRestore = entry.realState;
	pendingPops++;
	window.history.back();
};
