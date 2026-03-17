import { Button as BaseButton } from '@base-framework/atoms';
import { Atom, router } from '@base-framework/base';
import { Icons } from '../../icons/icons.js';
import { UniversalIcon } from '../universal-icon.js';

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
 * The history position at the time this script first ran (i.e. at page load).
 * After a browser refresh the browser restores `history.state._pos` from the
 * previous session, so `_navPosition` starts at a non-zero value even though
 * there is no real in-app back-history yet.  Comparing `entry.pos` against
 * `_restoredPos` lets the back-button detect this case and fall back to
 * `app.navigate()` instead of calling `history.go()` into stale history.
 *
 * @type {number}
 */
const _restoredPos = _navPosition;

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
 * @type {Map<string, { pos: number, sourcePath: string|null, basePath: string }>}
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
 * Returns the source entry for the given backUrl, creating one if
 * it doesn't exist yet.  If an existing entry is stale (the router
 * has moved to a different page), it is transparently replaced.
 *
 * Re-calls while still on the same page (e.g. button re-creation
 * caused by OnRoute after a tab switch) return the *original* entry
 * so that step calculations remain correct.
 *
 * @param {string} [backUrl]
 * @returns {{ pos: number, sourcePath: string|null, basePath: string }}
 */
const _getSourceEntry = (backUrl) =>
{
	const key = backUrl || '';
	const currentPath = router.path || '';

	const existing = _sourceCache.get(key);
	if (existing && _isSamePage(currentPath, existing.basePath))
	{
		return existing;
	}

	const entry = {
		pos: _navPosition,
		sourcePath: router.lastPath || null,
		basePath: _derivePageRoot(currentPath, backUrl)
	};
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
	_sourceCache.delete(backUrl || '');
};

/**
 * This will create a button.
 *
 * @param {object} defaultProps
 * @returns {object}
 */
const DefaultVariant = (defaultProps) => (
	Atom((props, children) => (
		BaseButton({
			...defaultProps,
			...props,
			// @ts-ignore
			class: `bttn ${defaultProps.class} ${props.class || ''}`
		}, children)
	))
);

/**
 *  This will create a button with an icon.
 *
 *  @param {object} props
 *  @param {array} children
 *  @returns {object}
 */
const IconButton = Atom((props, children) => (
		BaseButton({
			...props,
			// @ts-ignore
			class: props.class
		}, [
			// @ts-ignore
			props.icon && props.position !== 'right' ? UniversalIcon({ size: props.size || 'sm', class: props.animation ?? null }, props.icon) : null,
			...(children || []),
			// @ts-ignore
			props.icon && props.position === 'right' ? UniversalIcon({ size: props.size || 'sm', class: props.animation ?? null }, props.icon) : null
		])
	)
);

/**
 * This will create a button with an icon.
 *
 * @param {object} defaultProps
 * @returns {object}
 */
const WithIconVariant = (defaultProps) => (
	Atom((props, children) => (
		IconButton({
			...defaultProps,
			...props,
			// @ts-ignore
			class: `bttn ${defaultProps.class} ${props.class || ''}`
		}, children)
	))
);

/**
 * Creates a click handler that navigates back past all in-page
 * navigations (tabs, sub-routes) to the page the user came from.
 *
 * Strategy:
 *  - On page entry the handler captures `_navPosition` (the actual
 *    browser history position, accurate across back/forward usage)
 *    and `router.lastPath` (the source page path).
 *  - On click it calculates how many entries were pushed while on
 *    this page and calls `history.go(-steps)` to jump back in one
 *    step, restoring browser scroll state via the popstate handler.
 *  - If no preceding in-app history exists (direct link / new tab),
 *    it falls back to `router.navigate(sourcePath || backUrl)`.
 *
 * @param {object} props
 * @param {string} [props.backUrl] - Fallback URL when no in-app history exists.
 * @returns {function}
 */
const backCallBack = (props) =>
{
	const entry = _getSourceEntry(props.backUrl);

	return () =>
	{
		_clearSourceEntry(props.backUrl);

		const stepsSinceEntry = _navPosition - entry.pos;
		const stepsBack = stepsSinceEntry + 1;

		// Only use history.go() when real in-app history exists for this
		// session.  entry.pos > _restoredPos means at least one pushState
		// was called after this page loaded, so we have genuine back-history.
		// When entry.pos === _restoredPos the page was either refreshed or
		// opened directly — history.go() would replay stale pre-refresh
		// entries, so we navigate programmatically instead.
		if (entry.pos > _restoredPos)
		{
			globalThis.history.go(-stepsBack);
			return;
		}

		// Programmatic fallback: prefer the captured source path (the page
		// the user came from), then the explicit backUrl prop.  backUrl is
		// always the reliable last resort (e.g. after a refresh where
		// router.lastPath is null).
		const fallback = props.backUrl;
		if (fallback)
		{
			router.navigate(fallback);
		}
	};
};

/**
 * This will create a back button variant.
 *
 * @param {object} defaultProps
 * @returns {object}
 */
const BackVariant = (defaultProps) => (
	Atom((props, children) =>
	{
		// @ts-ignore
		props.icon = props.icon || Icons.arrows.left;
		// @ts-ignore
		props.click = props.click || backCallBack(props);

		return IconButton({
			...defaultProps,
			...props
		}, children);
	})
);

/**
 * This will create a circular icon button with transparent background.
 *
 * @param {object} props
 * @param {array} children
 * @returns {object}
 */
const CircleIconButton = Atom((props, children) =>
{
	// @ts-ignore
	const size = props.size || 'md';
	const sizeClasses = {
		xs: 'w-6 h-6',
		sm: 'w-8 h-8',
		md: 'w-10 h-10',
		lg: 'w-12 h-12',
		xl: 'w-14 h-14'
	};

	// @ts-ignore
	const backgroundClass = props.backgroundClass || 'bg-background/30 hover:bg-background/50';

	return BaseButton({
		...props,
		// @ts-ignore
		class: `circle-icon-btn inline-flex items-center justify-center rounded-full ${backgroundClass} text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ring-offset-background transition-colors disabled:pointer-events-none disabled:opacity-50 cursor-pointer ${sizeClasses[size] || sizeClasses.md} ${props.class || ''}`
	}, [
		// @ts-ignore
		props.icon ? UniversalIcon({ size: size === 'xs' ? 'xs' : 'sm' }, props.icon) : null,
		...(children || [])
	]);
});

/**
 * This will set upt the variants for the button.
 *
 * @constant
 * @type {object}
 */
const BUTTON_VARIANTS = {
	primary: DefaultVariant({ class: 'primary' }),
	secondary: DefaultVariant({ class: 'secondary' }),
	destructive: DefaultVariant({ class: 'destructive' }),
	warning: DefaultVariant({ class: 'warning' }),
	outline: DefaultVariant({ class: 'outline' }),
	ghost: DefaultVariant({ class: 'ghost' }),
	link: DefaultVariant({ class: 'link' }),
	icon: WithIconVariant({ class: 'icon' }),
	withIcon: WithIconVariant({ class: 'with-icon' }),
	back: BackVariant({ class: 'with-icon back-button' }),
	circleIcon: CircleIconButton,
};

/**
 * This will create a button by variant or default.
 *
 * @param {object} props
 * @param {array} children
 * @returns {object}
 */
export const Button = Atom((props, children) =>
{
	// @ts-ignore
	const VariantButton = BUTTON_VARIANTS[props.variant] || BUTTON_VARIANTS.primary;
	return VariantButton(props, children);
});

export default Button;

/**
 * This will create a primary button that has a loading icon.
 *
 * @param {object} props
 * @param {array} children
 * @returns {object}
 */
export const LoadingButton = Atom((props, children) =>
{
	return Button({ ...props, variant: 'withIcon', icon: Icons.loading, animation: 'animate-spin' }, children);
});

export { CircleButton, CircleToggleButton, ToggleButton } from './toggle-button.js';

