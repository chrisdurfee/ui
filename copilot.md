# Copilot instructions for this repo

This repo is a UI component library for the Base Framework, organized with Atomic Design (atoms → molecules → organisms → pages/templates) and styled with Tailwind CSS v4. It builds to multiple entry points via Vite.

## How things fit together
- Runtime primitives come from external packages:
  - `@base-framework/base` supplies Component, Atom, Data, Jot, Events, router, NavLink, etc.
  - `@base-framework/atoms` supplies DOM tag helpers (Div, Button, Input, Ul, Li, I, etc.) and reactive helpers (On, OnState, UseParent, OnStateOpen).
- Local exports aggregate in `src/ui.js` and sub-entries in `vite.config.js`:
  - `@base-framework/ui` (index) exports everything from `components/*` and `utils/*`.
  - Subpath imports are enabled: `@base-framework/ui/atoms`, `.../icons`, `.../molecules`, `.../organisms`, `.../pages`, `.../templates`, `.../utils`.
- Styling is Tailwind 4 with custom CSS vars (see `tailwind.config.js`). Use existing design tokens like `text-muted-foreground`, `bg-muted/10`, `border`, `ring`.
- Icons are provided via the `Icons` object from `@base-framework/ui/icons` and rendered using the `Icon` atom or raw `I` element from `@base-framework/atoms`.

## Build and dev workflow
- Install: npm i
- Dev: npm run dev → Vite dev server with Tailwind plugin (@tailwindcss/vite)
- Build: npm run build → Vite library build (ES modules only) + `tsc` to emit `.d.ts` from JS via JSDoc
- Preview: npm run preview
- Outputs land in `dist/*.es.js` and `dist/types/**`. Rollup marks `@base-framework/*` externals, so do not import those files directly.

## Authoring components (project conventions)
- Prefer functional atoms via `Atom((props, children) => ...)` for small UI pieces. Example: `AlertIcon`, `AlertTitle`, etc.
- Use `Component` subclasses for stateful or composed widgets. Provide `declareProps()` to document/public props for tooling and `render()` to return markup.
- Event handlers and props:
  - Standard props merge pattern: `{ ...defaultProps, ...props, class: "base classes ${props.class || ''}" }`.
  - For icon buttons: pass `icon` and optionally `position: 'right'`.
  - Use `click` props for click handlers; follow patterns like back navigation in `buttons.js`.
- Reactive/data patterns (from Base):
  - `Data` for mutable view-models inside Components (e.g., `DataTable`, `Calendar`).
  - `Jot(...)` HOC to create jot components (e.g., `SearchDropdown`, `Toggle`).
  - Bindings: use `bind: 'path'` or arrays like `bind: [state, 'key']` on atom props to two-way bind values.
  - Lists: map/repeat with `for: ['collectionKey', (item, i) => ...]` or `map: [array, fn]`.
  - Subscriptions: `On('key', callback)` or `OnState/Open` utilities to react to state.
  - Parent context: `UseParent(({ state, ... }) => ...)` to access parent component refs.

### Important: Atom argument patterns
Atoms created with `Atom()` support flexible argument patterns:
- **Props only**: `Div({ class: 'text' })`
- **Text child only**: `Div('test')`
- **Array children only**: `Div([Div('test')])`
- **Props and text**: `Div({ class: 'text' }, 'test')`
- **Props and array children**: `Div({ class: 'text' }, [Div('test')])`

CRITICAL: When children is an array, pass it as the SECOND argument after props, NOT inside props.

## File layout to know
- `src/components/atoms/**`: Base-level atoms and atom variants (e.g., buttons, icons, badges, tooltips, skeleton, veil).
- `src/components/molecules/**`: Composition of atoms with light state (alerts, dropdowns, date/time pickers, theme toggle, counters, uploaders, etc.).
- `src/components/organisms/**`: Heavier components with internal `Component` state (tables, navigation, overlays, signature, tabs, calendar, lists).
- `src/components/pages/**`: Page/layout primitives (`Page`, `BasicPage`, `MainSection`, full-page layouts, sidebar layouts, templates).
- `src/utils/**`: Utilities (formatting, image-scaler with pointer/zoom/drag helpers).
- `src/ui.js`: Re-exports public surface used by `vite` lib entries.

## Working with Icons (CRITICAL)

Icons in this library come from Heroicons and are defined in `src/components/icons/icons.js`. They are stored as SVG strings in a nested object structure.

### Icon Structure
- Icons are organized hierarchically: `Icons.home`, `Icons.chat.default`, `Icons.chat.text`, `Icons.arrows.left`, etc.
- Each icon is a raw SVG string with Heroicon styling

### How to Use Icons (3 methods)

#### Method 1: Using the Icon atom (RECOMMENDED)
```javascript
import { Icon } from '@base-framework/ui/atoms';
import { Icons } from '@base-framework/ui/icons';

// Pass icon SVG string as child
Icon({ size: 'sm', class: 'text-blue-500' }, Icons.home)
Icon({ size: 'md' }, Icons.chat.default)
Icon({ size: 'lg' }, Icons.arrows.left)

// Sizes: xs, sm, md, lg, xl, 2xl, 3xl (default: sm)
```

#### Method 2: Using raw I element
```javascript
import { I } from '@base-framework/atoms';
import { Icons } from '@base-framework/ui/icons';

// Use html prop to inject SVG
I({ html: Icons.home, class: 'w-6 h-6' })
I({ html: Icons.chat.dots })
```

#### Method 3: In Button with icon prop
```javascript
import { Button } from '@base-framework/ui/atoms';
import { Icons } from '@base-framework/ui/icons';

// Icon appears on left by default
Button({ variant: 'withIcon', icon: Icons.plus }, 'Add Item')

// Icon on right
Button({ variant: 'withIcon', icon: Icons.arrows.right, position: 'right' }, 'Next')
```

### Common Icon Access Patterns
```javascript
// Simple icons (top-level)
Icons.home, Icons.star, Icons.help, Icons.plus

// Nested icons (use dot notation)
Icons.chat.default, Icons.chat.text, Icons.chat.dots
Icons.arrows.left, Icons.arrows.right, Icons.arrows.upDown
Icons.adjustments.vertical, Icons.adjustments.horizontal

// Icons with states
Icons.locked, Icons.unlocked
Icons.play, Icons.stop, Icons.playing
```

### CRITICAL MISTAKES TO AVOID
❌ **WRONG**: `Icon(Icons.home)` - Missing props object
❌ **WRONG**: `Icon({ icon: Icons.home })` - Don't use `icon` prop
❌ **WRONG**: `I(Icons.home)` - Must use `html` prop
❌ **WRONG**: `Icons['home']` - Use dot notation, not bracket
❌ **WRONG**: `Icons.chat` - Incomplete path for nested icons

✅ **CORRECT**: `Icon({ size: 'sm' }, Icons.home)`
✅ **CORRECT**: `I({ html: Icons.home })`
✅ **CORRECT**: `Icons.chat.default` (for nested icons)

## Tailwind and theming
- Tailwind scans `./src/ui.js` and `./src/**/*.{js,ts,jsx,tsx}`. If you add files, keep them under `src` and referenced by exports for purge to include classes.
- Use semantic tokens configured in `tailwind.config.js`: `primary`, `secondary`, `destructive`, `warning`, `muted`, `accent`, `popover`, `card`, `border`, `foreground`, with `DEFAULT` and `foreground` pairs.
- Dark mode is `media`. Prefer classes already used (`data-[state=active]:...`, rounded tokens via `--radius`).

## Patterns by example

### Functional Atom (from `molecules/alert.js`)
Compose small atoms: `Div` containers + `I` for icons + `H5/P` for text. Type variants use lookup table → apply Tailwind classes from map.

```javascript
import { Div, H5, I, P } from '@base-framework/atoms';
import { Atom } from '@base-framework/base';

const AlertIcon = (icon, iconColor) => (
  Div({ class: `flex items-center justify-center h-6 w-6 mr-3 ${iconColor}` }, [
    I({ html: icon })
  ])
);

export const Alert = Atom(({ title, description, icon, type = 'default' }) => {
  const { borderColor, bgColor, iconColor } = typeStyles[type];
  return Div({ class: `flex items-start p-4 border rounded-lg ${bgColor} ${borderColor}` }, [
    icon && AlertIcon(icon, iconColor),
    Div({ class: 'flex flex-col' }, [
      H5({ class: 'font-semibold' }, title),
      P({ class: 'text-sm text-muted-foreground' }, description)
    ])
  ]);
});
```

### Variant pattern (from `atoms/buttons/buttons.js`)
Define variant factories, then export a single `Button` Atom that dispatches by `props.variant`. Icon handling via a shared `IconButton` Atom; support `position: 'right'`.

```javascript
import { Button as BaseButton } from '@base-framework/atoms';
import { Atom } from '@base-framework/base';
import { Icon } from '../icon.js';

const IconButton = Atom((props, children) => (
  BaseButton({
    ...props,
    class: props.class
  }, [
    props.icon && props.position !== 'right' ? Icon({ size: 'sm' }, props.icon) : null,
    ...(children || []),
    props.icon && props.position === 'right' ? Icon({ size: 'sm' }, props.icon) : null
  ])
));

const BUTTON_VARIANTS = {
  primary: DefaultVariant({ class: 'primary' }),
  withIcon: WithIconVariant({ class: 'with-icon' })
};

export const Button = Atom((props, children) => {
  const VariantButton = BUTTON_VARIANTS[props.variant] || BUTTON_VARIANTS.primary;
  return VariantButton(props, children);
});
```

### Data-driven lists (from `molecules/dropdowns/dropdown.js`)
Use `for: ['collectionKey', (item) => ...]` to render nested collections from component state.

```javascript
export const Dropdown = (onSelect) => (
  Div({ class: 'w-full z-10' }, [
    Div({
      class: 'max-h-60 border rounded-md',
      for: ['groups', (group) => Group(group, onSelect)]
    })
  ])
);
```

### Stateful Component (from `organisms/lists/data-table.js`)
Use `Component` with `Data` for state management and `declareProps()` for type hints.

```javascript
import { Component, Data } from '@base-framework/base';

export class DataTable extends Component {
  declareProps() {
    this.rows = [];
    this.headers = [];
  }

  setData() {
    return new Data({
      selectedRows: [],
      hasItems: this.rows && this.rows.length > 0
    });
  }

  render() {
    return Div({ class: 'w-full' }, [
      Table([
        TableHeader({ headers: this.headers }),
        DataTableBody({ rows: this.rows })
      ])
    ]);
  }
}
```

## Import Patterns (CRITICAL)

### External Framework Imports
```javascript
// DOM elements and reactive utilities
import { Div, Button, Input, I, Ul, Li, H5, P } from '@base-framework/atoms';
import { On, OnState, UseParent } from '@base-framework/atoms';

// Core framework classes and utilities
import { Atom, Component, Data, Jot } from '@base-framework/base';
```

### Internal Library Imports
```javascript
// Icons (most common mistake area)
import { Icons } from '@base-framework/ui/icons';
import { Icon } from '@base-framework/ui/atoms';

// Components from this library
import { Button, Alert } from '@base-framework/ui/atoms';
import { Form, Dropdown } from '@base-framework/ui/molecules';
import { DataTable } from '@base-framework/ui/organisms';
```

### Relative Imports (when authoring components IN this library)
```javascript
// From within src/components/
import { Icons } from '../../icons/icons.js';
import { Icon } from '../icon.js';
import { Button as BaseButton } from '@base-framework/atoms';
```

## Coding rules (do/don't)

### DO:
- ✅ Import primitives from `@base-framework/atoms` (Div, Button, I, etc.)
- ✅ Import framework tools from `@base-framework/base` (Atom, Component, Data)
- ✅ Pass children array as SECOND argument: `Div({ class: 'wrapper' }, [child1, child2])`
- ✅ Use `Icons` object from `@base-framework/ui/icons` for all icons
- ✅ Use `Icon` atom with SVG string as child: `Icon({ size: 'sm' }, Icons.home)`
- ✅ Use `I({ html: iconString })` for raw icon rendering
- ✅ Export new components from appropriate barrel files
- ✅ Use Tailwind semantic tokens (primary, muted-foreground, etc.)
- ✅ Use `map: [array, fn]` or `for: ['key', fn]` for lists
- ✅ Use `bind: 'path'` or `bind: [state, 'key']` for two-way binding

### DON'T:
- ❌ Pass children inside props object: `Div({ children: [...] })`
- ❌ Use `icon` prop on Icon atom: `Icon({ icon: Icons.home })`
- ❌ Pass icon directly without props: `Icon(Icons.home)`
- ❌ Use React/Vue/JSX syntax
- ❌ Mutate DOM directly (use Data bindings instead)
- ❌ Use raw hex colors (use Tailwind tokens)
- ❌ Import Icons from wrong path
- ❌ Create new icon implementations (use existing Icon atom)
- ❌ Forget to spread props: always use `{ ...defaultProps, ...props }`

## Adding a new component (checklist)
1) Decide Atom vs Component (stateless vs stateful/interactive)
2) Place file under the correct layer folder and export it from that layer’s barrel (and from `src/ui.js` if needed via existing barrels)
3) Use Tailwind utility classes aligned with theme tokens
4) If it needs data/state, use `Data`/`Jot`, `On`, `bind`, `for` as seen in existing components
5) Run dev server and verify render; run build to ensure types emit

## Common Mistakes & Troubleshooting

### Issue: Icons not rendering
**Symptoms**: Icons appear as blank or broken
**Causes**:
1. Wrong import path for Icons
2. Incorrect Icon usage syntax
3. Missing `html` prop on I element

**Solutions**:
```javascript
// ✅ Correct ways
import { Icons } from '@base-framework/ui/icons';
Icon({ size: 'sm' }, Icons.home)
I({ html: Icons.home })

// ❌ Wrong ways
Icon(Icons.home) // Missing props object
Icon({ icon: Icons.home }) // Wrong prop name
I(Icons.home) // Missing html prop
```

### Issue: Children not rendering
**Symptoms**: Child components/text not appearing
**Cause**: Passing children in props object instead of as second argument

**Solution**:
```javascript
// ✅ Correct
Div({ class: 'wrapper' }, [
  Div('child 1'),
  Div('child 2')
])

// ❌ Wrong
Div({
  class: 'wrapper',
  children: [Div('child')]
})
```

### Issue: Component not reactive
**Symptoms**: UI doesn't update when data changes
**Cause**: Not using Data or proper bindings

**Solution**:
```javascript
// ✅ Use Data in Component
setData() {
  return new Data({ count: 0 });
}

// ✅ Use bind for two-way binding
Input({ bind: 'username' })
Input({ bind: [externalState, 'email'] })
```

### Issue: List not rendering
**Symptoms**: Array of items not displaying
**Cause**: Using regular map instead of Base's reactive patterns

**Solution**:
```javascript
// ✅ Use map prop
Ul({ map: [items, (item) => Li(item.name)] })

// ✅ Use for with state key
Div({ for: ['items', (item) => ItemComponent(item)] })

// ❌ Wrong - regular JS map
Ul([items.map(item => Li(item.name))])
```

## Commands reference
- Dev: `npm run dev`
- Build: `npm run build`
- Preview: `npm run preview`

## Quick Reference Card

### Component Creation
```javascript
// Atom (stateless)
export const MyAtom = Atom((props, children) => (
  Div({ class: props.class }, children)
));

// Component (stateful)
export class MyComponent extends Component {
  declareProps() {
    this.items = [];
  }

  setData() {
    return new Data({ selected: null });
  }

  render() {
    return Div([/* ... */]);
  }
}
```

### Icon Usage Quick Reference
```javascript
// In Button
Button({ variant: 'withIcon', icon: Icons.plus }, 'Add')

// Standalone
Icon({ size: 'md', class: 'text-primary' }, Icons.home)

// Raw SVG
I({ html: Icons.check, class: 'w-5 h-5' })
```

### Event Handlers
```javascript
// Click
Button({ click: (e) => console.log('clicked') }, 'Click')

// Submit (in Form)
Form({ submit: (e, parent) => handleSubmit(e) }, [...])

// State-based callbacks
Button({ onState: ['key', { key: 'value' }] }, 'State Button')
```

If anything seems unclear (e.g., preferred binding patterns or where to export), ask for confirmation before large changes.
