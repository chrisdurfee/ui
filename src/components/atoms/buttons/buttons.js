import { Button as BaseButton } from '@base-framework/atoms';
import { Atom } from '@base-framework/base';
import { Icons } from '../../icons/icons.js';
import { UniversalIcon } from '../universal-icon.js';

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
	// Snapshot taken once, at button-creation time (page landing).
	const entryHistoryLength = globalThis.history.length;

	return () =>
	{
		const currentLength = globalThis.history.length;
		const stepsAdded = currentLength - entryHistoryLength;
		const stepsBack = stepsAdded + 1;

		// entryHistoryLength > 1 means there was at least one page
		// in the session before we landed here.
		if (props.allowHistory === true && entryHistoryLength > 1)
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
 * Creates a click handler that records the history length when the
 * page first renders and skips past any in-page navigations (tabs,
 * sub-routes) that were pushed after arrival.
 *
 * - If prior history exists it calls `history.go(-(stepsAdded + 1))`
 *   to jump past every in-page entry AND the initial navigation to
 *   this page, landing you back on the originating page.
 * - Falls back to `props.backUrl` when the user arrived via a direct
 *   link (no prior history).
 *
 * @param {object} props
 * @param {string} [props.backUrl] - Fallback URL when no history exists.
 * @returns {function}
 */
const smartBackCallBack = (props) =>
{
	// Snapshot taken once, at button-creation time (page landing).
	const entryHistoryLength = globalThis.history.length;

	return () =>
	{
		const currentLength = globalThis.history.length;
		const stepsAdded = currentLength - entryHistoryLength;
		const stepsBack = stepsAdded + 1;

		// entryHistoryLength > 1 means there was at least one page
		// in the session before we landed here.
		if (entryHistoryLength > 1)
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

