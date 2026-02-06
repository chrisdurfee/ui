# Copilot instructions for this repo

This repo is a UI component library for the Base Framework, organized with Atomic Design (atoms → molecules → organisms → pages/templates) and styled with Tailwind CSS v4. It builds to multiple entry points via Vite.

**📚 Full documentation available in `ui.wiki/` folder - refer to it for comprehensive guides.**

## CRITICAL: Before You Start
This is NOT React, Vue, or standard JSX. This uses Base Framework's declarative atoms/components with specific syntax patterns. **Read the documentation in base.wiki/ and the icon/children sections below carefully to avoid common mistakes.**

### Key Differences from React/Vue
1. **Children as second argument** - NEVER in props
2. **Icons passed as children** - Not as icon prop in Icon component
3. **Lists use map/for props** - Not regular .map()
4. **Data binding with bind** - Not value + onChange
5. **Reactive Data object** - Not useState

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

### CRITICAL: Atom argument patterns
Atoms support flexible argument patterns. Children MUST be passed as second argument when it's an array:
- **Props only**: `Div({ class: 'text' })`
- **Text child only**: `Div('test')`
- **Array children only**: `Div([Div('test')])`
- **Props and text**: `Div({ class: 'text' }, 'test')`
- **Props and array children**: `Div({ class: 'text' }, [Div('test'), Div('test2')])`

❌ WRONG: `Div({ class: 'text', children: [...] })` - Never pass children in props
✅ CORRECT: `Div({ class: 'text' }, [...])`

## Component Types and When to Use

### Use Atom for:
- Stateless UI elements (buttons, badges, icons, labels)
- Simple compositions of other atoms
- Variants of existing atoms
- Visual-only components without internal state

```javascript
export const Badge = Atom((props, children) => (
  Span({
    ...props,
    class: `inline-flex rounded-full px-2.5 py-0.5 ${props.class || ''}`
  }, children)
));
```

### Use Component for:
- Components with internal state (Data or setupStates)
- Components that need lifecycle methods
- Complex interactions requiring methods
- Organisms like DataTable, Calendar, TabGroup

```javascript
export class Counter extends Component {
  setData() {
    return new Data({ count: 0 });
  }

  increment() {
    this.data.count++;
  }

  render() {
    return Div([
      Button({ click: () => this.increment() }, '+'),
      Span([On('count', (count) => count)])
    ]);
  }
}
```

### Use Jot for:
- Components with external two-way binding
- Reusable inputs/controls with value/change pattern
- Searchable dropdowns, toggles, custom inputs

```javascript
const Toggle = Jot((checked, setChecked) => (
  Button({
    click: () => setChecked(!checked),
    class: checked ? 'bg-primary' : 'bg-muted'
  }, checked ? 'ON' : 'OFF')
));
```

## Data Management Patterns

### Reactive Data (setData)
Use for dynamic values that need reactivity:

```javascript
setData() {
  return new Data({
    // Simple values
    name: '',
    count: 0,

    // Arrays (use for dynamic lists)
    items: [],
    selectedIds: [],

    // Objects
    user: { name: '', email: '' }
  });
}

// Updating data triggers re-render
this.data.count = 5;
this.data.items.push(newItem);
this.data.user.name = 'John';
```

### Component States (setupStates)
Use for discrete state values (modes, flags):

```javascript
setupStates() {
  return {
    isOpen: false,           // Boolean flags
    view: 'list',           // String modes: 'list' | 'grid' | 'table'
    tab: 'overview'         // Tab selection
  };
}

// Toggle state
this.state.isOpen = !this.state.isOpen;
```

### Two-Way Binding
```javascript
// Simple binding to data
Input({ bind: 'username' })
Input({ bind: 'user.email' })

// Binding to external state
const state = new Data({ value: '' });
Input({ bind: [state, 'value'] })

// Binding with select
Select({ bind: 'country', options: countries })

// Binding with checkbox
Input({ bind: 'accepted', type: 'checkbox' })
```

### Dynamic Lists
```javascript
// map prop - for static/external arrays
Ul({
  map: [items, (item) => Li(item.name)]
})

// for prop - for component data (reactive)
Div({
  for: ['items', (item, index) => (
    ItemCard({ item, index })
  )]
})

// NEVER use regular JavaScript .map() for reactive lists
// ❌ WRONG: Ul([items.map(item => Li(item))])
// ✅ CORRECT: Ul({ map: [items, (item) => Li(item)] })
```

## Watchers and Subscriptions

### On - Watch Data Changes
```javascript
render() {
  return Div([
    // Watch single property
    On('count', (value) => {
      console.log('Count changed:', value);
    }),

    // Watch nested property
    On('user.name', (name) => {
      this.updateProfile(name);
    }),

    // Display watched value
    Span({ onState: ['count', (count) => `Count: ${count}`] })
  ]);
}
```

### OnState - Watch State Changes
```javascript
render() {
  return Div([
    OnState('isOpen', (isOpen) => {
      if (isOpen) {
        this.loadContent();
      }
    })
  ]);
}
```

### OnStateOpen - Run Once When State Becomes True
```javascript
render() {
  return Div([
    OnStateOpen('isVisible', () => {
      this.startAnimation();
    })
  ]);
}
```

### UseParent - Access Parent Component
```javascript
const ChildAtom = Atom((props) => (
  Div([
    UseParent(({ data, state, panel }) => {
      // Access parent's data/state
      panel.selectItem(props.id);
      return null;
    })
  ])
));
```

## File layout to know
- `src/components/atoms/**`: Base-level atoms and atom variants (e.g., buttons, icons, badges, tooltips, skeleton, veil).
- `src/components/molecules/**`: Composition of atoms with light state (alerts, dropdowns, date/time pickers, theme toggle, counters, uploaders, etc.).
- `src/components/organisms/**`: Heavier components with internal `Component` state (tables, navigation, overlays, signature, tabs, calendar, lists).
- `src/components/pages/**`: Page/layout primitives (`Page`, `BasicPage`, `MainSection`, full-page layouts, sidebar layouts, templates).
- `src/utils/**`: Utilities (formatting, image-scaler with pointer/zoom/drag helpers).
- `src/ui.js`: Re-exports public surface used by `vite` lib entries.

## Tailwind and theming
- Tailwind scans `./src/ui.js` and `./src/**/*.{js,ts,jsx,tsx}`. If you add files, keep them under `src` and referenced by exports for purge to include classes.
- Use semantic tokens configured in `tailwind.config.js`: `primary`, `secondary`, `destructive`, `warning`, `muted`, `accent`, `popover`, `card`, `border`, `foreground`, with `DEFAULT` and `foreground` pairs.
- Dark mode is `media`. Prefer classes already used (`data-[state=active]:...`, rounded tokens via `--radius`).

## Working with Icons (READ THIS - Most Common Mistake Area)

### Icon Basics
Icons come from [src/components/icons/icons.js](../src/components/icons/icons.js) (Heroicons library). They're SVG strings organized hierarchically. See [ui.wiki/02-Icons.md](../ui.wiki/02-Icons.md) for complete guide.

### Three Ways to Use Icons

**Method 1: Icon atom (RECOMMENDED)**
```javascript
import { Icon } from '@base-framework/ui/atoms';
import { Icons } from '@base-framework/ui/icons';

Icon({ size: 'sm' }, Icons.home)  // SVG string as CHILD, not in props
Icon({ size: 'md', class: 'text-blue-500' }, Icons.chat.default)
```

**Method 2: Raw I element**
```javascript
import { I } from '@base-framework/atoms';
import { Icons } from '@base-framework/ui/icons';

I({ html: Icons.home, class: 'w-6 h-6' })  // Use html prop
```

**Method 3: In Button**
```javascript
import { Button } from '@base-framework/ui/atoms';
import { Icons } from '@base-framework/ui/icons';

Button({ variant: 'withIcon', icon: Icons.plus }, 'Add')
Button({ variant: 'withIcon', icon: Icons.arrows.right, position: 'right' }, 'Next')
```

### Common Icon Paths
```javascript
// Simple: Icons.home, Icons.star, Icons.help, Icons.plus
// Nested: Icons.chat.default, Icons.arrows.left, Icons.adjustments.vertical
```

### CRITICAL Icon Mistakes
❌ `Icon(Icons.home)` - Missing props object
❌ `Icon({ icon: Icons.home })` - Wrong prop name, pass as child
❌ `I(Icons.home)` - Must use html prop
❌ `Icons['home']` - Use dot notation

✅ `Icon({ size: 'sm' }, Icons.home)`
✅ `I({ html: Icons.home })`
✅ `Button({ icon: Icons.plus }, 'Text')`

## Working with Material Symbols (NEW)

### Material Symbols Basics
Material Symbols are font-based icons from Google (11,000+ icons). They complement Heroicons. See [ui.wiki/09-Material-Symbols.md](../ui.wiki/09-Material-Symbols.md) for complete guide.

### Using Material Symbols

**Basic usage:**
```javascript
import { MaterialIcon } from '@base-framework/ui/atoms';
import { MaterialSymbols } from '@base-framework/ui/icons';

// Using MaterialSymbols object
MaterialIcon({ name: MaterialSymbols.home, size: 'md' })

// Using icon name directly
MaterialIcon({ name: 'home', size: 'sm' })

// With variant
MaterialIcon({ name: MaterialSymbols.favorite, variant: 'filled', size: 'lg' })

// With styling
MaterialIcon({
  name: MaterialSymbols.star,
  variant: 'filled',
  class: 'text-yellow-500'
})
```

### MaterialIcon Props
- **name** (required): Icon ligature name (string)
- **size** (optional): xs | sm | md | lg | xl | 2xl | 3xl (default: 'sm')
- **variant** (optional): outlined | filled | rounded | sharp (default: 'outlined')
- **class** (optional): Additional CSS classes

### Common Material Symbols
```javascript
// Simple access
MaterialSymbols.home
MaterialSymbols.search
MaterialSymbols.settings
MaterialSymbols.favorite

// Nested categories
MaterialSymbols.actions.add
MaterialSymbols.actions.edit
MaterialSymbols.arrows.left
MaterialSymbols.status.success
MaterialSymbols.social.favorite
```

### Material Symbols in Buttons
```javascript
Button({ class: 'flex items-center gap-2' }, [
  MaterialIcon({ name: MaterialSymbols.add, size: 'sm' }),
  'Add Item'
])

Button({ class: 'flex items-center gap-2 bg-primary text-white px-4 py-2 rounded' }, [
  MaterialIcon({ name: 'save', size: 'sm' }),
  'Save'
])
```

### When to Use Which Icon System

**Use Heroicons (Icon) when:**
- Need SVG precision
- Prefer curated, smaller set
- Already using Heroicons

**Use Material Symbols (MaterialIcon) when:**
- Need vast icon library (11,000+)
- Want filled/outlined/rounded/sharp variants
- Building Material Design interface

## Patterns by example

### Alert Component (Functional Atom)
```javascript
import { Div, H5, I, P } from '@base-framework/atoms';
import { Atom } from '@base-framework/base';

const AlertIcon = (icon, iconColor) => (
  Div({ class: `flex h-6 w-6 mr-3 ${iconColor}` }, [
    I({ html: icon })  // Icon as SVG string
  ])
);

export const Alert = Atom(({ title, description, icon, type = 'default' }) => {
  const styles = typeStyles[type];
  return Div({ class: `flex p-4 border rounded-lg ${styles.bgColor}` }, [
    icon && AlertIcon(icon, styles.iconColor),
    Div({ class: 'flex flex-col' }, [
      H5({ class: 'font-semibold' }, title),
      P({ class: 'text-sm' }, description)
    ])
  ]);
});
```

### Button with Icon (Variant Pattern)
```javascript
import { Button as BaseButton } from '@base-framework/atoms';
import { Atom } from '@base-framework/base';
import { Icon } from '../icon.js';

const IconButton = Atom((props, children) => (
  BaseButton({ ...props }, [
    props.icon && props.position !== 'right' ? Icon({ size: 'sm' }, props.icon) : null,
    ...(children || []),
    props.icon && props.position === 'right' ? Icon({ size: 'sm' }, props.icon) : null
  ])
));

export const Button = Atom((props, children) => {
  const VariantButton = BUTTON_VARIANTS[props.variant] || BUTTON_VARIANTS.primary;
  return VariantButton(props, children);
});
```

### Data-Driven Lists
```javascript
// Using map prop
Ul({ map: [items, (item) => Li(item.name)] })

// Using for with state
Div({ for: ['groups', (group) => Group(group)] })
```

### Stateful Component
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
      hasItems: this.rows?.length > 0
    });
  }

  render() {
    return Table([
      TableHeader({ headers: this.headers }),
      DataTableBody({ rows: this.rows })
    ]);
  }
}
```

## Import Patterns

### From External Packages
```javascript
// DOM elements
import { Div, Button, Input, I, Ul, Li, H5, P, Table } from '@base-framework/atoms';

// Reactive utilities
import { On, OnState, OnStateOpen, UseParent } from '@base-framework/atoms';

// Framework core
import { Atom, Component, Data, Jot } from '@base-framework/base';

// Routing
import { router, NavLink } from '@base-framework/base';
```

### From This Library
```javascript
// Icons - Heroicons (ALWAYS import both)
import { Icons } from '@base-framework/ui/icons';
import { Icon } from '@base-framework/ui/atoms';

// Icons - Material Symbols (ALWAYS import both)
import { MaterialSymbols } from '@base-framework/ui/icons';
import { MaterialIcon } from '@base-framework/ui/atoms';

// Atoms
import { Button, Badge, Alert } from '@base-framework/ui/atoms';

// Molecules
import { Form, Dropdown, Modal, DatePicker } from '@base-framework/ui/molecules';

// Organisms
import { DataTable, Calendar, TabGroup } from '@base-framework/ui/organisms';

// Pages
import { Page, BasicPage, SidebarMenuPage } from '@base-framework/ui/pages';

// Utils
import { Format, DateTime, ImageScaler } from '@base-framework/ui/utils';
```

### Relative (when authoring in this repo)
```javascript
import { Icons } from '../../icons/icons.js';
import { Icon } from '../icon.js';
```

## Coding rules (do/don't)

### ✅ DO:
- Import DOM elements from `@base-framework/atoms`
- Import Atom, Component, Data from `@base-framework/base`
- Pass children as SECOND argument: `Div({ class: 'x' }, [children])`
- Use Icons object: `import { Icons } from '@base-framework/ui/icons'`
- Use Icon atom: `Icon({ size: 'sm' }, Icons.home)`
- Use I element for icons: `I({ html: Icons.home })`
- Spread props: `{ ...defaultProps, ...props }`
- Use Tailwind semantic tokens (primary, secondary, destructive, warning, muted, accent)
- Use `map` or `for` for lists: `Ul({ map: [items, fn] })` or `Div({ for: ['items', fn] })`
- Use `bind` for two-way binding: `Input({ bind: 'username' })`
- Use `On` for data watchers: `On('count', (val) => ...)`
- Use `OnState` for state watchers: `OnState('isOpen', (val) => ...)`
- Use Data for reactive values: `new Data({ count: 0 })`
- Use setupStates for discrete states: `setupStates() { return { isOpen: false } }`
- Read documentation in `base.wiki/` for detailed patterns

### ❌ DON'T:
- Pass children in props: `Div({ children: [...] })`
- Use icon prop on Icon: `Icon({ icon: Icons.home })`
- Pass icon without props: `Icon(Icons.home)`
- Use React/Vue/JSX patterns
- Mutate DOM directly
- Use raw hex colors (use Tailwind tokens)
- Import Icons from wrong path
- Use regular JS map for reactive lists: `[items.map(...)]`
- Use value + onChange: use `bind` instead
- Use plain objects for reactive data: use `Data` instead
- Use useState hooks: use `Data` and `setupStates` instead

## Adding a new component (checklist)
1) Decide Atom vs Component (stateless vs stateful/interactive)
2) Place file under the correct layer folder and export it from that layer’s barrel (and from `src/ui.js` if needed via existing barrels)
3) Use Tailwind utility classes aligned with theme tokens
4) If it needs data/state, use `Data`/`Jot`, `On`, `bind`, `for` as seen in existing components
5) Run dev server and verify render; run build to ensure types emit

## Common Mistakes & Quick Fixes

### Icons Not Rendering
```javascript
// ❌ Wrong
Icon(Icons.home)                    // Missing props object
Icon({ icon: Icons.home })          // Wrong prop name, pass as child
I(Icons.home)                       // Must use html prop
Button({ icon: Icons.home })        // Missing variant: 'withIcon'

// ✅ Correct
Icon({ size: 'sm' }, Icons.home)
I({ html: Icons.home })
Button({ variant: 'withIcon', icon: Icons.plus }, 'Text')
```

### Children Not Appearing
```javascript
// ❌ Wrong
Div({ class: 'wrapper', children: [Div('test')] })  // children in props
Div({ class: 'wrapper' }, Div('test'))              // Single child must be array or string

// ✅ Correct
Div({ class: 'wrapper' }, [Div('test')])            // Array of children
Div({ class: 'wrapper' }, 'text only')              // Single text child
```

### Lists Not Rendering
```javascript
// ❌ Wrong
Ul([items.map(item => Li(item.name))])              // Regular JS map doesn't track reactivity
Div(items.map(item => ItemCard(item)))              // Missing props object, not reactive

// ✅ Correct
Ul({ map: [items, (item) => Li(item.name)] })      // Static/external arrays
Div({ for: ['items', (item) => ItemComponent(item)] })  // Component data (reactive)
```

### Not Reactive
```javascript
// ❌ Wrong (plain object)
this.state = { count: 0 };
this.state.count++;  // Doesn't trigger re-render

// ✅ Correct (use Data)
setData() {
  return new Data({ count: 0 });
}
// In method:
this.data.count++;  // Triggers re-render
```

### Binding Issues
```javascript
// ❌ Wrong
Input({ value: name, change: (e) => setName(e.target.value) })  // React pattern
Input({ value: this.data.username })  // One-way only, not reactive

// ✅ Correct
Input({ bind: 'username' })           // Two-way binding to component data
Input({ bind: [state, 'email'] })     // Two-way binding to external state
```

### Event Handling
```javascript
// ❌ Wrong
Button({ onClick: () => this.submit() })  // React pattern
Button({ onclick: () => this.submit() })  // Wrong casing

// ✅ Correct
Button({ click: () => this.submit() })    // Use 'click' not 'onClick'
```

### State Management
```javascript
// ❌ Wrong
const [isOpen, setIsOpen] = useState(false);  // React hooks
this.isOpen = false;  // Plain property

// ✅ Correct
setupStates() {
  return { isOpen: false };
}
// Toggle:
this.state.isOpen = !this.state.isOpen;
```

### Watchers
```javascript
// ❌ Wrong
useEffect(() => { ... }, [count]);  // React pattern
this.data.count.subscribe(val => ...);  // No such method

// ✅ Correct
render() {
  return Div([
    On('count', (value) => {
      console.log('Count changed:', value);
    })
  ]);
}
```

## Commands reference
- Dev: `npm run dev`
- Build: `npm run build`
- Preview: `npm run preview`

If anything seems unclear (e.g., preferred binding patterns or where to export), ask for confirmation before large changes.
