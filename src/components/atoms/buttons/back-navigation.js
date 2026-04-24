import { router } from '@base-framework/base';

/**
 * Tracks the actual browser history position by embedding a monotonic
 * `_pos` counter into every `history.pushState` state object, then
 * syncing via `popstate` when the user navigates with browser back/forward.
 *
 * Initialised from `history.state._pos` when available so that the
 * correct position is restored after a hard page refresh.
 *
 * @type {number}
 */
let _navPosition = globalThis.history?.state?._pos ?? 0;

/**
 * Tracks the normalised path a back-button just navigated FROM.
 * Used to detect cycles: if the next page's `router.lastPath`
 * matches this value, using it as a back target would loop.
 *
 * Cleared automatically on genuine forward navigations (pushState
 * calls that are NOT triggered by a back-button fallback).
 *
 * @type {string|null}
 */
let _lastBackFrom = null;

/**
 * Counter of pending back-navigations that will trigger pushState
 * internally (via `router.navigate`).  Each back-button fallback
 * increments this before calling navigate; the pushState wrapper
 * decrements instead of clearing `_lastBackFrom`, keeping cycle
 * detection intact across chained back presses.
 *
 * @type {number}
 */
let _backNavPending = 0;

/**
 * Normalises a route path by stripping leading and trailing slashes.
 *
 * @param {string} path
 * @returns {string}
 */
const _normPath = (path) => (path || '').replace(/^\/+/, '').replace(/\/+$/, '');

/**
 * Returns true when the current page load is a browser reload.
 *
 * @returns {boolean}
 */
const _isReload = () =>
{
	try
	{
		const nav = /** @type {any} */ (globalThis.performance?.getEntriesByType?.('navigation')?.[0]);
		return nav?.type === 'reload';
	}
	catch (e)
	{
		return false;
	}
};

/* istanbul ignore else -- SSR / non-browser guard */
if (typeof globalThis.history?.pushState === 'function')
{
	const _origPushState = globalThis.history.pushState;
	const _origReplaceState = globalThis.history.replaceState;

	/**
	 * Wrap pushState to embed the position counter and manage the
	 * cycle-detection state.  Genuine forward navigations clear
	 * `_lastBackFrom`; back-button fallbacks decrement the pending
	 * counter instead.
	 */
	globalThis.history.pushState = function (state, title, url)
	{
		_navPosition++;

		if (_backNavPending > 0)
		{
			_backNavPending--;
		}
		else
		{
			_lastBackFrom = null;
		}

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
 * Checks whether using `router.lastPath` as a back target would
 * create a cycle (i.e. the user just backed FROM that path).
 *
 * @returns {boolean}
 */
export const isBackCycle = () =>
{
	if (_lastBackFrom === null) return false;
	const lastPath = _normPath(router.lastPath || '');
	if (!lastPath) return false;
	return lastPath === _lastBackFrom;
};

/**
 * Navigates back using `history.go(-steps)` when valid history
 * exists, falling back to `router.navigate(backUrl)`.
 *
 * @param {number} entryPos - The `_navPosition` captured when the page was entered.
 * @param {string} [backUrl] - Fallback URL for direct-link / no-history cases.
 * @param {boolean} [reloaded] - Whether the page was loaded via browser reload.
 */
export const navigateBack = (entryPos, backUrl, reloaded = false) =>
{
	_lastBackFrom = _normPath(router.path || '');

	const steps = (_navPosition - entryPos) + 1;
	if (!reloaded && entryPos > 0 && steps > 0)
	{
		globalThis.history.go(-steps);
		return;
	}

	if (backUrl)
	{
		_backNavPending++;
		router.navigate(backUrl);
	}
};

/**
 * Navigates back via `router.navigate()` to the given URL.
 * Used when cycle detection prevents `history.go()`.
 *
 * @param {string} [backUrl] - The URL to navigate to.
 */
export const navigateBackToUrl = (backUrl) =>
{
	_lastBackFrom = _normPath(router.path || '');

	if (backUrl)
	{
		_backNavPending++;
		router.navigate(backUrl);
	}
};

/**
 * Creates a click handler for back navigation.
 *
 * @param {object} props
 * @param {string} [props.backUrl] - Fallback URL when no in-app history exists.
 * @returns {function}
 */
export const backCallBack = (props) =>
{
	const cycle = isBackCycle();
	const entryPos = _navPosition;
	const reloaded = _isReload();

	return () =>
	{
		if (cycle)
		{
			navigateBackToUrl(props.backUrl);
		}
		else
		{
			navigateBack(entryPos, props.backUrl, reloaded);
		}
	};
};
