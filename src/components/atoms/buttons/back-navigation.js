import { router } from '@base-framework/base';

/**
 * Tracks the actual browser history position by embedding a monotonic
 * `_pos` counter into every `history.pushState` state object, then
 * syncing via `popstate` when the user navigates with browser back/forward.
 *
 * Unlike an increment-only counter, this value stays accurate across
 * browser back/forward clicks, making `history.go(-N)` calculations
 * reliable regardless of in-page tab or sub-route navigations.
 *
 * Initialised from `history.state._pos` when available so that the
 * correct position is restored after a hard page refresh.
 *
 * @type {number}
 */
let _navPosition = globalThis.history?.state?._pos ?? 0;

/**
 * Stores per-page source entries keyed by backUrl so that back-button
 * closures survive OnRoute-driven re-creation (which rebuilds the DOM
 * tree — including the back button — on every route change).
 *
 * Each entry captures:
 *  - `pos`        — the history position when the page was entered
 *  - `sourcePath` — `router.lastPath` at entry time (the page you came from)
 *  - `basePath`   — the current page's root path (used for same-page validation)
 *
 * @type {Map<string, { key: string, pos: number, sourcePath: string|null, basePath: string }>}
 */
const _sourceCache = new Map();

/**
 * Normalises a route path for same-page comparisons by stripping
 * leading and trailing slashes.
 *
 * @param {string} path
 * @returns {string}
 */
const _normPath = (path) => (path || '').replace(/^\/+/, '').replace(/\/+$/, '');

/**
 * Returns true when `currentPath` still belongs to the same page as
 * `basePath` (exact match or sub-path, e.g. a tab route).
 *
 * @param {string} currentPath
 * @param {string} basePath
 * @returns {boolean}
 */
const _isSamePage = (currentPath, basePath) =>
{
	if (!basePath) return false;
	const cur = _normPath(currentPath);
	const base = _normPath(basePath);
	return cur === base || cur.startsWith(base + '/');
};

/**
 * Derives the stable "page root" from the current route path and the
 * backUrl.  The page root is the path prefix shared by ALL tabs and
 * sub-routes on this page.
 *
 * Algorithm: take `backUrl` as the known parent, then append exactly
 * one additional path segment from `currentPath`.
 *
 * Examples:
 *   backUrl='/members', path='/members/123/garage' → 'members/123'
 *   backUrl='/settings', path='/settings/profile'   → 'settings/profile'
 *
 * @param {string} currentPath
 * @param {string} [backUrl]
 * @returns {string}
 */
const _derivePageRoot = (currentPath, backUrl) =>
{
	const cur = _normPath(currentPath);
	if (!backUrl) return cur;

	const back = _normPath(backUrl);
	if (!cur.startsWith(back)) return cur;

	const rest = cur.substring(back.length);
	if (!rest || rest === '/') return cur;

	const afterSlash = rest.startsWith('/') ? rest.substring(1) : rest;
	const nextSlash = afterSlash.indexOf('/');
	if (nextSlash < 0) return cur;

	return back + '/' + afterSlash.substring(0, nextSlash);
};

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
	 * Wrap pushState to embed the current position counter into every
	 * state object.  The router's own state fields (location, uri,
	 * scrollPosition) are preserved via object spread.
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
	 * Wrap replaceState to preserve the current _pos value so that
	 * states created with replaceState (e.g. the initial navigation)
	 * can still be read back correctly on popstate.
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
	 * Sync _navPosition whenever the user navigates with the browser's
	 * own back/forward controls.  Reading _pos from the restored state
	 * object gives the exact history position, keeping step calculations
	 * accurate after any number of browser back/forward clicks.
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
 * Persists entry metadata into `history.state` so it survives refresh and
 * browser back/forward revisits.
 *
 * @param {{ key: string, pos: number, sourcePath: string|null, basePath: string }} entry
 * @returns {void}
 */
const _persistEntryState = (entry) =>
{
	const state = globalThis.history?.state || {};

	if (
		state._entryKey === entry.key
		&& state._entryPos === entry.pos
		&& state._entrySourcePath === entry.sourcePath
		&& state._entryBasePath === entry.basePath
	)
	{
		return;
	}

	try
	{
		globalThis.history.replaceState(
			{
				...state,
				_entryKey: entry.key,
				_entryPos: entry.pos,
				_entrySourcePath: entry.sourcePath,
				_entryBasePath: entry.basePath
			},
			'',
			globalThis.location?.href
		);
	}
	catch (e) { /* SSR or security restriction */ }
};

/**
 * Returns the source entry for the given backUrl, creating one if
 * it doesn't exist yet.  If an existing entry is stale (the router
 * has moved to a different page), it is transparently replaced.
 *
 * Re-calls while still on the same page (e.g. button re-creation
 * caused by OnRoute after a tab switch) return the *original* entry
 * so that step calculations remain correct.
 *
 * Entry metadata is persisted into `history.state` so refreshes and
 * popstate revisits can restore the original source/position context.
 *
 * @param {string} [backUrl]
 * @returns {{ key: string, pos: number, sourcePath: string|null, basePath: string }}
 */
const _getSourceEntry = (backUrl) =>
{
	const state = globalThis.history?.state || {};
	const currentPath = router.path || '';
	const basePath = _derivePageRoot(currentPath, backUrl);
	const persistedBasePath = state._entryBasePath;
	const canReusePersisted = typeof persistedBasePath === 'string'
		&& persistedBasePath.length > 0
		&& _isSamePage(currentPath, persistedBasePath);

	const stateKey = (canReusePersisted && typeof state._entryKey === 'string' && state._entryKey)
		? state._entryKey
		: `${backUrl || ''}|${basePath}|${_navPosition}`;

	const key = stateKey;

	const existing = _sourceCache.get(key);
	if (existing && _isSamePage(currentPath, existing.basePath))
	{
		_persistEntryState(existing);
		return existing;
	}

	const persistedPos = canReusePersisted ? state._entryPos : undefined;
	const persistedSourcePath = canReusePersisted ? state._entrySourcePath : undefined;

	const pos = (typeof persistedPos === 'number') ? persistedPos : _navPosition;
	const sourcePath = (typeof persistedSourcePath === 'string' || persistedSourcePath === null)
		? persistedSourcePath
		: (router.lastPath || null);
	const restoredBasePath = (canReusePersisted && typeof persistedBasePath === 'string' && persistedBasePath)
		? persistedBasePath
		: basePath;

	const entry = {
		key,
		pos,
		sourcePath,
		basePath: restoredBasePath
	};

	_persistEntryState(entry);
	_sourceCache.set(key, entry);
	return entry;
};

/**
 * Removes the source entry for backUrl (called when the back button fires).
 *
 * @param {string} [backUrl]
 * @returns {void}
 */
const _clearSourceEntry = (backUrl) =>
{
	const stateKey = globalThis.history?.state?._entryKey;
	if (typeof stateKey === 'string' && stateKey)
	{
		_sourceCache.delete(stateKey);
	}

	if (backUrl)
	{
		_sourceCache.delete(backUrl);
	}
};

/**
 * Creates a click handler that navigates back past all in-page
 * navigations (tabs, sub-routes) to the page the user came from.
 *
 * Strategy:
 *  - On page entry the handler captures `_navPosition` (the actual
 *    browser history position, accurate across back/forward usage)
 *    and `router.lastPath` (the source page path).  This position
 *    is persisted in `history.state._entryPos` so it survives a
 *    page refresh.
 *  - On click it calculates how many history entries were pushed
 *    while on this page and calls `history.go(-steps)` to jump
 *    back in one step, restoring browser scroll state.
 *  - If no in-app history exists before the entry (direct link /
 *    new tab where `entry.pos === 0`), it falls back to
 *    `router.navigate()` using the explicit backUrl prop.
 *
 * @param {object} props
 * @param {string} [props.backUrl] - Fallback URL when no in-app history exists.
 * @returns {function}
 */
export const backCallBack = (props) =>
{
	const reloaded = _isReload();
	const entry = _getSourceEntry(props.backUrl);

	return () =>
	{
		_clearSourceEntry(props.backUrl);

		const stepsBack = (_navPosition - entry.pos) + 1;
		const sourcePath = entry.sourcePath;
		const hasValidSource = typeof sourcePath === 'string'
			&& sourcePath.length > 0
			&& !_isSamePage(sourcePath, entry.basePath);

		// entry.pos > 0 means the user arrived here via at least one
		// in-app pushState — real backward history exists.  The entry
		// position may have been restored from history.state._entryPos
		// after a page refresh, so this works across refreshes too.
		if (!reloaded && entry.pos > 0)
		{
			globalThis.history.go(-stepsBack);
			return;
		}

		// On reload (or when no backward history exists), prefer the
		// captured source area when available; otherwise use backUrl.
		if (hasValidSource)
		{
			router.navigate(sourcePath);
			return;
		}

		if (props.backUrl)
		{
			router.navigate(props.backUrl);
		}
	};
};
