# Material Symbols Integration Guide

Material Symbols support has been added to the Base UI library alongside the existing Heroicons. You can now use both icon systems in your projects.

## Overview

- **Heroicons (existing)**: SVG-based icons from Heroicons library
- **Material Symbols (new)**: Font-based icons from Google Material Symbols

## Installation & Setup

The Material Symbols fonts are automatically included via the CSS import. No additional installation is needed.

## Using Material Symbols

### Basic Usage

```javascript
import { MaterialIcon } from '@base-framework/ui/atoms';
import { MaterialSymbols } from '@base-framework/ui/icons';

// Using predefined symbol names
MaterialIcon({ name: MaterialSymbols.home, size: 'md' })

// Using any Material Symbol name directly
MaterialIcon({ name: 'home', size: 'md' })
```

### MaterialIcon Component Props

- **name** (required): The icon name/ligature from Material Symbols
- **size** (optional): Icon size - `xs`, `sm`, `md`, `lg`, `xl`, `2xl`, `3xl` (default: `sm`)
- **variant** (optional): Style variant - `outlined`, `filled`, `rounded`, `sharp` (default: `outlined`)
- **class** (optional): Additional Tailwind/CSS classes

### Size Reference

| Size | Text Class | Approximate Size |
|------|------------|------------------|
| xs   | text-base  | 16px |
| sm   | text-xl    | 20px |
| md   | text-2xl   | 24px |
| lg   | text-3xl   | 30px |
| xl   | text-4xl   | 36px |
| 2xl  | text-5xl   | 48px |
| 3xl  | text-6xl   | 60px |

### Style Variants

Material Symbols come in four visual styles:

- **outlined**: Default style with stroke outlines
- **filled**: Solid filled icons
- **rounded**: Icons with rounded edges
- **sharp**: Icons with sharp, angular edges

## Examples

### Different Sizes

```javascript
MaterialIcon({ name: 'home', size: 'xs' })  // Small
MaterialIcon({ name: 'home', size: 'sm' })  // Default
MaterialIcon({ name: 'home', size: 'md' })  // Medium
MaterialIcon({ name: 'home', size: 'lg' })  // Large
```

### Different Variants

```javascript
MaterialIcon({ name: 'favorite', variant: 'outlined' })  // Default
MaterialIcon({ name: 'favorite', variant: 'filled' })    // Solid
MaterialIcon({ name: 'favorite', variant: 'rounded' })   // Rounded
MaterialIcon({ name: 'favorite', variant: 'sharp' })     // Sharp
```

### With Custom Styling

```javascript
// Custom colors
MaterialIcon({
  name: 'star',
  variant: 'filled',
  class: 'text-yellow-500'
})

// Custom size and spacing
MaterialIcon({
  name: 'search',
  size: 'lg',
  class: 'text-primary mr-2'
})
```

### In Buttons

```javascript
import { Button } from '@base-framework/ui/atoms';
import { MaterialIcon } from '@base-framework/ui/atoms';
import { MaterialSymbols } from '@base-framework/ui/icons';

Button({ variant: 'primary', class: 'flex items-center gap-2' }, [
  MaterialIcon({ name: MaterialSymbols.add, size: 'sm' }),
  'Add Item'
])
```

### Common Icons via MaterialSymbols Object

The `MaterialSymbols` object provides organized access to common icon names:

```javascript
// Top-level access
MaterialSymbols.home
MaterialSymbols.search
MaterialSymbols.settings
MaterialSymbols.favorite

// Nested categories
MaterialSymbols.actions.add
MaterialSymbols.actions.edit
MaterialSymbols.actions.delete

MaterialSymbols.arrows.left
MaterialSymbols.arrows.right
MaterialSymbols.arrows.up

MaterialSymbols.status.error
MaterialSymbols.status.warning
MaterialSymbols.status.success

MaterialSymbols.social.favorite
MaterialSymbols.social.share
```

## Using Heroicons (Existing System)

The existing Heroicons system continues to work as before:

```javascript
import { Icon } from '@base-framework/ui/atoms';
import { Icons } from '@base-framework/ui/icons';

Icon({ size: 'sm' }, Icons.home)
Icon({ size: 'md' }, Icons.chat.default)
```

## Comparison

### When to Use Material Symbols

- Need consistent icon weights/fills
- Want filled/outlined/rounded/sharp variants
- Building Material Design interfaces
- Need very large icon libraries (11,000+ icons available)
- Font-based rendering is preferred

### When to Use Heroicons

- Already using Heroicons in project
- Need SVG-based icons for advanced styling
- Prefer curated, smaller icon set
- SVG precision is important

## Finding More Icons

Browse all available Material Symbols at:
**https://fonts.google.com/icons**

All icon names use the ligature/name shown on the Google Fonts website. For multi-word icons, use underscores:

```javascript
MaterialIcon({ name: 'arrow_forward' })
MaterialIcon({ name: 'check_circle' })
MaterialIcon({ name: 'calendar_today' })
```

## Advanced Customization

### Custom Font Variation Settings

Material Symbols support variable font features. You can add custom CSS variables:

```css
.my-custom-icon {
  font-variation-settings:
    'FILL' 1,      /* 0 for outlined, 1 for filled */
    'wght' 400,    /* 100-700 */
    'GRAD' 0,      /* -25 to 200 */
    'opsz' 48;     /* 20-48 */
}
```

Then use with MaterialIcon:

```javascript
MaterialIcon({
  name: 'settings',
  class: 'my-custom-icon'
})
```

## Component Integration

### With DataTable

```javascript
{
  icon: MaterialIcon({ name: 'edit', size: 'sm' }),
  label: 'Edit',
  click: () => handleEdit()
}
```

### With Navigation

```javascript
NavLink({ href: '/home', class: 'flex items-center gap-2' }, [
  MaterialIcon({ name: MaterialSymbols.home, size: 'md' }),
  'Home'
])
```

### With Alerts

```javascript
Alert({
  type: 'success',
  title: 'Success!',
  icon: MaterialIcon({
    name: MaterialSymbols.status.success,
    variant: 'filled',
    size: 'md'
  })
})
```

## Performance Notes

- Material Symbols fonts are loaded from Google Fonts CDN
- All four variants (~500KB total) are loaded together
- Icons render as ligatures, so they're accessible and SEO-friendly
- Font caching improves performance across page loads

## Migration Tips

If you want to migrate from Heroicons to Material Symbols:

1. Keep both systems during transition
2. Update components one at a time
3. Material Symbols has most common icon names (home, search, settings, etc.)
4. Use the variant prop to match your design system

## Troubleshooting

**Icons not rendering?**
- Ensure CSS import is included (automatically imported via styles.css)
- Check network tab for font loading
- Verify icon name is correct (check Google Fonts website)

**Icons look too bold/thin?**
- Adjust size prop or add custom classes
- Material Symbols uses font weight from current context

**Need different style?**
- Use the variant prop (outlined, filled, rounded, sharp)
