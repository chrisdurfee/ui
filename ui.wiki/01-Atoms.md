# Atoms Documentation - Base Framework UI

## Overview
Atoms are the smallest, most fundamental building blocks in the Base Framework UI component library. They are created using the `Atom` function and represent simple, reusable UI elements.

## What is an Atom?

An Atom is a functional component created with:

```javascript
import { Atom } from '@base-framework/base';

export const MyAtom = Atom((props, children) => (
  // Return markup
));
```

### Key Characteristics:
- **Stateless** - No internal state management (use Component for that)
- **Flexible arguments** - Can accept props only, children only, or both
- **Composable** - Can be nested and combined to create larger structures
- **Props spreading** - Support merging default and passed props

## Button Component

### Available Variants

```javascript
import { Button } from '@base-framework/ui/atoms';
import { Icons } from '@base-framework/ui/icons';
```

| Variant | Description | Usage |
|---------|-------------|-------|
| `primary` | Primary action button (default) | Main CTA buttons |
| `secondary` | Secondary action button | Alternative actions |
| `destructive` | Destructive action button | Delete, remove operations |
| `warning` | Warning action button | Cautionary actions |
| `outline` | Outlined button | Subtle actions |
| `ghost` | Ghost button | Minimal styling |
| `link` | Link-styled button | Text links that are buttons |
| `icon` | Icon-only button | Toolbar buttons |
| `withIcon` | Button with icon and text | Enhanced buttons |
| `back` | Back navigation button | Navigation |

### Basic Usage

```javascript
// Primary button (default)
Button('Click me')
Button({ variant: 'primary' }, 'Click me')

// With click handler
Button({
  variant: 'primary',
  click: () => console.log('clicked')
}, 'Click me')

// Other variants
Button({ variant: 'secondary' }, 'Secondary Action')
Button({ variant: 'destructive' }, 'Delete')
Button({ variant: 'outline' }, 'Cancel')
Button({ variant: 'ghost' }, 'Skip')
Button({ variant: 'link' }, 'Learn more')
```

### Buttons with Icons

```javascript
// Icon on left (default)
Button({
  variant: 'withIcon',
  icon: Icons.plus
}, 'Add Item')

// Icon on right
Button({
  variant: 'withIcon',
  icon: Icons.arrows.right,
  position: 'right'
}, 'Continue')

// Icon only
Button({
  variant: 'icon',
  icon: Icons.settings,
  'aria-label': 'Settings'
})

// With animation
Button({
  variant: 'withIcon',
  icon: Icons.arrows.right,
  animation: 'group-hover:translate-x-1 transition-transform'
}, 'Next')
```

### Back Button

Special variant for navigation with automatic back behavior:

```javascript
// Auto back with history
Button({
  variant: 'back',
  allowHistory: true
}, 'Back')

// Back to specific URL
Button({
  variant: 'back',
  backUrl: '/dashboard'
}, 'Back to Dashboard')

// Custom icon
Button({
  variant: 'back',
  icon: Icons.home,
  backUrl: '/'
}, 'Home')
```

### Loading Button

Button with animated loading icon:

```javascript
import { LoadingButton } from '@base-framework/ui/atoms';

LoadingButton({
  variant: 'primary',
  disabled: true
}, 'Saving...')
```

### Props Reference

| Prop | Type | Description |
|------|------|-------------|
| `variant` | string | Button style variant |
| `icon` | string (SVG) | Icon SVG string (for withIcon/icon variants) |
| `position` | 'left' \| 'right' | Icon position (default: 'left') |
| `animation` | string | Tailwind animation classes for icon |
| `click` | function | Click event handler |
| `disabled` | boolean | Disabled state |
| `type` | string | Button type (button/submit/reset) |
| `class` | string | Additional CSS classes |
| `allowHistory` | boolean | Use browser history for back button |
| `backUrl` | string | URL for back navigation |

## Badge Component

### Available Colors

```javascript
import { Badge } from '@base-framework/ui/atoms';
```

Semantic colors:
- `primary` - Primary brand color
- `secondary` - Secondary brand color
- `destructive` - Error/danger state
- `warning` - Warning state
- `outline` - Outlined badge
- `ghost` - Minimal badge

Standard colors:
- `gray`, `red`, `yellow`, `green`, `blue`, `indigo`, `purple`, `pink`

### Usage

```javascript
// Default (gray)
Badge('New')

// With color
Badge({ color: 'primary' }, 'Primary')
Badge({ color: 'destructive' }, 'Error')
Badge({ color: 'green' }, 'Success')

// With dot indicator
Badge({ color: 'blue', dot: true }, 'Active')

// In a list
Div({ class: 'flex gap-2' }, [
  Badge({ color: 'green' }, 'Active'),
  Badge({ color: 'yellow' }, 'Pending'),
  Badge({ color: 'red' }, 'Inactive')
])
```

### Practical Examples

```javascript
// Status badge
const StatusBadge = ({ status }) => {
  const config = {
    active: { color: 'green', label: 'Active' },
    pending: { color: 'yellow', label: 'Pending' },
    inactive: { color: 'red', label: 'Inactive' }
  };

  const { color, label } = config[status];
  return Badge({ color }, label);
};

// Count badge
Badge({ color: 'primary', class: 'rounded-full' }, '99+')

// Category badge
Badge({ color: 'indigo' }, 'JavaScript')
Badge({ color: 'purple' }, 'TypeScript')
```

## Icon Component

See [Icons Guide](./02-Icons.md) for comprehensive icon documentation.

### Quick Reference

```javascript
import { Icon } from '@base-framework/ui/atoms';
import { Icons } from '@base-framework/ui/icons';

// Basic usage
Icon({ size: 'sm' }, Icons.home)

// With custom class
Icon({ size: 'md', class: 'text-blue-500' }, Icons.star)

// Available sizes: xs, sm, md, lg, xl, 2xl, 3xl
```

## Skeleton Component

Loading placeholders for content:

```javascript
import { Skeleton } from '@base-framework/ui/atoms';

// Text skeleton
Skeleton({ class: 'h-4 w-full' })

// Circle skeleton
Skeleton({ class: 'h-12 w-12 rounded-full' })

// Custom dimensions
Skeleton({ class: 'h-32 w-full rounded-lg' })
```

### Example Usage

```javascript
// Card skeleton
Div({ class: 'space-y-4' }, [
  Skeleton({ class: 'h-12 w-12 rounded-full' }),
  Skeleton({ class: 'h-4 w-3/4' }),
  Skeleton({ class: 'h-4 w-1/2' }),
  Skeleton({ class: 'h-24 w-full' })
])
```

## Tooltip Component

Contextual information on hover:

```javascript
import { Tooltip } from '@base-framework/ui/atoms';
import { Button } from '@base-framework/ui/atoms';

Tooltip({
  content: 'This is a helpful tooltip',
  position: 'top'
}, [
  Button('Hover me')
])
```

### Positions
- `top` (default)
- `bottom`
- `left`
- `right`

## Veil Component

Overlay background for modals and dialogs:

```javascript
import { Veil } from '@base-framework/ui/atoms';

Veil({
  opacity: 0.5,
  click: () => closeModal()
})
```

## Card Components

### Basic Card

```javascript
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@base-framework/ui/atoms';

Card([
  CardHeader([
    CardTitle('Card Title')
  ]),
  CardContent([
    P('Card content goes here')
  ]),
  CardFooter([
    Button('Action')
  ])
])
```

### Card Props

```javascript
// With custom styling
Card({
  class: 'hover:shadow-lg transition-shadow'
}, [
  // content
])
```

## Form Atoms

### Fieldset

```javascript
import { Fieldset } from '@base-framework/ui/atoms';

Fieldset({
  legend: 'Personal Information',
  disabled: false
}, [
  // form fields
])
```

### Legend

```javascript
import { Legend } from '@base-framework/ui/atoms';

Legend('Form Section')
Legend({ class: 'text-lg font-bold' }, 'Important Section')
```

### Select

```javascript
import { Select } from '@base-framework/ui/atoms';

Select({
  options: [
    { value: '1', label: 'Option 1' },
    { value: '2', label: 'Option 2' },
    { value: '3', label: 'Option 3' }
  ],
  bind: 'selectedOption'
})

// With placeholder
Select({
  options: countries,
  placeholder: 'Select a country',
  bind: 'country'
})
```

## Progress Components

### Progress Bar

```javascript
import { ProgressBar } from '@base-framework/ui/atoms';

// Basic progress
ProgressBar({ value: 65, max: 100 })

// With color
ProgressBar({
  value: 75,
  max: 100,
  class: 'bg-green-500'
})
```

### Circle Graph

```javascript
import { CircleGraph } from '@base-framework/ui/atoms';

CircleGraph({
  value: 75,
  max: 100,
  size: 120,
  strokeWidth: 8
})
```

### Semi-Circle Graph

```javascript
import { SemiCircleGraph } from '@base-framework/ui/atoms';

SemiCircleGraph({
  value: 80,
  max: 100,
  size: 120
})
```

## Image Component

Enhanced image with loading states:

```javascript
import { Image } from '@base-framework/ui/atoms';

Image({
  src: '/path/to/image.jpg',
  alt: 'Description',
  class: 'w-full h-64 object-cover rounded-lg'
})

// With lazy loading
Image({
  src: '/path/to/image.jpg',
  alt: 'Description',
  loading: 'lazy'
})

// With responsive sources (srcset/sizes) and intrinsic dimensions
Image({
  src: '/path/to/image.jpg',
  alt: 'Description',
  srcset: '/path/to/image-320.jpg 320w, /path/to/image-800.jpg 800w',
  sizes: '(min-width: 768px) 280px, 100vw',
  width: 800,
  height: 560
})
```

## Best Practices

### 1. Props Spreading Pattern

```javascript
const MyButton = Atom((props, children) => (
  Button({
    ...defaultProps,
    ...props,
    class: `base-classes ${props.class || ''}`
  }, children)
));
```

### 2. Children Handling

```javascript
// ✅ CORRECT - Children as second argument
const Wrapper = Atom((props, children) => (
  Div({ class: 'wrapper' }, children)
));

// ❌ WRONG - Children in props
const Wrapper = Atom((props) => (
  Div({ class: 'wrapper', children: props.children })
));
```

### 3. Conditional Rendering

```javascript
const ConditionalIcon = Atom((props, children) => (
  Div([
    props.icon ? Icon({ size: 'sm' }, props.icon) : null,
    ...children
  ])
));
```

### 4. Default Values

```javascript
const StyledButton = Atom((props, children) => (
  Button({
    variant: props.variant || 'primary',
    ...props
  }, children)
));
```

## Common Patterns

### Composed Atoms

```javascript
// Icon with text
const IconText = Atom((props, children) => (
  Div({ class: 'flex items-center gap-2' }, [
    Icon({ size: 'sm' }, props.icon),
    Div(children)
  ])
));

// Badge with icon
const IconBadge = Atom((props, children) => (
  Badge({ color: props.color }, [
    Icon({ size: 'xs' }, props.icon),
    Span({ class: 'ml-1' }, children)
  ])
));
```

### Variant Pattern

```javascript
const VARIANTS = {
  default: { class: 'bg-white' },
  primary: { class: 'bg-primary' },
  secondary: { class: 'bg-secondary' }
};

export const MyAtom = Atom((props, children) => {
  const variant = VARIANTS[props.variant] || VARIANTS.default;

  return Div({
    ...variant,
    ...props,
    class: `${variant.class} ${props.class || ''}`
  }, children);
});
```

## Next Steps

- [Molecules Documentation](./04-Molecules.md) - Learn about composed components
- [Reactive Patterns](./03-Reactive-Patterns.md) - Data binding and state
- [Component Authoring](./05-Component-Authoring.md) - Create your own components
