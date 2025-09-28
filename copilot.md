# Copilot instructions for this repo

This repo is a UI component library for the Base Framework, organized with Atomic Design (atoms → molecules → organisms → pages/templates) and styled with Tailwind CSS v4. It builds to multiple entry points via Vite.

## How things fit together
- Runtime primitives come from external packages:
  - `@base-framework/base` supplies Component, Atom, Data, Jot, Events, router, NavLink, etc.
  - `@base-framework/atoms` supplies DOM tag helpers (Div, Button, Input, Ul, Li, etc.) and reactive helpers (On, OnState, UseParent, OnStateOpen).
- Local exports aggregate in `src/ui.js` and sub-entries in `vite.config.js`:
  - `@base-framework/ui` (index) exports everything from `components/*` and `utils/*`.
  - Subpath imports are enabled: `@base-framework/ui/atoms`, `.../icons`, `.../molecules`, `.../organisms`, `.../pages`, `.../templates`, `.../utils`.
- Styling is Tailwind 4 with custom CSS vars (see `tailwind.config.js`). Use existing design tokens like `text-muted-foreground`, `bg-muted/10`, `border`, `ring`.

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

## Patterns by example
- Functional Atom example (from `molecules/alert.js`):
  - Compose small atoms: `Div` containers + `I` for icons + `H5/P` for text
  - Type variants use lookup table → apply Tailwind classes from map
- Variant pattern (from `atoms/buttons/buttons.js`):
  - Define variant factories, then export a single `Button` Atom that dispatches by `props.variant`
  - Icon handling via a shared `IconButton` Atom; support `position: 'right'`
- Data-driven lists (from `molecules/dropdowns/dropdown.js`):
  - `for: ['groups', (group) => ...]` to render nested collections
- Stateful Component (from `organisms/panel.js`):
  - `class Panel extends Component { declareProps() { this.class = '' } render() { return Div({ class: this.class }, this.children) } }`

## Coding rules (do/don’t)
- Do: import primitives from `@base-framework/atoms` and state tools from `@base-framework/base`; keep them as externals.
- Do: export new public pieces from the appropriate barrel files (`components/*/atoms.js`, `.../molecules.js`, `.../organisms.js`, `pages.js`, `templates.js`, `utils.js`) so they are part of the library entry.
- Do: keep Tailwind classes consistent with existing tokens; avoid raw hex colors.
- Don’t: introduce React/Vue/JSX; this project uses Base’s declarative atoms/components.
- Don’t: mutate DOM directly; use Atom/Component APIs and Data bindings.

## Adding a new component (checklist)
1) Decide Atom vs Component (stateless vs stateful/interactive)
2) Place file under the correct layer folder and export it from that layer’s barrel (and from `src/ui.js` if needed via existing barrels)
3) Use Tailwind utility classes aligned with theme tokens
4) If it needs data/state, use `Data`/`Jot`, `On`, `bind`, `for` as seen in existing components
5) Run dev server and verify render; run build to ensure types emit

## Commands reference
- Dev: `npm run dev`
- Build: `npm run build`
- Preview: `npm run preview`

If anything seems unclear (e.g., preferred binding patterns or where to export), ask for confirmation before large changes.
