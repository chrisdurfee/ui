import { Button, Div, H1, H2, H3, P } from '@base-framework/atoms';
import { Icon } from '../src/components/atoms/icon.js';
import { MaterialIcon } from '../src/components/atoms/material-icon.js';
import { Icons } from '../src/components/icons/icons.js';
import { MaterialSymbols } from '../src/components/icons/material-symbols.js';

/**
 * Material Symbols Demo
 *
 * This example demonstrates the new Material Symbols integration
 * alongside the existing Heroicons system.
 */

/**
 * Size Examples Section
 */
const SizeExamples = () => (
	Div({ class: 'mb-8' }, [
		H2({ class: 'text-2xl font-bold mb-4' }, 'Size Examples'),
		Div({ class: 'flex items-center gap-4' }, [
			Div({ class: 'flex flex-col items-center' }, [
				MaterialIcon({ name: MaterialSymbols.home, size: 'xs' }),
				P({ class: 'text-xs mt-2' }, 'xs')
			]),
			Div({ class: 'flex flex-col items-center' }, [
				MaterialIcon({ name: MaterialSymbols.home, size: 'sm' }),
				P({ class: 'text-xs mt-2' }, 'sm (default)')
			]),
			Div({ class: 'flex flex-col items-center' }, [
				MaterialIcon({ name: MaterialSymbols.home, size: 'md' }),
				P({ class: 'text-xs mt-2' }, 'md')
			]),
			Div({ class: 'flex flex-col items-center' }, [
				MaterialIcon({ name: MaterialSymbols.home, size: 'lg' }),
				P({ class: 'text-xs mt-2' }, 'lg')
			]),
			Div({ class: 'flex flex-col items-center' }, [
				MaterialIcon({ name: MaterialSymbols.home, size: 'xl' }),
				P({ class: 'text-xs mt-2' }, 'xl')
			]),
		])
	])
);

/**
 * Variant Examples Section
 */
const VariantExamples = () => (
	Div({ class: 'mb-8' }, [
		H2({ class: 'text-2xl font-bold mb-4' }, 'Style Variants'),
		Div({ class: 'flex items-center gap-6' }, [
			Div({ class: 'flex flex-col items-center' }, [
				MaterialIcon({ name: MaterialSymbols.favorite, size: 'lg', variant: 'outlined' }),
				P({ class: 'text-xs mt-2' }, 'Outlined')
			]),
			Div({ class: 'flex flex-col items-center' }, [
				MaterialIcon({ name: MaterialSymbols.favorite, size: 'lg', variant: 'filled', class: 'text-red-500' }),
				P({ class: 'text-xs mt-2' }, 'Filled')
			]),
			Div({ class: 'flex flex-col items-center' }, [
				MaterialIcon({ name: MaterialSymbols.favorite, size: 'lg', variant: 'rounded', class: 'text-pink-500' }),
				P({ class: 'text-xs mt-2' }, 'Rounded')
			]),
			Div({ class: 'flex flex-col items-center' }, [
				MaterialIcon({ name: MaterialSymbols.favorite, size: 'lg', variant: 'sharp', class: 'text-purple-500' }),
				P({ class: 'text-xs mt-2' }, 'Sharp')
			]),
		])
	])
);

/**
 * Common Icons Grid
 */
const CommonIconsGrid = () => (
	Div({ class: 'mb-8' }, [
		H2({ class: 'text-2xl font-bold mb-4' }, 'Common Material Symbols'),
		Div({ class: 'grid grid-cols-6 gap-4' }, [
			// Actions
			Div({ class: 'flex flex-col items-center p-3 border rounded' }, [
				MaterialIcon({ name: MaterialSymbols.actions.add, size: 'lg' }),
				P({ class: 'text-xs mt-2' }, 'add')
			]),
			Div({ class: 'flex flex-col items-center p-3 border rounded' }, [
				MaterialIcon({ name: MaterialSymbols.actions.edit, size: 'lg' }),
				P({ class: 'text-xs mt-2' }, 'edit')
			]),
			Div({ class: 'flex flex-col items-center p-3 border rounded' }, [
				MaterialIcon({ name: MaterialSymbols.actions.delete, size: 'lg' }),
				P({ class: 'text-xs mt-2' }, 'delete')
			]),
			Div({ class: 'flex flex-col items-center p-3 border rounded' }, [
				MaterialIcon({ name: MaterialSymbols.actions.save, size: 'lg' }),
				P({ class: 'text-xs mt-2' }, 'save')
			]),

			// Navigation
			Div({ class: 'flex flex-col items-center p-3 border rounded' }, [
				MaterialIcon({ name: MaterialSymbols.home, size: 'lg' }),
				P({ class: 'text-xs mt-2' }, 'home')
			]),
			Div({ class: 'flex flex-col items-center p-3 border rounded' }, [
				MaterialIcon({ name: MaterialSymbols.search, size: 'lg' }),
				P({ class: 'text-xs mt-2' }, 'search')
			]),
			Div({ class: 'flex flex-col items-center p-3 border rounded' }, [
				MaterialIcon({ name: MaterialSymbols.menu, size: 'lg' }),
				P({ class: 'text-xs mt-2' }, 'menu')
			]),
			Div({ class: 'flex flex-col items-center p-3 border rounded' }, [
				MaterialIcon({ name: MaterialSymbols.settings, size: 'lg' }),
				P({ class: 'text-xs mt-2' }, 'settings')
			]),

			// Status
			Div({ class: 'flex flex-col items-center p-3 border rounded' }, [
				MaterialIcon({ name: MaterialSymbols.status.error, size: 'lg', class: 'text-destructive' }),
				P({ class: 'text-xs mt-2' }, 'error')
			]),
			Div({ class: 'flex flex-col items-center p-3 border rounded' }, [
				MaterialIcon({ name: MaterialSymbols.status.warning, size: 'lg', class: 'text-warning' }),
				P({ class: 'text-xs mt-2' }, 'warning')
			]),
			Div({ class: 'flex flex-col items-center p-3 border rounded' }, [
				MaterialIcon({ name: MaterialSymbols.status.success, size: 'lg', class: 'text-green-500' }),
				P({ class: 'text-xs mt-2' }, 'success')
			]),
			Div({ class: 'flex flex-col items-center p-3 border rounded' }, [
				MaterialIcon({ name: MaterialSymbols.status.info, size: 'lg', class: 'text-blue-500' }),
				P({ class: 'text-xs mt-2' }, 'info')
			]),
		])
	])
);

/**
 * Button Integration Examples
 */
const ButtonExamples = () => (
	Div({ class: 'mb-8' }, [
		H2({ class: 'text-2xl font-bold mb-4' }, 'Buttons with Material Symbols'),
		Div({ class: 'flex gap-4' }, [
			Button({ class: 'flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded' }, [
				MaterialIcon({ name: MaterialSymbols.add, size: 'sm' }),
				'Add Item'
			]),
			Button({ class: 'flex items-center gap-2 bg-secondary text-secondary-foreground px-4 py-2 rounded' }, [
				MaterialIcon({ name: MaterialSymbols.actions.edit, size: 'sm' }),
				'Edit'
			]),
			Button({ class: 'flex items-center gap-2 bg-destructive text-destructive-foreground px-4 py-2 rounded' }, [
				MaterialIcon({ name: MaterialSymbols.actions.delete, size: 'sm' }),
				'Delete'
			]),
		])
	])
);

/**
 * Comparison with Heroicons
 */
const ComparisonSection = () => (
	Div({ class: 'mb-8' }, [
		H2({ class: 'text-2xl font-bold mb-4' }, 'Side-by-Side: Material Symbols vs Heroicons'),
		Div({ class: 'grid grid-cols-2 gap-8' }, [
			// Material Symbols
			Div({ class: 'border rounded p-4' }, [
				H3({ class: 'text-lg font-semibold mb-3' }, 'Material Symbols'),
				Div({ class: 'flex items-center gap-4' }, [
					MaterialIcon({ name: MaterialSymbols.home, size: 'lg' }),
					MaterialIcon({ name: MaterialSymbols.search, size: 'lg' }),
					MaterialIcon({ name: MaterialSymbols.settings, size: 'lg' }),
					MaterialIcon({ name: MaterialSymbols.favorite, size: 'lg', variant: 'filled', class: 'text-red-500' }),
				]),
				P({ class: 'text-sm text-muted-foreground mt-3' }, 'Font-based, 11,000+ icons, 4 style variants')
			]),

			// Heroicons
			Div({ class: 'border rounded p-4' }, [
				H3({ class: 'text-lg font-semibold mb-3' }, 'Heroicons'),
				Div({ class: 'flex items-center gap-4' }, [
					Icon({ size: 'lg' }, Icons.home),
					Icon({ size: 'lg' }, Icons.magnifying),
					Icon({ size: 'lg' }, Icons.adjustments.vertical),
					Icon({ size: 'lg' }, Icons.heart),
				]),
				P({ class: 'text-sm text-muted-foreground mt-3' }, 'SVG-based, curated set, precise control')
			]),
		])
	])
);

/**
 * Main Demo Component
 */
export const MaterialSymbolsDemo = () => (
	Div({ class: 'container mx-auto p-8' }, [
		H1({ class: 'text-4xl font-bold mb-8' }, 'Material Symbols Integration Demo'),

		P({ class: 'text-lg text-muted-foreground mb-8' },
			'The Base UI library now supports both Material Symbols and Heroicons!'
		),

		SizeExamples(),
		VariantExamples(),
		CommonIconsGrid(),
		ButtonExamples(),
		ComparisonSection(),

		// Usage Code Example
		Div({ class: 'bg-muted p-6 rounded-lg' }, [
			H3({ class: 'text-lg font-semibold mb-3' }, 'Usage Example'),
			P({ class: 'font-mono text-sm' }, `import { MaterialIcon } from '@base-framework/ui/atoms';`),
			P({ class: 'font-mono text-sm' }, `import { MaterialSymbols } from '@base-framework/ui/icons';`),
			P({ class: 'font-mono text-sm mt-2' }, ``),
			P({ class: 'font-mono text-sm' }, `MaterialIcon({ name: MaterialSymbols.home, size: 'md' })`),
			P({ class: 'font-mono text-sm' }, `MaterialIcon({ name: 'favorite', variant: 'filled' })`),
		])
	])
);
