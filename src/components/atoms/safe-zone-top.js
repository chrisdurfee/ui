import { Div } from "@base-framework/atoms";
import { Atom } from "@base-framework/base";

/**
 * SafeZoneTop
 *
 * A fixed overlay atom that fills the top safe area inset on mobile devices
 * (e.g. iOS notch / Dynamic Island).
 *
 * Usage:
 *   SafeZoneTop()
 *
 * Then offset sticky/fixed headers with `pt-[env(safe-area-inset-top)]`
 * or use the companion CSS variable `--safe-area-inset-top`.
 *
 * @param {object} [props]
 * @param {string} [props.class]
 * @param {boolean} [props.background=true]
 * @param {boolean} [props.blur=true]
 * @param {string} [props.backgroundClass='bg-background/95']
 * @param {string} [props.blurClass='backdrop-blur']
 * @param {string} [props.zIndexClass='z-9999']
 * @param {string} [props.style]
 * @returns {object}
 */
export const SafeZoneTop = Atom((props = {}) =>
{
	const {
		class: className = '',
		background = true,
		blur = true,
		backgroundClass = 'bg-background/95',
		blurClass = 'backdrop-blur',
		zIndexClass = 'z-9999',
		style = ''
	} = props;

	const classes = [
		'fixed top-0 left-0 right-0 w-full',
		zIndexClass,
		background ? backgroundClass : '',
		blur ? blurClass : '',
		className
	].filter(Boolean).join(' ');

	const inlineStyle = `height: env(safe-area-inset-top, 0px);${style ? ` ${style}` : ''}`;

	return Div({
		class: classes,
		style: inlineStyle,
		'aria-hidden': 'true'
	});
});

export default SafeZoneTop;