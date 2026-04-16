import { Button as BaseButton } from '@base-framework/atoms';
import { Atom, Data } from '@base-framework/base';
import { Icons } from '../../icons/icons.js';
import { UniversalIcon } from '../universal-icon.js';
import { getNavPosition, isBackCycle, navigateBack, navigateBackToUrl } from './back-navigation.js';

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
 * This will create a back button variant as a hybrid atom.
 * Uses Data to persist the entry position and cycle state so
 * re-renders (e.g. tab switches) keep the original values and
 * chained back-button presses don't create navigation cycles.
 *
 * @param {object} defaultProps
 * @returns {object}
 */
const BackVariant = (defaultProps) => (
	Atom((props, children) =>
	{
		// @ts-ignore
		const backUrl = props.backUrl;
		const cycle = isBackCycle();

		const data = new Data({
			entryPos: getNavPosition(),
			isCycle: cycle,
			reloaded: /** @type {any} */ (globalThis.performance?.getEntriesByType?.('navigation')?.[0])?.type === 'reload'
		});

		// @ts-ignore
		props.icon = props.icon || Icons.arrows.left;
		// @ts-ignore
		props.click = props.click || (() =>
		{
			if (data.isCycle)
			{
				navigateBackToUrl(backUrl);
			}
			else
			{
				navigateBack(data.entryPos, backUrl, data.reloaded);
			}
		});

		return IconButton({
			...defaultProps,
			...props,
			data
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
