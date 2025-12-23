# Icons Guide - Base Framework UI

## Overview
Icons in Base Framework UI come from the Heroicons library and are provided as SVG strings. Understanding how to use icons correctly is **critical** as this is one of the most common mistake areas.

## Importing Icons

**ALWAYS import both the Icons object and the Icon atom:**

```javascript
import { Icons } from '@base-framework/ui/icons';
import { Icon } from '@base-framework/ui/atoms';
```

## Three Methods to Use Icons

### Method 1: Icon Atom (RECOMMENDED)

The Icon atom provides size management and consistent styling:

```javascript
import { Icon } from '@base-framework/ui/atoms';
import { Icons } from '@base-framework/ui/icons';

// Basic icon
Icon({ size: 'sm' }, Icons.home)

// Icon with custom class
Icon({ size: 'md', class: 'text-blue-500' }, Icons.chat.default)

// Animated icon
Icon({ size: 'lg', class: 'animate-spin' }, Icons.loading)
```

**Available Sizes:**
- `xs` - 16px (w-4 h-4)
- `sm` - 24px (w-6 h-6) - **default**
- `md` - 32px (w-8 h-8)
- `lg` - 40px (w-10 h-10)
- `xl` - 48px (w-12 h-12)
- `2xl` - 56px (w-14 h-14)
- `3xl` - 64px (w-16 h-16)

### Method 2: Raw I Element

Use the `I` element from `@base-framework/atoms` with the `html` prop:

```javascript
import { I } from '@base-framework/atoms';
import { Icons } from '@base-framework/ui/icons';

// Basic usage
I({ html: Icons.home, class: 'w-6 h-6' })

// With custom styling
I({ html: Icons.star, class: 'w-8 h-8 text-yellow-500' })
```

### Method 3: In Buttons

Buttons with the `withIcon` variant accept an `icon` prop:

```javascript
import { Button } from '@base-framework/ui/atoms';
import { Icons } from '@base-framework/ui/icons';

// Icon on left (default)
Button({
  variant: 'withIcon',
  icon: Icons.plus
}, 'Add')

// Icon on right
Button({
  variant: 'withIcon',
  icon: Icons.arrows.right,
  position: 'right'
}, 'Next')

// Icon only
Button({
  variant: 'withIcon',
  icon: Icons.close
})
```

## Icon Paths

Icons are organized hierarchically in the Icons object:

### Simple Icons (Direct Access)
```javascript
Icons.home
Icons.star
Icons.help
Icons.info
Icons.plus
Icons.minus
Icons.close
Icons.check
Icons.trash
Icons.edit
Icons.search
Icons.filter
Icons.settings
Icons.user
Icons.users
Icons.calendar
Icons.clock
Icons.mail
Icons.phone
```

### Nested Icons (Dot Notation)
```javascript
// Arrows
Icons.arrows.left
Icons.arrows.right
Icons.arrows.up
Icons.arrows.down

// Chat
Icons.chat.default
Icons.chat.bubble

// Adjustments
Icons.adjustments.vertical
Icons.adjustments.horizontal
```

## Common Mistakes

### ❌ WRONG - Missing props object
```javascript
Icon(Icons.home)
```
**Problem:** First argument must be props object

### ❌ WRONG - Icon in props
```javascript
Icon({ icon: Icons.home })
```
**Problem:** Icon SVG should be passed as child (second argument)

### ❌ WRONG - Raw I without html prop
```javascript
I(Icons.home)
```
**Problem:** Must use `html` prop to set SVG content

### ❌ WRONG - Bracket notation
```javascript
Icons['home']
```
**Problem:** Use dot notation for better IDE support

### ✅ CORRECT Examples
```javascript
// Icon atom
Icon({ size: 'sm' }, Icons.home)

// Raw I element
I({ html: Icons.home, class: 'w-6 h-6' })

// In button
Button({ variant: 'withIcon', icon: Icons.plus }, 'Add')

// Nested icon
Icon({ size: 'md' }, Icons.arrows.right)
```

## Practical Examples

### Navigation Link with Icon
```javascript
import { Div } from '@base-framework/atoms';
import { NavLink } from '@base-framework/base';
import { Icon } from '@base-framework/ui/atoms';
import { Icons } from '@base-framework/ui/icons';

const NavItem = (props) => (
  NavLink({
    to: props.href,
    class: 'flex items-center gap-2 px-4 py-2'
  }, [
    Icon({ size: 'sm' }, props.icon),
    Div(props.label)
  ])
);

// Usage
NavItem({ href: '/home', label: 'Home', icon: Icons.home })
NavItem({ href: '/settings', label: 'Settings', icon: Icons.settings })
```

### Icon Button
```javascript
import { Button } from '@base-framework/ui/atoms';
import { Icons } from '@base-framework/ui/icons';

const IconButton = (props) => (
  Button({
    variant: 'withIcon',
    icon: props.icon,
    click: props.onClick,
    class: 'p-2'
  })
);

// Usage
IconButton({
  icon: Icons.trash,
  onClick: () => deleteItem()
})
```

### Status Indicator with Icon
```javascript
import { Div } from '@base-framework/atoms';
import { Icon } from '@base-framework/ui/atoms';
import { Icons } from '@base-framework/ui/icons';

const StatusIcon = ({ status }) => {
  const config = {
    success: { icon: Icons.check, color: 'text-green-500' },
    error: { icon: Icons.close, color: 'text-red-500' },
    warning: { icon: Icons.info, color: 'text-yellow-500' }
  };

  const { icon, color } = config[status];

  return Icon({ size: 'sm', class: color }, icon);
};
```

### Alert with Icon
```javascript
import { Alert } from '@base-framework/ui/molecules';
import { Icons } from '@base-framework/ui/icons';

Alert({
  type: 'info',
  title: 'Update Available',
  description: 'A new version is ready to install',
  icon: Icons.info
})

Alert({
  type: 'success',
  title: 'Success',
  description: 'Your changes have been saved',
  icon: Icons.check
})
```

## Icon Animation

Add Tailwind animation classes to animate icons:

```javascript
// Spinning loader
Icon({ size: 'md', class: 'animate-spin' }, Icons.loading)

// Pulse effect
Icon({ size: 'sm', class: 'animate-pulse' }, Icons.heart)

// Custom animation in button
Button({
  variant: 'withIcon',
  icon: Icons.arrows.right,
  animation: 'group-hover:translate-x-1 transition-transform'
}, 'Continue')
```

## Accessibility

Always provide context for icon-only buttons:

```javascript
Button({
  variant: 'withIcon',
  icon: Icons.close,
  'aria-label': 'Close dialog',
  title: 'Close'
})
```

## Quick Reference

| Task | Code |
|------|------|
| Basic icon | `Icon({ size: 'sm' }, Icons.home)` |
| Icon with color | `Icon({ size: 'sm', class: 'text-blue-500' }, Icons.star)` |
| Raw icon | `I({ html: Icons.check, class: 'w-6 h-6' })` |
| Button with icon | `Button({ variant: 'withIcon', icon: Icons.plus }, 'Add')` |
| Icon on right | `Button({ variant: 'withIcon', icon: Icons.arrows.right, position: 'right' }, 'Next')` |
| Nested icon | `Icon({ size: 'md' }, Icons.chat.default)` |
| Animated icon | `Icon({ size: 'md', class: 'animate-spin' }, Icons.loading)` |
