import { Button as BaseButton } from '@base-framework/atoms';
import { Atom } from '@base-framework/base';
import { Icons } from '../../icons/icons.js';
import { UniversalIcon } from '../universal-icon.js';

/**
 * Counts history.pushState calls observed since the module loaded.
 * The Base Framework router uses replaceState for the initial route
 * and pushState for every subsequent in-app navigation, so this
 * counter reliably tracks real user navigations regardless of when
 * the module is first imported (eager or lazy).
 *
 * @type {number}
 */
let _appPushCount = 0;

/**
 * Stores entry-point snapshots keyed by backUrl so that back-button
 * closures survive OnRoute-driven re-creation (which rebuilds the
 * DOM tree — including the back button — on every route change).
 *
 * Each entry records the history.length and _appPushCount at the time
 * the back button was first created for that page visit, plus the
 * route path at that moment so we can detect stale entries.
 *
 * @type {Map<string, { historyLength: number, pushCount: number, basePath: string }>}
 */
const _pageEntrySnapshots = new Map();

/**
 * Returns the current route path, normalised for comparison.
 * Works with both hash-based and path-based routing.
 *
 * @returns {string}
 */
const _getRoutePath = () =>
{
	const hash = globalThis.location?.hash || '';
	const raw = hash
		? hash.replace(/^#\/?/, '')
		: (globalThis.location?.pathname || '/');
	return raw.replace(/^\/+/, '');
};

/* istanbul ignore else -- SSR / non-browser guard */
if (typeof globalThis.history?.pushState === 'function')
{
	const _origPushState = globalThis.history.pushState;
	globalThis.history.pushState = function (...args)
	{
		_appPushCount++;

		// Proactively clear snapshots when navigating AWAY from a
		// stored page.  This prevents stale data if the user leaves
		// via a link (instead of the back button) and later returns.
		const pushedUrl = String(args[2] || '').replace(/^[#/]+/, '');
		for (const [key, snap] of _pageEntrySnapshots)
		{
			if (
				snap.basePath &&
				pushedUrl !== snap.basePath &&
				!pushedUrl.startsWith(snap.basePath + '/')
			)
			{
				_pageEntrySnapshots.delete(key);
			}
		}

		return _origPushState.apply(this, args);
	};
}

/**
 * Returns the snapshot for the given backUrl, creating one if it
 * doesn't exist yet.  Re-calls with the same backUrl (button
 * re-creation caused by OnRoute) return the original snapshot so
 * that history-step calculations remain correct across tab switches.
 *
 * @param {string} [backUrl]
 * @returns {{ historyLength: number, pushCount: number, basePath: string }}
 */
const _getPageEntrySnapshot = (backUrl) =>
{
	const key = backUrl || '';

	if (_pageEntrySnapshots.has(key))
	{
		return /** @type {{ historyLength: number, pushCount: number, basePath: string }} */ (_pageEntrySnapshots.get(key));
	}

	const snapshot = {
		historyLength: globalThis.history.length,
		pushCount: _appPushCount,
		basePath: _getRoutePath()
	};
	_pageEntrySnapshots.set(key, snapshot);
	return snapshot;
};

/**
 * Removes the snapshot for backUrl (called after the back button
 * successfully navigates away).
 *
 * @param {string} [backUrl]
 * @returns {void}
 */
const _clearPageEntrySnapshot = (backUrl) =>
{
	_pageEntrySnapshots.delete(backUrl || '');
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
 *  This will create a back button that navigates to the previous page or a specified URL.
 *
 *  @param {object} props
 *   @returns {function}
 */
const backCallBack = (props) =>
{
	// Retrieve (or create) the entry-point snapshot for this page.
	// The snapshot survives button re-creation caused by OnRoute re-fires
	// (which rebuild the DOM tree on every route change, including tabs).
	const entry = _getPageEntrySnapshot(props.backUrl);

	return () =>
	{
		// Clean up — we're leaving this page.
		_clearPageEntrySnapshot(props.backUrl);

		const stepsAdded = globalThis.history.length - entry.historyLength;
		const stepsBack = stepsAdded + 1;

		// entry.pushCount > 0 means the user navigated here via in-app
		// routing (at least one pushState before this page was entered).
		// stepsBack accounts for tab / sub-route switches that happened
		// since the page was entered, plus the page entry itself.
		if (props.allowHistory === true && entry.pushCount > 0)
		{
			globalThis.history.go(-stepsBack);
			return;
		}

		if (props.backUrl)
		{
			// @ts-ignore
			app.navigate(props.backUrl);
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
 * Creates a click handler that uses a persistent entry-point snapshot
 * to skip past any in-page navigations (tabs, sub-routes) that were
 * pushed after arrival.
 *
 * The snapshot is stored in a module-level map keyed by backUrl so it
 * survives OnRoute-driven button re-creation.  The pushState
 * interceptor proactively clears stale snapshots when it detects
 * navigation away from the tracked page.
 *
 * - If entry.pushCount > 0 (real in-app history exists), it calls
 *   `history.go(-(stepsAdded + 1))` to jump past every in-page
 *   entry AND the initial navigation to this page.
 * - Falls back to `props.backUrl` when no in-app navigation existed
 *   before the page was entered (e.g. a direct link / new tab).
 *
 * @param {object} props
 * @param {string} [props.backUrl] - Fallback URL when no history exists.
 * @returns {function}
 */
const smartBackCallBack = (props) =>
{
	const entry = _getPageEntrySnapshot(props.backUrl);

	return () =>
	{
		_clearPageEntrySnapshot(props.backUrl);

		const stepsAdded = globalThis.history.length - entry.historyLength;
		const stepsBack = stepsAdded + 1;

		// entry.pushCount > 0 means the user navigated here via in-app
		// routing.  stepsBack accounts for tab / sub-route switches
		// plus the page entry itself.
		if (entry.pushCount > 0)
		{
			globalThis.history.go(-stepsBack);
			return;
		}

		if (props.backUrl)
		{
			// @ts-ignore
			app.navigate(props.backUrl);
		}
	};
};

/**
 * SmartBack button variant.
 *
 * Unlike the regular `back` variant (which calls `history.back()` and
 * can get trapped by in-page tab / sub-route navigations), SmartBack
 * captures the browser history length when the button is first created
 * and uses that snapshot to jump all the way back to the originating
 * page.
 *
 * Props:
 * - `backUrl` {string}  – Fallback URL used when there is no prior
 *    session history (e.g. a direct link or new tab).
 * - `icon`    {string}  – Override the default left-arrow icon.
 *
 * @param {object} defaultProps
 * @returns {object}
 */
const SmartBackVariant = (defaultProps) => (
	Atom((props, children) =>
	{
		// @ts-ignore
		props.icon = props.icon || Icons.arrows.left;
		// @ts-ignore
		props.click = props.click || smartBackCallBack(props);

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
	smartBack: SmartBackVariant({ class: 'with-icon back-button' }),
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

