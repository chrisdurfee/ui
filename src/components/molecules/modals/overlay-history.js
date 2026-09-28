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
 * be restored to the neutralized fall-back entry when the overlay closes, and
 * the number of history entries (`depth`) the overlay must unwind. The depth is
 * normally 1; it grows when an overlay below it closes out of order and hands
 * its entries over (see `popOverlayHistory`).
 *
 * @type {Array<{ instance: object, realState: object|null, depth: number }>}
 */
const stack = [];

/**
 * Whether the global popstate listener has been bound.
 *
 * @type {boolean}
 */
let bound = false;

/**
 * FIFO queue of history traversals we triggered ourselves. Each popstate that
 * results from one of them consumes the head of the queue: its `realState` is
 * restored onto the landed-on (neutralized) entry and its `after` callback is
 * run once the unwind has settled. A queue (rather than single variables) keeps
 * every close's state and callback when several overlays close before the
 * first popstate arrives.
 *
 * `after` lets callers defer work (e.g. `app.navigate`) until the overlay's
 * history unwind settles, so a navigation pushed afterwards is not reverted by
 * the back()'s popstate.
 *
 * @type {Array<{ realState: object|null, after: (function():void)|null }>}
 */
const pendingQueue = [];

/**
 * Traverses back the given number of history entries.
 *
 * @param {number} steps
 * @returns {void}
 */
const goBack = (steps) =>
{
	if (steps <= 1)
	{
		window.history.back();
		return;
	}

	window.history.go(-steps);
};

/**
 * Runs an afterSettle callback on the next tick. Used for close paths that do
 * not drive a programmatic `history.back()` (no pushed entry, non-top overlay,
 * or a close already triggered by a back navigation) so the callback contract
 * holds uniformly regardless of how the overlay closed.
 *
 * @param {(function():void)|null} after
 * @returns {void}
 */
const runAfterSettle = (after) =>
{
	if (typeof after !== 'function')
	{
		return;
	}

	// @ts-ignore
	globalThis.setTimeout(after, 0);
};

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
	if (pendingQueue.length > 0)
	{
		/**
		 * This popstate is the result of our own history traversal during a
		 * programmatic close. Restore the neutralized entry and stop.
		 */
		const pending = pendingQueue.shift();
		restoreState(pending.realState);

		/**
		 * The history unwind has settled on the restored entry. Fire any
		 * deferred callback now so navigation performed inside it lands on
		 * top of this entry instead of being reverted by this popstate.
		 */
		if (typeof pending.after === 'function')
		{
			pending.after();
		}
		return;
	}

	const top = stack.pop();
	if (!top)
	{
		return;
	}

	/**
	 * The user navigated back (gesture or button). The flag tells
	 * `popOverlayHistory` the entry is already consumed (no cleanup back()).
	 */
	top.instance.__overlayFromHistory = true;

	if (top.depth > 1)
	{
		/**
		 * This overlay also owns entries left behind by overlays below it that
		 * closed out of order. The back landed on one of those dead entries, so
		 * unwind the rest before restoring the real router state.
		 */
		const pending = { realState: top.realState, after: null };
		top.instance.__overlayPending = pending;
		pendingQueue.push(pending);
		goBack(top.depth - 1);
	}
	else
	{
		/**
		 * We've landed on the neutralized fall-back entry, so the router
		 * ignored this popstate. Restore that entry's real router state.
		 */
		restoreState(top.realState);
	}

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

	stack.push({ instance, realState, depth: 1 });
};

/**
 * Unregisters an overlay from the history guard. When the overlay was closed
 * programmatically (button, swipe-down, outside click) the pushed entry is
 * popped and the neutralized fall-back entry restored.
 *
 * @param {object} instance - The Modal/Drawer instance being closed.
 * @param {(function():void)|null} [afterSettle] - Optional callback invoked once
 *     the overlay's history unwind has settled (see `pendingQueue`).
 * @returns {void}
 */
export const popOverlayHistory = (instance, afterSettle = null) =>
{
	if (instance.__overlayFromHistory)
	{
		/**
		 * Closed in response to a back navigation — already handled in
		 * `onPopState` (entry popped, state restored).
		 */
		instance.__overlayFromHistory = false;

		/**
		 * When the back is still unwinding dead entries, the callback waits
		 * for that traversal to settle.
		 */
		const pending = instance.__overlayPending;
		instance.__overlayPending = null;
		if (pending && pendingQueue.indexOf(pending) !== -1)
		{
			pending.after = (typeof afterSettle === 'function') ? afterSettle : null;
			return;
		}

		runAfterSettle(afterSettle);
		return;
	}

	const index = stack.findIndex((entry) => entry.instance === instance);
	if (index === -1)
	{
		runAfterSettle(afterSettle);
		return;
	}

	const entry = stack[index];
	stack.splice(index, 1);

	/**
	 * Only drive a history traversal when this overlay owns the top entry.
	 * Going back now would pop the entry of the overlay above it.
	 */
	const wasTop = (index === stack.length);
	if (!wasTop)
	{
		/**
		 * Non-LIFO close: this overlay's entries sit below the overlay that
		 * was opened above it. Hand them over, so when that overlay closes it
		 * unwinds these entries too and restores this overlay's fall-back
		 * state (instead of leaving a dead entry and a neutralized fall-back
		 * behind).
		 */
		const above = stack[index];
		above.depth += entry.depth;
		above.realState = entry.realState;
		runAfterSettle(afterSettle);
		return;
	}

	pendingQueue.push({
		realState: entry.realState,
		after: (typeof afterSettle === 'function') ? afterSettle : null
	});

	try
	{
		goBack(entry.depth);
	}
	catch (e)
	{
		/**
		 * History access can throw in sandboxed contexts. No popstate will
		 * arrive, so settle now.
		 */
		const pending = pendingQueue.pop();
		runAfterSettle(pending ? pending.after : null);
	}
};
