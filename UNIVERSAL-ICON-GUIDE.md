# Universal Icon Handler - Integration Guide

## Overview

The `UniversalIcon` utility provides seamless support for both **Heroicons (SVG)** and **Material Symbols** icon systems throughout the Base UI library. All components that accept icons now automatically detect and render the appropriate icon type.

## What Changed

### ✅ All Icon-Using Components Updated

The following components now support both icon systems:

**Atoms:**
- `Button` (IconButton, CircleIconButton)

**Molecules:**
- `Alert` - Notification alerts with icons
- `ModalHeader` / `ModalContainer` - Modal headers with icons
- `DialogContainer` - Dialog boxes with icons
- `Notification` - Toast notifications with icons
- `EmptyState` - Empty state placeholders with icons
- `ThemeToggle` - Theme switcher buttons with icons
- `Breadcrumb` - Navigation breadcrumbs with separator icons
- `ComboBox` - Dropdown selects with icons
- `ImageUploader` / `LogoUploader` - Upload buttons with icons

**Organisms:**
- `SearchInput` / `SimpleSearchInput` - Search fields with icons
- `MainLink` (Navigation) - Navigation links with icons
- `TitleHeader` (Mobile Nav) - Mobile navigation with menu icons

### ✅ Consistent Sizes

MaterialIcon sizes now **exactly match** Icon (Heroicons) sizes:
- xs: 16px (w-4 h-4)
- sm: 24px (w-6 h-6) - **default**
- md: 32px (w-8 h-8)
- lg: 40px (w-10 h-10)
- xl: 48px (w-12 h-12)
- 2xl: 56px (w-14 h-14)
- 3xl: 64px (w-16 h-16)

## Usage

### The Universal Way (Recommended)

You can now pass **either** Heroicons or Material Symbols to any component - it just works:

```javascript
import { Button, Alert, Modal } from '@base-framework/ui';
import { Icons, MaterialSymbols } from '@base-framework/ui/icons';

// Works with Heroicons (SVG)
Button({ variant: 'withIcon', icon: Icons.plus }, 'Add Item')

// Works with Material Symbols
Button({ variant: 'withIcon', icon: MaterialSymbols.add }, 'Add Item')

// Works with Material Symbol names
Button({ variant: 'withIcon', icon: 'add' }, 'Add Item')

// Alert with Heroicons
Alert({ type: 'success', icon: Icons.check, title: 'Success!' })

// Alert with Material Symbols
Alert({ type: 'success', icon: MaterialSymbols.status.success, title: 'Success!' })

// Modal with icons
new Modal({
  title: 'Edit Item',
  icon: MaterialSymbols.actions.edit  // or Icons.pencil
}).open();
```

### Material Symbol Objects with Variants

For Material Symbols, you can pass an object with variant info:

```javascript
Button({
  variant: 'withIcon',
  icon: {
    name: 'favorite',
    variant: 'filled'  // outlined, filled, rounded, sharp
  }
}, 'Like')
```

### Direct UniversalIcon Usage

You can also use `UniversalIcon` directly in your own components:

```javascript
import { UniversalIcon } from '@base-framework/ui/atoms';
import { Icons, MaterialSymbols } from '@base-framework/ui/icons';

// Automatically detects icon type
const MyComponent = Atom((props) => (
  Div([
    UniversalIcon({ size: 'md' }, props.icon),
    Span(props.label)
  ])
));

// Use with either icon system
MyComponent({ icon: Icons.home, label: 'Home' })
MyComponent({ icon: MaterialSymbols.home, label: 'Home' })
MyComponent({ icon: 'home', label: 'Home' })
```

## Icon Detection Logic

`UniversalIcon` automatically detects icon type:

1. **SVG String** (Heroicons): Contains `<svg` → renders `Icon`
2. **Object with `name`**: Has `.name` property → renders `MaterialIcon`
3. **Plain String**: No `<svg` → treats as Material Symbol name → renders `MaterialIcon`

```javascript
// These all work:
UniversalIcon({ size: 'sm' }, Icons.home)           // Heroicons SVG
UniversalIcon({ size: 'sm' }, MaterialSymbols.home)  // Material Symbol
UniversalIcon({ size: 'sm' }, 'home')               // Material Symbol name
UniversalIcon({ size: 'sm' }, { name: 'home', variant: 'filled' })  // With variant
```

## Helper Functions

Two helper functions are available for type checking:

```javascript
import { isMaterialIcon, isHeroicon } from '@base-framework/ui/atoms';

// Check if icon is Material Symbol
isMaterialIcon('home')              // true
isMaterialIcon(MaterialSymbols.add) // true (object with name)
isMaterialIcon(Icons.home)          // false (SVG string)

// Check if icon is Heroicon (SVG)
isHeroicon(Icons.home)              // true
isHeroicon('home')                  // false
```

## Component Examples

### Buttons

```javascript
// Heroicons
Button({ variant: 'withIcon', icon: Icons.plus }, 'Add')
Button({ variant: 'back', icon: Icons.arrows.left })
Button({ variant: 'circleIcon', icon: Icons.x, size: 'lg' })

// Material Symbols
Button({ variant: 'withIcon', icon: MaterialSymbols.add }, 'Add')
Button({ variant: 'back', icon: 'arrow_back' })
Button({ variant: 'circleIcon', icon: { name: 'close', variant: 'filled' } })
```

### Alerts

```javascript
// Heroicons
Alert({
  type: 'error',
  icon: Icons.exclamation,
  title: 'Error',
  description: 'Something went wrong'
})

// Material Symbols
Alert({
  type: 'error',
  icon: MaterialSymbols.status.error,
  title: 'Error',
  description: 'Something went wrong'
})
```

### Modals

```javascript
// Heroicons
new Modal({
  title: 'Settings',
  icon: Icons.adjustments.vertical,
  description: 'Configure your preferences'
}).open();

// Material Symbols
new Modal({
  title: 'Settings',
  icon: MaterialSymbols.settings,
  description: 'Configure your preferences'
}).open();
```

### Navigation

```javascript
// Heroicons
new MainLink({
  label: 'Dashboard',
  icon: Icons.home,
  href: '/dashboard'
})

// Material Symbols
new MainLink({
  label: 'Dashboard',
  icon: MaterialSymbols.home,
  href: '/dashboard'
})
```

### Search

```javascript
// Heroicons
SimpleSearchInput({
  placeholder: 'Search...',
  icon: Icons.magnifyingGlass.default
})

// Material Symbols
SimpleSearchInput({
  placeholder: 'Search...',
  icon: MaterialSymbols.search
})
```

## Creating Custom Components

When creating your own components that accept icons:

```javascript
import { Div, Span } from '@base-framework/atoms';
import { Atom } from '@base-framework/base';
import { UniversalIcon } from '@base-framework/ui/atoms';

export const CustomCard = Atom((props) => (
  Div({ class: 'card' }, [
    props.icon && Div({ class: 'card-icon' }, [
      UniversalIcon({ size: 'lg' }, props.icon)
    ]),
    Div({ class: 'card-content' }, props.children)
  ])
));

// Now it works with both icon systems:
CustomCard({ icon: Icons.star }, [...])
CustomCard({ icon: MaterialSymbols.star }, [...])
CustomCard({ icon: 'star' }, [...])
```

## Migration Guide

### Existing Code Still Works

All existing code using Heroicons continues to work without changes:

```javascript
// ✅ Still works
Button({ variant: 'withIcon', icon: Icons.plus }, 'Add')
Alert({ type: 'success', icon: Icons.check })
new Modal({ icon: Icons.settings })
```

### Adding Material Symbols

Simply substitute Material Symbol icons where desired:

```javascript
// Before (Heroicons)
Button({ variant: 'withIcon', icon: Icons.plus }, 'Add')

// After (Material Symbols)
Button({ variant: 'withIcon', icon: MaterialSymbols.add }, 'Add')

// Or just the name
Button({ variant: 'withIcon', icon: 'add' }, 'Add')
```

### Mixing Both Systems

You can use both icon systems in the same project:

```javascript
// Use Heroicons for some buttons
Button({ variant: 'withIcon', icon: Icons.pencil }, 'Edit')

// Use Material Symbols for others
Button({ variant: 'withIcon', icon: MaterialSymbols.delete }, 'Delete')

// No configuration needed - they just work together!
```

## Benefits

✅ **No Breaking Changes** - Existing Heroicons code works as-is
✅ **Automatic Detection** - No need to specify icon type
✅ **Consistent Sizes** - Same size props work for both systems
✅ **Type Safe** - TypeScript support for both icon systems
✅ **Future Proof** - Easy to add more icon systems later
✅ **Developer Friendly** - Use whichever icon system you prefer

## Performance

- **No overhead** for existing Heroicons usage
- **Minimal detection logic** (~10 lines of code)
- **No bundle size increase** if you don't use Material Symbols
- **Tree-shakeable** - Only imports what you use

## Component API

All components that previously accepted Heroicon SVG strings now accept:

1. **SVG String** (Heroicons)
2. **Material Symbol Name** (string)
3. **Material Symbol Object** `{ name: string, variant?: string }`

Components automatically detect and render the appropriate icon type.

## Troubleshooting

**Icons not rendering?**
- Ensure Material Symbols CSS is imported (automatically included via `styles.css`)
- Check icon name is correct (visit https://fonts.google.com/icons)
- Verify icon data is not null/undefined

**Wrong icon type rendered?**
- Check if SVG string contains `<svg` tag
- Ensure Material Symbol names don't accidentally contain HTML

**Size mismatch?**
- MaterialIcon now uses same pixel sizes as Icon
- Use size prop: `xs`, `sm`, `md`, `lg`, `xl`, `2xl`, `3xl`

## Documentation

- **Complete Material Symbols Guide**: [ui.wiki/09-Material-Symbols.md](../ui.wiki/09-Material-Symbols.md)
- **Heroicons Guide**: [ui.wiki/02-Icons.md](../ui.wiki/02-Icons.md)
- **Icon Systems Comparison**: [ICON-SYSTEMS.md](../ICON-SYSTEMS.md)

## Summary

🎉 **The entire Base UI library now supports both Heroicons and Material Symbols seamlessly!**

Just pass your icon - the system handles the rest.
