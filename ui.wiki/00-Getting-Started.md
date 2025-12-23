# Getting Started with Base Framework UI

## Overview
Base Framework UI is a comprehensive UI component library built on the Base Framework, organized using Atomic Design principles. It provides a complete set of reusable components styled with Tailwind CSS v4.

## Key Differences from React/Vue

**CRITICAL: This is NOT React, Vue, or standard JSX.**

Base Framework uses a declarative component model with specific syntax patterns:

### 1. Children are passed as second argument
```javascript
// ❌ WRONG - Never pass children in props
Div({ class: 'text', children: [...] })

// ✅ CORRECT - Children as second argument
Div({ class: 'text' }, [...])
```

### 2. Flexible Atom Arguments
Atoms accept flexible argument patterns:

```javascript
// Props only
Div({ class: 'text' })

// Text child only
Div('test')

// Array children only
Div([Div('test')])

// Props and text child
Div({ class: 'text' }, 'test')

// Props and array children
Div({ class: 'text' }, [Div('test'), Div('test2')])
```

### 3. Reactive Data with Data and Jot
```javascript
// Use Data for mutable view-models
setData() {
  return new Data({
    count: 0,
    items: []
  });
}

// Two-way binding
Input({ bind: 'username' })
Input({ bind: [externalState, 'email'] })
```

### 4. Lists use map or for props
```javascript
// ❌ WRONG - Regular JS map
Ul([items.map(item => Li(item.name))])

// ✅ CORRECT - Use map prop
Ul({ map: [items, (item) => Li(item.name)] })

// ✅ CORRECT - Use for prop with state
Div({ for: ['items', (item) => ItemComponent(item)] })
```

## Architecture

### External Packages
- `@base-framework/base` - Core primitives (Component, Atom, Data, Jot, Events, router, NavLink)
- `@base-framework/atoms` - DOM helpers (Div, Button, Input, etc.) and reactive helpers (On, OnState, UseParent)

### Local Structure
- `@base-framework/ui` - Main export with all components and utils
- `@base-framework/ui/atoms` - Base-level atoms (buttons, icons, badges, etc.)
- `@base-framework/ui/icons` - Icon library (Heroicons)
- `@base-framework/ui/molecules` - Composed components (alerts, dropdowns, forms)
- `@base-framework/ui/organisms` - Complex components (tables, navigation, calendar)
- `@base-framework/ui/pages` - Page layouts and templates
- `@base-framework/ui/utils` - Utility functions

## Installation

```bash
npm install @base-framework/ui
```

## Basic Usage

```javascript
import { Button } from '@base-framework/ui/atoms';
import { Alert } from '@base-framework/ui/molecules';
import { Icons } from '@base-framework/ui/icons';

// Simple button
Button({ variant: 'primary' }, 'Click me')

// Button with icon
Button({
  variant: 'withIcon',
  icon: Icons.plus
}, 'Add Item')

// Alert
Alert({
  type: 'info',
  title: 'Information',
  description: 'This is an informational message',
  icon: Icons.info
})
```

## Styling with Tailwind CSS

The library uses Tailwind CSS v4 with custom design tokens:

### Color Tokens
- `primary` - Primary brand color
- `secondary` - Secondary brand color
- `destructive` - Destructive/error actions
- `warning` - Warning states
- `muted` - Muted/subtle content
- `accent` - Accent highlights
- `border` - Border colors
- `foreground` - Text colors

### Usage
```javascript
// Use semantic tokens
Div({ class: 'bg-primary text-primary-foreground' })
Div({ class: 'border border-border rounded-lg' })
Div({ class: 'bg-muted/10 text-muted-foreground' })
```

## Component Types

### Atoms (Functional)
Small, reusable UI pieces created with `Atom`:

```javascript
export const Badge = Atom((props, children) => (
  Div({
    ...props,
    class: `inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${props.class || ''}`
  }, children)
));
```

### Components (Stateful)
Complex widgets with internal state using `Component` class:

```javascript
export class Calendar extends Component {
  declareProps() {
    this.selectedDate = null;
    this.selectedCallBack = null;
  }

  setData() {
    return new Data({
      currentDate: new Date(),
      view: 'calendar'
    });
  }

  render() {
    return Div([
      // component markup
    ]);
  }
}
```

## Next Steps

- [Atoms Documentation](./01-Atoms.md) - Learn about base-level components
- [Icons Guide](./02-Icons.md) - How to use icons correctly
- [Reactive Patterns](./03-Reactive-Patterns.md) - Data binding and state management
- [Component Authoring](./04-Component-Authoring.md) - Creating your own components
