# Icon Systems Quick Reference

## Side-by-Side Comparison

| Feature | Heroicons | Material Symbols |
|---------|-----------|------------------|
| **Type** | SVG-based | Font-based |
| **Count** | ~300 curated | 11,000+ icons |
| **Size** | Small bundle | ~500KB fonts |
| **Variants** | Outline/Solid | Outlined/Filled/Rounded/Sharp |
| **Import** | `Icon` + `Icons` | `MaterialIcon` + `MaterialSymbols` |
| **Best For** | SVG precision | Large icon libraries |

## Usage Examples

### Heroicons (Existing)

```javascript
import { Icon } from '@base-framework/ui/atoms';
import { Icons } from '@base-framework/ui/icons';

// Basic usage
Icon({ size: 'sm' }, Icons.home)
Icon({ size: 'md' }, Icons.chat.default)

// With styling
Icon({ size: 'lg', class: 'text-primary' }, Icons.star)

// In buttons
Button({ variant: 'withIcon', icon: Icons.plus }, 'Add')
```

### Material Symbols (New)

```javascript
import { MaterialIcon } from '@base-framework/ui/atoms';
import { MaterialSymbols } from '@base-framework/ui/icons';

// Basic usage
MaterialIcon({ name: 'home', size: 'sm' })
MaterialIcon({ name: MaterialSymbols.home, size: 'md' })

// With variant
MaterialIcon({ name: 'favorite', variant: 'filled', size: 'lg' })

// With styling
MaterialIcon({
  name: MaterialSymbols.star,
  variant: 'filled',
  class: 'text-yellow-500'
})

// In buttons
Button({ class: 'flex items-center gap-2' }, [
  MaterialIcon({ name: MaterialSymbols.add, size: 'sm' }),
  'Add Item'
])
```

## Quick Props Reference

### Icon (Heroicons)
- `size`: xs | sm | md | lg | xl | 2xl | 3xl
- `class`: Additional CSS classes
- **Children**: SVG string from Icons object

### MaterialIcon (Material Symbols)
- `name`: Icon ligature name (string)
- `size`: xs | sm | md | lg | xl | 2xl | 3xl
- `variant`: outlined | filled | rounded | sharp
- `class`: Additional CSS classes

## Common Icons

| Icon | Heroicons | Material Symbols |
|------|-----------|------------------|
| **Home** | `Icons.home` | `MaterialSymbols.home` |
| **Search** | `Icons.magnifying` | `MaterialSymbols.search` |
| **Add** | `Icons.plus` | `MaterialSymbols.add` |
| **Edit** | `Icons.pencil` | `MaterialSymbols.actions.edit` |
| **Delete** | `Icons.trash` | `MaterialSymbols.actions.delete` |
| **Settings** | `Icons.adjustments.vertical` | `MaterialSymbols.settings` |
| **Menu** | `Icons.bars.default` | `MaterialSymbols.menu` |
| **Close** | `Icons.x` | `MaterialSymbols.close` |
| **Check** | `Icons.check` | `MaterialSymbols.check` |
| **Heart** | `Icons.heart` | `MaterialSymbols.favorite` |
| **Star** | `Icons.star` | `MaterialSymbols.star` |
| **User** | `Icons.user.default` | `MaterialSymbols.person` |
| **Email** | `Icons.envelope` | `MaterialSymbols.email` |
| **Phone** | `Icons.phone` | `MaterialSymbols.phone` |

## Size Comparison

| Size | Class/Pixels | Use Case |
|------|--------------|----------|
| xs   | 16px / text-base | Inline text icons |
| sm   | 20-24px / text-xl | Default, buttons |
| md   | 24px / text-2xl | Headers, emphasis |
| lg   | 30px / text-3xl | Large buttons |
| xl   | 36px / text-4xl | Feature icons |
| 2xl  | 48px / text-5xl | Hero sections |
| 3xl  | 60px / text-6xl | Landing pages |

## Material Symbols Variants

### Outlined (Default)
```javascript
MaterialIcon({ name: 'favorite', variant: 'outlined' })
```
Clean, minimal stroke style

### Filled
```javascript
MaterialIcon({ name: 'favorite', variant: 'filled' })
```
Solid, bold appearance

### Rounded
```javascript
MaterialIcon({ name: 'favorite', variant: 'rounded' })
```
Soft, friendly edges

### Sharp
```javascript
MaterialIcon({ name: 'favorite', variant: 'sharp' })
```
Angular, geometric style

## When to Use Which

### Choose Heroicons when:
- Project already uses Heroicons
- Need precise SVG control
- Prefer curated, smaller set
- SVG optimization is critical
- Need stroke customization

### Choose Material Symbols when:
- Need vast icon library (11,000+)
- Want consistent variant system
- Building Material Design interface
- Font-based rendering preferred
- Need different style variants

## Finding Icons

### Heroicons
Browse at: [https://heroicons.com/](https://heroicons.com/)
- Check `Icons` object structure in code
- Use outline or solid variants

### Material Symbols
Browse at: [https://fonts.google.com/icons](https://fonts.google.com/icons)
- Search by name
- Copy ligature name
- Use underscores for multi-word: `arrow_forward`, `check_circle`

## Common Patterns

### Navigation Item
```javascript
// Heroicons
NavLink({ href: '/home' }, [
  Icon({ size: 'sm' }, Icons.home),
  Span('Home')
])

// Material Symbols
NavLink({ href: '/home', class: 'flex items-center gap-2' }, [
  MaterialIcon({ name: MaterialSymbols.home, size: 'sm' }),
  'Home'
])
```

### Action Button
```javascript
// Heroicons
Button({ variant: 'withIcon', icon: Icons.plus }, 'Add Item')

// Material Symbols
Button({ class: 'flex items-center gap-2' }, [
  MaterialIcon({ name: MaterialSymbols.add, size: 'sm' }),
  'Add Item'
])
```

### Status Indicator
```javascript
// Heroicons
Icon({ size: 'sm', class: 'text-green-500' }, Icons.check)

// Material Symbols
MaterialIcon({
  name: MaterialSymbols.status.success,
  variant: 'filled',
  size: 'sm',
  class: 'text-green-500'
})
```

## Import Paths

```javascript
// Atoms
import { Icon, MaterialIcon } from '@base-framework/ui/atoms';

// Icon libraries
import { Icons, MaterialSymbols } from '@base-framework/ui/icons';

// Or subpath imports
import { Icon, MaterialIcon } from '@base-framework/ui/atoms';
import { Icons } from '@base-framework/ui/icons';
import { MaterialSymbols } from '@base-framework/ui/icons';
```

## Browser Support

- **Heroicons**: All modern browsers (SVG)
- **Material Symbols**: All browsers with web font support
  - Loads from Google Fonts CDN
  - Cached across page loads
  - Fallback to system fonts if CDN unavailable

## Performance Notes

### Heroicons
- Inline SVG in bundle
- Tree-shakeable (only used icons)
- No external requests
- Small file size

### Material Symbols
- External font files (~500KB total)
- CDN cached across sites
- All variants loaded once
- Font rendering performance

## Tips

1. **Mix both systems** - Use what works best for each use case
2. **Consistent sizing** - Use same size prop values for both
3. **Tailwind classes** - Both support standard Tailwind utilities
4. **Color inheritance** - Both inherit text color by default
5. **Accessibility** - Both render accessible markup

## Examples

See [examples/material-symbols-demo.js](../examples/material-symbols-demo.js) for live examples.

## Documentation

- **Heroicons**: [ui.wiki/02-Icons.md](../ui.wiki/02-Icons.md)
- **Material Symbols**: [ui.wiki/09-Material-Symbols.md](../ui.wiki/09-Material-Symbols.md)
