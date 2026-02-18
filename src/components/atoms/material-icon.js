import { Span } from "@base-framework/atoms";
import { Atom } from "@base-framework/base";

/**
 * Size classes for Material Symbols.
 * These match the Icon component sizes for consistency.
 * Uses inline styles for font-size to ensure exact pixel matching.
 */
const sizeClasses = {
	xs: "w-4 h-4",      // 16px - matches Icon
	sm: "w-6 h-6",      // 24px - matches Icon
	md: "w-8 h-8",      // 32px - matches Icon
	lg: "w-10 h-10",    // 40px - matches Icon
	xl: "w-12 h-12",    // 48px - matches Icon
	"2xl": "w-14 h-14", // 56px - matches Icon
	"3xl": "w-16 h-16", // 64px - matches Icon
};

/**
 * Font size values in pixels for Material Symbols.
 * These match the Icon component sizes exactly.
 */
const fontSizes = {
	xs: "16px",
	sm: "24px",
	md: "32px",
	lg: "40px",
	xl: "48px",
	"2xl": "56px",
	"3xl": "64px",
};

/**
 * Style variants for Material Symbols.
 * Corresponds to the different font families from Google.
 */
const styleVariants = {
	outlined: "material-symbols-outlined",
	filled: "material-symbols-filled",
	rounded: "material-symbols-rounded",
	sharp: "material-symbols-sharp",
};

/**
 * This will create a Material Icon atom using Google's Material Symbols.
 *
 * Usage:
 * ```javascript
 * MaterialIcon({ name: 'home', size: 'md', variant: 'outlined' })
 * MaterialIcon({ name: 'favorite', size: 'sm', variant: 'filled', class: 'text-red-500' })
 * ```
 *
 * @param {object} props
 * @param {string} props.name - The icon name (ligature) from Material Symbols
 * @param {string} [props.size='sm'] - Icon size: xs, sm, md, lg, xl, 2xl, 3xl
 * @param {string} [props.variant='outlined'] - Style variant: outlined, filled, rounded, sharp
 * @param {string} [props.class] - Additional CSS classes
 * @returns {object}
 */
export const MaterialIcon = Atom((props) =>
{
	// @ts-ignore
	const size = props.size || "sm";
	// @ts-ignore
	const variant = props.variant || "outlined";
	const sizeClass = sizeClasses[size] || sizeClasses.sm;
	const fontSize = fontSizes[size] || fontSizes.sm;
	const variantClass = styleVariants[variant] || styleVariants.outlined;

	return Span({
		...props,
		// @ts-ignore
		class: `inline-flex items-center justify-center ${variantClass} ${sizeClass} ${props.class || ""}`,
		// @ts-ignore
		style: `font-size: ${fontSize}; ${props.style || ""}`,
		// Remove props that shouldn't be passed to the DOM element
		size: undefined,
		variant: undefined,
		name: undefined,
	// @ts-ignore
	}, props.name);
});
