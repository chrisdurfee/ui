import { router } from '@base-framework/base';

/**
 * Tracks the current position within the in-app history stack.
 *
 * Each call to `history.pushState` increments this counter, and the
 * value is embedded into the state object so it can be restored after
 * a hard reload or recovered on `popstate`.
 *
 * The key property: `_navPosition > 0` means there is at least one
 * prior in-app history entry that we can safely navigate back to
 * without leaving the app.
 *
 * @type {number}
 */
let _navPosition = globalThis.history?.state?._pos ?? 0;

/* istanbul ignore else -- SSR / non-browser guard */
if (typeof globalThis.history?.pushState === 'function')
{
	const _origPushState = globalThis.history.pushState;
	const _origReplaceState = globalThis.history.replaceState;

	/**
	 * Wrap pushState to increment and embed the position counter.
	 */
	globalThis.history.pushState = function (state, title, url)
	{
		_navPosition++;
		const augmented = (state !== null && typeof state === 'object')
			? { ...state, _pos: _navPosition }
			: { _pos: _navPosition };
		return _origPushState.call(this, augmented, title, url);
	};

	/**
	 * Wrap replaceState to preserve the current _pos value.
	 */
	globalThis.history.replaceState = function (state, title, url)
	{
		const currentPos = globalThis.history.state?._pos ?? _navPosition;
		const augmented = (state !== null && typeof state === 'object')
			? { ...state, _pos: currentPos }
			: { _pos: currentPos };
		return _origReplaceState.call(this, augmented, title, url);
	};

	/**
	 * Sync _navPosition on browser back/forward.
	 */
	globalThis.addEventListener('popstate', (evt) =>
	{
		const pos = /** @type {any} */ (evt.state)?._pos;
		if (typeof pos === 'number')
		{
			_navPosition = pos;
		}
	});
}

/**
 * Gets the current navigation position counter.
 *
 * @returns {number}
 */
export const getNavPosition = () => _navPosition;

/**
 * Returns true when there is in-app history we can safely go back to
 * without leaving the application.
 *
 * @param {number} entryPos - The `_navPosition` captured when the page was entered.
 * @returns {boolean}
 */
export const canGoBackInApp = (entryPos) => entryPos > 0;

/**
 * Navigates back. If in-app history exists prior to `entryPos`, uses
 * the browser's native back (`history.go`) so the user stays inside
 * the app. Otherwise falls back to `router.navigate(backUrl)` when a
 * fallback URL is provided.
 *
 * @param {number} entryPos - The `_navPosition` captured when the page was entered.
 * @param {string} [backUrl] - Fallback URL when no in-app history exists.
 */
export const navigateBack = (entryPos, backUrl) =>
{
	if (canGoBackInApp(entryPos))
	{
		const steps = (_navPosition - entryPos) + 1;
		globalThis.history.go(-steps);
		return;
	}

	if (backUrl)
	{
		router.navigate(backUrl);
	}
};

/**
 * Creates a click handler for back navigation. Captures the entry
 * position at render time so re-renders/popstate don't change the
 * target.
 *
 * @param {object} props
 * @param {string} [props.backUrl] - Fallback URL when no in-app history exists.
 * @returns {function}
 */
export const backCallBack = (props) =>
{
	const entryPos = _navPosition;
	return () => navigateBack(entryPos, props.backUrl);
};
