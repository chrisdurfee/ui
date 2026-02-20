import { Button as BaseButton, On, OnState, Span } from '@base-framework/atoms';
import { Atom, Component } from '@base-framework/base';
import { UniversalIcon } from '../universal-icon.js';

/**
 * ToggleButton
 *
 * A social-action style button (like, comment, share) with:
 *  - An icon that switches between inactive/active states on click
 *  - An optional value/count displayed alongside the icon
 *  - Reactive value support via `dataKey` to watch a parent data property
 *  - A `toggle` callback called with the new boolean state on each click
 *
 * @example
 * // Static value
 * new ToggleButton({ icon: Icons.heart, activeIcon: Icons.heartSolid, value: 234, toggle: (active) => {} })
 *
 * // Reactive value from parent data (watches `likeCount` key)
 * new ToggleButton({ icon: Icons.heart, dataKey: 'likeCount', toggle: (active) => {} })
 */
export class ToggleButton extends Component
{
	/**
	 * Declare public props and their defaults.
	 */
	declareProps()
	{
		/** @type {string|null} SVG icon string for the inactive state */
		this.icon = null;

		/** @type {string|null} SVG icon string for the active state. Falls back to `icon` when not set. */
		this.activeIcon = null;

		/** @type {string|number|null} Static count/value displayed next to the icon */
		this.value = null;

		/** @type {string|null} Data key to reactively watch for the displayed value */
		this.dataKey = null;

		/** @type {boolean} Initial active state */
		this.active = false;

		/** @type {Function|null} Called with the new boolean active state after each toggle */
		this.toggle = null;

		/** @type {string} Icon size: xs | sm | md | lg */
		this.size = 'sm';
	}

	/**
	 * Set up internal states.
	 *
	 * @returns {object}
	 */
	setupStates()
	{
		return {
			active: this.active ?? false
		};
	}

	/**
	 * Toggle the active state and fire the callback.
	 *
	 * @returns {void}
	 */
	handleToggle()
	{
		// @ts-ignore
		this.state.active = !this.state.active;

		if (typeof this.toggle === 'function')
		{
			// @ts-ignore
			this.toggle(this.state.active);
		}
	}

	/**
	 * Render the toggle button.
	 *
	 * @returns {object}
	 */
	render()
	{
		const size = this.size;
		const inactiveIcon = this.icon;
		const activeIcon = this.activeIcon || this.icon;

		const valueNode = (() =>
		{
			if (this.dataKey)
			{
				return Span({ class: 'toggle-btn-value text-sm tabular-nums' }, [
					On(this.dataKey, (val) => String(val))
				]);
			}

			if (this.value !== null && this.value !== undefined)
			{
				return Span({ class: 'toggle-btn-value text-sm tabular-nums' }, String(this.value));
			}

			return null;
		})();

		return BaseButton({
			click: () => this.handleToggle(),
			// @ts-ignore
			class: `toggle-btn inline-flex items-center gap-1.5 bg-transparent border-0 p-0 cursor-pointer text-foreground/70 hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${this.class || ''}`
		}, [
			OnState('active', (active) =>
				UniversalIcon({ size }, active ? activeIcon : inactiveIcon)
			),
			valueNode
		]);
	}
}

/**
 * SIZE_CLASSES maps a size token to Tailwind w/h classes.
 *
 * @constant
 * @type {object}
 */
const SIZE_CLASSES = {
	xs: 'w-6 h-6',
	sm: 'w-8 h-8',
	md: 'w-10 h-10',
	lg: 'w-12 h-12',
	xl: 'w-14 h-14',
	'2xl': 'w-16 h-16',
};

/**
 * CircleToggleButton
 *
 * A circular blur/tint button like the overlay controls in image viewers or media players.
 * Defaults to `bg-background/40 backdrop-blur-sm text-foreground`.
 * When active, applies the `activeClass` you supply (e.g. `bg-background text-foreground`).
 *
 * @example
 * new CircleToggleButton({ icon: Icons.heart, size: 'md', activeClass: 'bg-background', toggle: (active) => {} })
 * new CircleToggleButton({ icon: Icons.arrows.left, size: 'md' })
 */
export class CircleToggleButton extends Component
{
	/**
	 * Declare public props.
	 */
	declareProps()
	{
		/** @type {string|null} Icon for inactive state */
		this.icon = null;

		/** @type {string|null} Icon for active state — falls back to `icon` */
		this.activeIcon = null;

		/** @type {boolean} Initial active state */
		this.active = false;

		/** @type {string} Size token: xs | sm | md | lg | xl | 2xl */
		this.size = 'md';

		/** @type {string} Extra Tailwind classes applied when active */
		this.activeClass = '';

		/** @type {Function|null} Called with the new boolean state on each click */
		this.toggle = null;
	}

	/**
	 * Set up internal states.
	 *
	 * @returns {object}
	 */
	setupStates()
	{
		return {
			active: this.active ?? false
		};
	}

	/**
	 * Toggle active state and fire callback.
	 *
	 * @returns {void}
	 */
	handleToggle()
	{
		// @ts-ignore
		this.state.active = !this.state.active;

		if (typeof this.toggle === 'function')
		{
			// @ts-ignore
			this.toggle(this.state.active);
		}
	}

	/**
	 * Render the circular toggle button.
	 *
	 * @returns {object}
	 */
	render()
	{
		const inactiveIcon = this.icon;
		const activeIcon = this.activeIcon || this.icon;
		// @ts-ignore
		const sizeClass = SIZE_CLASSES[this.size] || SIZE_CLASSES.md;
		// @ts-ignore
		const iconSize = ['xs', 'sm'].includes(this.size) ? 'xs' : 'sm';
		const defaultClass = `bg-background/40 backdrop-blur-sm text-foreground`;
		const activeClass = this.activeClass || defaultClass;

		return BaseButton({
			click: () => this.handleToggle(),
			// @ts-ignore
			class: `circle-toggle-btn inline-flex items-center justify-center rounded-full border-0 cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 ${sizeClass} ${this.class || ''}`
		}, [
			OnState('active', (active) => [
				UniversalIcon({
					size: iconSize,
					class: `transition-colors ${active ? activeClass : defaultClass}`
				}, active ? activeIcon : inactiveIcon)
			])
		]);
	}
}

/**
 * CircleButton
 *
 * A non-toggling circular blur/tint button (e.g. back, share, menu).
 * Same visual style as CircleToggleButton without the toggle state.
 *
 * @example
 * CircleButton({ icon: Icons.arrows.left, size: 'md', click: () => {} })
 */
export const CircleButton = Atom((props, children) =>
{
	// @ts-ignore
	const size = props.size || 'md';
	const sizeClass = SIZE_CLASSES[size] || SIZE_CLASSES.md;
	const iconSize = ['xs', 'sm'].includes(size) ? 'xs' : 'sm';

	return BaseButton({
		...props,
		// @ts-ignore
		class: `circle-btn inline-flex items-center justify-center rounded-full border-0 bg-background/40 backdrop-blur-sm text-foreground cursor-pointer transition-colors hover:bg-background/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 ${sizeClass} ${props.class || ''}`
	}, [
		// @ts-ignore
		props.icon ? UniversalIcon({ size: iconSize }, props.icon) : null,
		...(children || [])
	]);
});
