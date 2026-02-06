# Base Framework UI Documentation

Welcome to the comprehensive documentation for Base Framework UI - a complete UI component library built with Base Framework and Tailwind CSS v4, organized using Atomic Design principles.

## Quick Links

### Getting Started
- **[00-Getting-Started.md](./00-Getting-Started.md)** - Introduction, key differences from React/Vue, installation, and basic usage

### Core Concepts
- **[02-Icons.md](./02-Icons.md)** - Complete icon usage guide (CRITICAL - most common mistake area)
- **[09-Material-Symbols.md](./09-Material-Symbols.md)** - Material Symbols integration (Google Fonts icons)
- **[03-Reactive-Patterns.md](./03-Reactive-Patterns.md)** - Data binding, lists, state management, and reactivity

### Component Documentation
- **[01-Atoms.md](./01-Atoms.md)** - Buttons, badges, icons, cards, forms, progress, skeletons
- **[04-Molecules.md](./04-Molecules.md)** - Alerts, dropdowns, modals, forms, date-pickers, combobox
- **[05-Organisms.md](./05-Organisms.md)** - Tables, navigation, tabs, calendar, search components
- **[06-Pages.md](./06-Pages.md)** - Page layouts, routing, templates

### Advanced Topics
- **[07-Component-Authoring.md](./07-Component-Authoring.md)** - Creating custom components, patterns, best practices
- **[08-Utils.md](./08-Utils.md)** - Formatting, DateTime, image scaling utilities

## Critical Concepts

### ⚠️ This is NOT React/Vue/JSX

Base Framework uses a unique declarative model. Understanding these differences is crucial:

#### 1. Children as Second Argument
```javascript
// ❌ WRONG
Div({ class: 'text', children: [...] })

// ✅ CORRECT
Div({ class: 'text' }, [...])
```

#### 2. Icon Usage (Most Common Mistakes)
```javascript
// ❌ WRONG
Icon(Icons.home)
Icon({ icon: Icons.home })

// ✅ CORRECT
Icon({ size: 'sm' }, Icons.home)
Button({ variant: 'withIcon', icon: Icons.plus }, 'Add')
```

#### 3. Lists Use map or for Props
```javascript
// ❌ WRONG
Ul([items.map(item => Li(item.name))])

// ✅ CORRECT
Ul({ map: [items, (item) => Li(item.name)] })
Div({ for: ['items', (item) => ItemComponent(item)] })
```

#### 4. Reactive Data with Data and Jot
```javascript
// ✅ Use Data for mutable view-models
setData() {
  return new Data({ count: 0, items: [] });
}

// ✅ Two-way binding
Input({ bind: 'username' })
```

## Quick Reference

### Imports

```javascript
// DOM elements
import { Div, Button, Input, I, Ul, Li } from '@base-framework/atoms';

// Framework core
import { Atom, Component, Data, Jot } from '@base-framework/base';

// UI components
import { Button, Icon } from '@base-framework/ui/atoms';
import { Alert, Modal } from '@base-framework/ui/molecules';
import { DataTable, TabGroup } from '@base-framework/ui/organisms';
import { Icons } from '@base-framework/ui/icons';
import { Format } from '@base-framework/ui/utils';
```

### Common Patterns

#### Button with Icon
```javascript
Button({
  variant: 'withIcon',
  icon: Icons.plus
}, 'Add Item')
```

#### Form with Binding
```javascript
Form({ submit: handleSubmit }, [
  Input({ bind: 'username', required: true }),
  Button({ type: 'submit' }, 'Submit')
])
```

#### Dynamic List
```javascript
Ul({
  map: [items, (item) => Li(item.name)]
})
```

#### Component with State
```javascript
class MyComponent extends Component {
  setData() {
    return new Data({ count: 0 });
  }

  render() {
    return Div([
      Button({ click: () => this.data.count++ }, 'Increment'),
      Span([On('count', (count) => count)])
    ]);
  }
}
```

## Component Hierarchy

### Atoms (Stateless)
Simple, reusable UI elements:
- Buttons (primary, secondary, destructive, with icons)
- Badges (colored status indicators)
- Icons (Heroicons library)
- Cards (containers)
- Forms (fieldsets, selects, inputs)
- Progress (bars, circles, semi-circles)
- Skeletons (loading placeholders)

### Molecules (Composed)
Combinations of atoms with light functionality:
- Alerts (info, warning, success, error)
- Dropdowns (menus, items)
- Modals (dialogs, drawers)
- Forms (enhanced forms, fields, controls)
- Date/Time (pickers, ranges, timeframes)
- Avatars (with status indicators)
- Breadcrumbs (navigation)
- Toggles (switches)
- Notifications (toasts)

### Organisms (Complex)
Components with internal state:
- DataTable (sortable, selectable)
- TabGroup (tabbed interfaces)
- Calendar (date selection)
- Navigation (sidebar, mobile, menus)
- Search (bars, dropdowns)
- Lists (user lists, infinite scroll)
- Signature (digital signature capture)

### Pages (Layouts)
Page structures and routing:
- BasicPage (route-based pages)
- SidebarMenuPage (with sidebar navigation)
- CenterPage (centered content)
- FullPage / FullscreenPage (full viewport)
- MainSection (content with routing)

## Tailwind Tokens

Use semantic color tokens for consistency:

```javascript
// Colors
'bg-primary' / 'text-primary-foreground'
'bg-secondary' / 'text-secondary-foreground'
'bg-destructive' / 'text-destructive-foreground'
'bg-warning' / 'text-warning-foreground'
'bg-muted' / 'text-muted-foreground'
'bg-accent' / 'text-accent-foreground'

// Borders
'border' / 'border-border'
'ring' / 'ring-ring'
```

## Common Mistakes to Avoid

### 1. Children in Props
```javascript
// ❌ NEVER do this
Div({ children: [...] })
```

### 2. Icon Without Props
```javascript
// ❌ Missing props object
Icon(Icons.home)
```

### 3. Regular Map for Lists
```javascript
// ❌ Use map/for prop instead
Ul([items.map(...)])
```

### 4. Direct DOM Manipulation
```javascript
// ❌ Don't manipulate DOM directly
document.getElementById('x').innerHTML = 'y';

// ✅ Use data binding
this.data.content = 'y';
```

## Development Workflow

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview build
npm run preview
```

## File Structure

```
src/
  components/
    atoms/          # Buttons, badges, icons, cards, etc.
    molecules/      # Alerts, forms, modals, dropdowns, etc.
    organisms/      # Tables, navigation, tabs, calendar, etc.
    pages/          # Page layouts and templates
    icons/          # Icon library (Heroicons)
  utils/            # Format, DateTime, ImageScaler
  ui.js             # Main export file
```

## Support & Resources

- **GitHub**: [chrisdurfee/ui](https://github.com/chrisdurfee/ui)
- **Base Framework**: [chrisdurfee/base](https://github.com/chrisdurfee/base)
- **Atomic Design**: [Brad Frost's Atomic Design](https://bradfrost.com/blog/post/atomic-web-design/)

## Documentation Index

1. [Getting Started](./00-Getting-Started.md)
2. [Atoms](./01-Atoms.md)
3. [Icons](./02-Icons.md) ⚠️
4. [Reactive Patterns](./03-Reactive-Patterns.md)
5. [Molecules](./04-Molecules.md)
6. [Organisms](./05-Organisms.md)
7. [Pages](./06-Pages.md)
8. [Component Authoring](./07-Component-Authoring.md)
9. [Utils](./08-Utils.md)

---

**Version**: 1.0.0
**Last Updated**: December 2024
