# Component Authoring Guide - Base Framework UI

## Overview
Learn how to create custom components using Base Framework patterns, from simple atoms to complex organisms with state management.

## Creating Atoms

Atoms are stateless, functional components created with the `Atom` function:

### Basic Atom

```javascript
import { Div } from '@base-framework/atoms';
import { Atom } from '@base-framework/base';

export const MyAtom = Atom((props, children) => (
  Div({
	...props,
	class: `base-classes ${props.class || ''}`
  }, children)
));
```

### Atom with Default Props

```javascript
export const StyledButton = Atom((props, children) => {
  const defaultProps = {
	class: 'px-4 py-2 rounded-lg',
	variant: 'primary'
  };

  return Button({
	...defaultProps,
	...props,
	class: `${defaultProps.class} ${props.class || ''}`
  }, children);
});
```

### Atom with Variants

```javascript
const VARIANTS = {
  primary: { class: 'bg-primary text-white' },
  secondary: { class: 'bg-secondary text-white' },
  outline: { class: 'border border-primary text-primary' }
};

export const StyledCard = Atom((props, children) => {
  const variant = VARIANTS[props.variant] || VARIANTS.primary;

  return Div({
	...variant,
	...props,
	class: `${variant.class} rounded-lg p-4 ${props.class || ''}`
  }, children);
});
```

### Atom with Conditional Elements

```javascript
export const IconLabel = Atom((props, children) => (
  Div({ class: 'flex items-center gap-2' }, [
	props.icon ? Icon({ size: 'sm' }, props.icon) : null,
	Span(children),
	props.badge ? Badge({ color: 'primary' }, props.badge) : null
  ])
));
```

## Creating Components

Components are stateful classes that extend `Component`:

### Basic Component

```javascript
import { Component, Data } from '@base-framework/base';
import { Div } from '@base-framework/atoms';

export class MyComponent extends Component {
  /**
   * Declare props for external configuration
   */
  declareProps() {
	this.title = '';
	this.items = [];
  }

  /**
   * Set up reactive data
   */
  setData() {
	return new Data({
	  selectedItem: null,
	  isLoading: false
	});
  }

  /**
   * Set up discrete states
   */
  setupStates() {
	return {
	  view: 'list'  // 'list' | 'grid'
	};
  }

  /**
   * Called before component mounts
   */
  before() {
	// Initialize, check permissions, etc.
  }

  /**
   * Called after component mounts
   */
  after() {
	// Load data, set up listeners
	this.loadItems();
  }

  /**
   * Render the component
   */
  render() {
	return Div([
	  H2(this.title),
	  // Component content
	]);
  }

  /**
   * Called before component unmounts
   */
  destroy() {
	// Clean up listeners, cancel requests
  }
}
```

### Component with Methods

```javascript
export class Counter extends Component {
  setData() {
	return new Data({
	  count: 0
	});
  }

  increment() {
	this.data.count++;
  }

  decrement() {
	this.data.count--;
  }

  reset() {
	this.data.count = 0;
  }

  render() {
	return Div({ class: 'flex items-center gap-4' }, [
	  Button({ click: () => this.decrement() }, '-'),
	  Span({ class: 'text-2xl font-bold' }, [
		On('count', (count) => count)
	  ]),
	  Button({ click: () => this.increment() }, '+'),
	  Button({
		variant: 'outline',
		click: () => this.reset()
	  }, 'Reset')
	]);
  }
}
```

## Props Patterns

### Simple Props

```javascript
declareProps() {
  // String prop
  this.title = '';

  // Number prop
  this.maxItems = 10;

  // Boolean prop
  this.disabled = false;

  // Array prop
  this.items = [];

  // Object prop
  this.config = {};

  // Function prop
  this.onSelect = null;
}
```

### Props with Documentation

```javascript
declareProps() {
  /**
   * @member {string} title
   * @default ''
   * @description The title displayed at the top
   */
  this.title = '';

  /**
   * @member {Array<object>} items
   * @default []
   * @description List of items to display
   */
  this.items = [];

  /**
   * @member {function} onSelect
   * @default null
   * @description Callback when item is selected
   */
  this.onSelect = null;
}
```

### Props Spreading

```javascript
const MyAtom = Atom((props, children) => {
  // Extract specific props
  const { icon, variant, ...restProps } = props;

  return Button({
	...restProps,  // Spread remaining props
	class: `variant-${variant} ${restProps.class || ''}`
  }, [
	icon ? Icon({ size: 'sm' }, icon) : null,
	...children
  ]);
});
```

## Data Management

### Reactive Data

```javascript
setData() {
  return new Data({
	// Simple values
	name: '',
	age: 0,

	// Arrays
	items: [],
	selectedIds: [],

	// Objects
	user: {
	  name: '',
	  email: ''
	},

	// Computed properties (recalculated in render)
	// Don't store computed values in data
  });
}
```

### Updating Data

```javascript
// Simple assignment
this.data.count = 5;

// Nested property
this.data.user.name = 'John';

// Array operations
this.data.items.push(newItem);
this.data.items = this.data.items.filter(item => item.id !== removeId);

// Object updates
this.data.user = { ...this.data.user, email: 'new@example.com' };
```

### Watching Data Changes

```javascript
render() {
  return Div([
	// Watch single property
	On('count', (value) => {
	  console.log('Count changed:', value);
	  if (value > 10) {
		this.showWarning();
	  }
	}),

	// Watch nested property
	On('user.name', (name) => {
	  this.updateProfile(name);
	}),

	// Display content
	Div('Content')
  ]);
}
```

## State Management

### Discrete States

```javascript
setupStates() {
  return {
	// Boolean states
	isOpen: false,
	isLoading: false,

	// String states (modes)
	view: 'list',  // 'list' | 'grid' | 'table'
	tab: 'overview'  // 'overview' | 'details' | 'settings'
  };
}
```

### Toggling States

```javascript
toggle() {
  this.state.isOpen = !this.state.isOpen;
}

switchView(view) {
  this.state.view = view;
}
```

### State-Driven Rendering

```javascript
render() {
  return Div([
	// Conditional based on state
	this.state.isLoading ? LoadingSpinner() : null,

	// Switch on state value
	this.state.view === 'list' ? ListView() : null,
	this.state.view === 'grid' ? GridView() : null,
	this.state.view === 'table' ? TableView() : null
  ]);
}
```

## Event Handling

### Click Events

```javascript
Button({
  click: (e) => {
	console.log('Clicked');
	this.handleClick();
  }
}, 'Click me')

// Method reference
Button({
  click: () => this.handleClick()
}, 'Click me')
```

### Input Events

```javascript
Input({
  input: (e) => {
	const value = e.target.value;
	this.data.searchQuery = value;
  }
})

// With debouncing
Input({
  input: (e) => {
	clearTimeout(this.debounceTimer);
	this.debounceTimer = setTimeout(() => {
	  this.performSearch(e.target.value);
	}, 300);
  }
})
```

### Form Submission

```javascript
Form({
  submit: (e, parent) => {
	e.preventDefault();

	// Access form data from parent
	const formData = {
	  username: parent.data.username,
	  email: parent.data.email
	};

	this.submitForm(formData);
  }
}, [
  Input({ bind: 'username' }),
  Input({ bind: 'email', type: 'email' }),
  Button({ type: 'submit' }, 'Submit')
])
```

## Composition Patterns

### Atom Composition

```javascript
// Base atom
const Card = Atom((props, children) => (
  Div({
	...props,
	class: `border rounded-lg ${props.class || ''}`
  }, children)
));

// Composed atom
const ProfileCard = Atom((props) => (
  Card({ class: 'p-4' }, [
	Avatar({ src: props.avatar }),
	H3(props.name),
	P(props.bio)
  ])
));
```

### Component Composition

```javascript
export class UserList extends Component {
  declareProps() {
	this.users = [];
  }

  renderUser(user) {
	return UserCard({
	  user: user,
	  onClick: () => this.selectUser(user)
	});
  }

  render() {
	return Div({
	  class: 'space-y-2',
	  map: [this.users, (user) => this.renderUser(user)]
	});
  }
}
```

### Higher-Order Components with Jot

```javascript
export const SearchableList = Jot({
  setData() {
	return new Data({
	  items: this.items || [],
	  filteredItems: this.items || []
	});
  },

  render() {
	return Div([
	  Input({
		placeholder: 'Search...',
		input: (e) => {
		  const query = e.target.value.toLowerCase();
		  this.data.filteredItems = this.data.items.filter(item =>
			item.name.toLowerCase().includes(query)
		  );
		}
	  }),

	  Div({
		for: ['filteredItems', (item) => this.renderItem(item)]
	  })
	]);
  }
});
```

## Advanced Patterns

### Modal Pattern

```javascript
import { Modal } from '@base-framework/ui/molecules';

export class ConfirmModal extends Modal {
  declareProps() {
	super.declareProps();
	this.message = '';
	this.onConfirm = null;
  }

  handleConfirm() {
	if (this.onConfirm) {
	  this.onConfirm();
	}
	this.close();
  }

  render() {
	return super.render([
	  P(this.message),

	  Div({ class: 'flex gap-2 justify-end mt-4' }, [
		Button({
		  variant: 'outline',
		  click: () => this.close()
		}, 'Cancel'),

		Button({
		  variant: 'destructive',
		  click: () => this.handleConfirm()
		}, 'Confirm')
	  ])
	]);
  }
}

// Usage
const modal = new ConfirmModal({
  title: 'Delete Item',
  message: 'Are you sure you want to delete this item?',
  onConfirm: () => deleteItem(itemId)
});
```

### Wizard/Stepper Pattern

```javascript
export class Wizard extends Component {
  declareProps() {
	this.steps = [];
	this.onComplete = null;
  }

  setData() {
	return new Data({
	  currentStep: 0,
	  stepData: {}
	});
  }

  nextStep() {
	if (this.data.currentStep < this.steps.length - 1) {
	  this.data.currentStep++;
	} else {
	  this.complete();
	}
  }

  previousStep() {
	if (this.data.currentStep > 0) {
	  this.data.currentStep--;
	}
  }

  complete() {
	if (this.onComplete) {
	  this.onComplete(this.data.stepData);
	}
  }

  render() {
	const currentStep = this.steps[this.data.currentStep];

	return Div([
	  // Progress indicator
	  Div({ class: 'flex gap-2 mb-8' }, [
		this.steps.map((step, index) => (
		  Div({
			class: `h-2 flex-1 rounded ${
			  index <= this.data.currentStep ? 'bg-primary' : 'bg-muted'
			}`
		  })
		))
	  ]),

	  // Current step content
	  currentStep.render(this.data.stepData),

	  // Navigation
	  Div({ class: 'flex justify-between mt-8' }, [
		Button({
		  variant: 'outline',
		  disabled: this.data.currentStep === 0,
		  click: () => this.previousStep()
		}, 'Back'),

		Button({
		  variant: 'primary',
		  click: () => this.nextStep()
		}, this.data.currentStep === this.steps.length - 1 ? 'Complete' : 'Next')
	  ])
	]);
  }
}
```

### Infinite Scroll Pattern

```javascript
export class InfiniteList extends Component {
  declareProps() {
	this.loadItems = null;
	this.pageSize = 20;
  }

  setData() {
	return new Data({
	  items: [],
	  page: 0,
	  hasMore: true,
	  isLoading: false
	});
  }

  after() {
	this.setupIntersectionObserver();
	this.loadMore();
  }

  setupIntersectionObserver() {
	const sentinel = this.panel.querySelector('[data-sentinel]');
	if (!sentinel) return;

	const observer = new IntersectionObserver((entries) => {
	  if (entries[0].isIntersecting && !this.data.isLoading && this.data.hasMore) {
		this.loadMore();
	  }
	});

	observer.observe(sentinel);
	this.observer = observer;
  }

  async loadMore() {
	if (this.data.isLoading || !this.data.hasMore) return;

	this.data.isLoading = true;

	try {
	  const newItems = await this.loadItems(this.data.page, this.pageSize);

	  if (newItems.length < this.pageSize) {
		this.data.hasMore = false;
	  }

	  this.data.items = [...this.data.items, ...newItems];
	  this.data.page++;
	} finally {
	  this.data.isLoading = false;
	}
  }

  render() {
	return Div([
	  Div({
		for: ['items', (item) => ItemCard(item)]
	  }),

	  // Sentinel element for intersection observer
	  Div({ 'data-sentinel': true, class: 'h-1' }),

	  // Loading indicator
	  this.data.isLoading ? LoadingSpinner() : null,

	  // End message
	  !this.data.hasMore ? P('No more items') : null
	]);
  }

  destroy() {
	if (this.observer) {
	  this.observer.disconnect();
	}
  }
}
```

## Best Practices

### 1. Choose the Right Component Type

```javascript
// ✅ Atom for stateless UI
export const Badge = Atom((props, children) => (
  Span({ class: 'badge' }, children)
));

// ✅ Component for stateful logic
export class DataTable extends Component {
  setData() {
	return new Data({ selectedRows: [] });
  }
}
```

### 2. Props Merge Pattern

```javascript
// ✅ CORRECT - Merge props properly
const MyAtom = Atom((props, children) => (
  Div({
	...defaultProps,
	...props,
	class: `${defaultProps.class} ${props.class || ''}`
  }, children)
));
```

### 3. Clean Up Resources

```javascript
// ✅ CORRECT - Clean up in destroy
destroy() {
  if (this.timer) clearTimeout(this.timer);
  if (this.subscription) this.subscription.unsubscribe();
  if (this.observer) this.observer.disconnect();
}
```

### 4. Use Appropriate Data Structures

```javascript
// ✅ Data for reactive values
setData() {
  return new Data({ items: [], selectedId: null });
}

// ✅ State for discrete modes
setupStates() {
  return { view: 'list', isOpen: false };
}
```

### 5. Document Your Components

```javascript
/**
 * UserCard displays user information with avatar and actions.
 *
 * @example
 * UserCard({
 *   user: { name: 'John', avatar: '/john.jpg' },
 *   onEdit: () => editUser()
 * })
 */
export const UserCard = Atom((props) => (
  // Component implementation
));
```

## Next Steps

- [Testing Guide](./09-Testing.md) - Test your components
- [Performance Optimization](./10-Performance.md) - Optimize rendering
- [Advanced Patterns](./11-Advanced-Patterns.md) - Complex use cases
