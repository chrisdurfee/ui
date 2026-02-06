import { Span } from "@base-framework/atoms";
import { Atom } from "@base-framework/base";

/**
 * Size classes for Material Symbols.
 */
const sizeClasses = {
	xs: "text-base",      // 16px
	sm: "text-xl",        // 20px
	md: "text-2xl",       // 24px
	lg: "text-3xl",       // 30px
	xl: "text-4xl",       // 36px
	"2xl": "text-5xl",    // 48px
	"3xl": "text-6xl",    // 60px
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
	const size = props.size || "sm";
	const variant = props.variant || "outlined";
	const sizeClass = sizeClasses[size] || sizeClasses.sm;
	const variantClass = styleVariants[variant] || styleVariants.outlined;

	return Span({
		...props,
		class: `${variantClass} ${sizeClass} ${props.class || ""}`,
		// Remove props that shouldn't be passed to the DOM element
		size: undefined,
		variant: undefined,
		name: undefined,
	}, props.name);
});
