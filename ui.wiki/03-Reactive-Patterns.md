# Reactive Patterns - Base Framework UI

## Overview
Base Framework provides a reactive data system that enables two-way data binding, dynamic lists, and state management without the complexity of virtual DOM diffing.

## Core Concepts

### Data - Reactive State Container

`Data` creates an observable object that automatically updates the DOM when properties change:

```javascript
import { Data } from '@base-framework/base';

// In a Component
setData() {
  return new Data({
    count: 0,
    items: [],
    isOpen: false,
    user: {
      name: '',
      email: ''
    }
  });
}
```

### Accessing Data

```javascript
// Read
const count = this.data.count;

// Write (triggers update)
this.data.count = 5;

// Nested properties
this.data.user.name = 'John';

// Arrays
this.data.items.push(newItem);
this.data.items = this.data.items.filter(item => item.id !== removeId);
```

## Two-Way Data Binding

### Simple Binding (bind prop)

Bind input values directly to data properties:

```javascript
import { Input } from '@base-framework/atoms';

// Bind to component's data
Input({ bind: 'username', placeholder: 'Username' })

// Bind to nested property
Input({ bind: 'user.email', type: 'email' })

// Bind to external state
const externalState = new Data({ value: '' });
Input({ bind: [externalState, 'value'] })
```

### Supported Elements

```javascript
// Text inputs
Input({ bind: 'text', type: 'text' })
Input({ bind: 'email', type: 'email' })
Input({ bind: 'password', type: 'password' })

// Textarea
Textarea({ bind: 'description' })

// Checkbox
Input({ bind: 'accepted', type: 'checkbox' })

// Radio
Input({ bind: 'option', type: 'radio', value: 'a' })
Input({ bind: 'option', type: 'radio', value: 'b' })

// Select
Select({
  bind: 'country',
  options: countries
})
```

### Binding Arrays

```javascript
// Multiple select
Select({
  bind: 'selectedItems',
  multiple: true,
  options: items
})

// Checkbox group (each bound to array item)
Div([
  items.map((item, index) => (
    Label([
      Input({
        bind: `items.${index}.checked`,
        type: 'checkbox'
      }),
      Span(item.label)
    ])
  ))
])
```

## Dynamic Lists

### Using map Prop

For static or externally managed arrays:

```javascript
import { Ul, Li } from '@base-framework/atoms';

// Simple list
Ul({
  map: [items, (item) => Li(item.name)]
})

// With index
Ul({
  map: [items, (item, index) => (
    Li({ class: 'flex gap-2' }, [
      Span(index + 1),
      Span(item.name)
    ])
  )]
})

// Complex items
Div({
  class: 'grid gap-4',
  map: [users, (user) => (
    Card([
      CardHeader([
        CardTitle(user.name)
      ]),
      CardContent([
        P(user.email)
      ])
    ])
  )]
})
```

### Using for Prop

For component's reactive data (auto-updates on changes):

```javascript
// Bind to component data array
Div({
  class: 'grid gap-2',
  for: ['items', (item) => (
    Div({ class: 'p-4 border rounded' }, [
      H3(item.title),
      P(item.description)
    ])
  )]
})

// With nested paths
Div({
  for: ['user.posts', (post) => PostCard(post)]
})

// Grouping
Div({
  for: ['groups', (group) => (
    Div([
      H2(group.name),
      Ul({
        map: [group.items, (item) => Li(item.name)]
      })
    ])
  )]
})
```

### Dynamic List Operations

```javascript
class TodoList extends Component {
  setData() {
    return new Data({
      todos: [],
      newTodo: ''
    });
  }

  addTodo() {
    if (this.data.newTodo.trim()) {
      this.data.todos.push({
        id: Date.now(),
        text: this.data.newTodo,
        completed: false
      });
      this.data.newTodo = '';
    }
  }

  removeTodo(id) {
    this.data.todos = this.data.todos.filter(todo => todo.id !== id);
  }

  toggleTodo(id) {
    const todo = this.data.todos.find(t => t.id === id);
    if (todo) {
      todo.completed = !todo.completed;
    }
  }

  render() {
    return Div([
      // Add form
      Div({ class: 'flex gap-2' }, [
        Input({ bind: 'newTodo', placeholder: 'New todo' }),
        Button({
          click: () => this.addTodo()
        }, 'Add')
      ]),

      // Todo list
      Ul({
        class: 'space-y-2',
        for: ['todos', (todo) => (
          Li({ class: 'flex items-center gap-2' }, [
            Input({
              type: 'checkbox',
              checked: todo.completed,
              change: () => this.toggleTodo(todo.id)
            }),
            Span({
              class: todo.completed ? 'line-through' : ''
            }, todo.text),
            Button({
              variant: 'destructive',
              click: () => this.removeTodo(todo.id)
            }, 'Delete')
          ])
        )]
      })
    ]);
  }
}
```

## State Management

### Component States

Use `setupStates()` for discrete state values (open/closed, view modes, etc.):

```javascript
class Modal extends Component {
  setupStates() {
    return {
      isOpen: false,  // Boolean state
      view: 'list'    // String state (list/grid/etc)
    };
  }

  // Toggle state
  toggle() {
    this.state.isOpen = !this.state.isOpen;
  }

  // Switch view
  setView(view) {
    this.state.view = view;
  }
}
```

### Data vs State

**Use Data for:**
- Form values
- Collections/arrays
- Complex objects
- Any value that needs two-way binding

**Use State for:**
- Boolean flags (isOpen, isLoading)
- View modes (list/grid, tab selection)
- Simple string/number toggles

```javascript
class DataTable extends Component {
  declareProps() {
    this.rows = [];
  }

  setData() {
    return new Data({
      selectedRows: [],    // Data: dynamic array
      searchQuery: '',     // Data: bound to input
      sortField: 'name'    // Data: dynamic value
    });
  }

  setupStates() {
    return {
      view: 'table',       // State: discrete modes
      isLoading: false     // State: boolean flag
    };
  }
}
```

## Subscriptions and Watchers

### On - Subscribe to Data Changes

```javascript
import { On } from '@base-framework/atoms';

// Watch a single property
Div([
  On('count', (value) => {
    console.log('Count changed:', value);
  })
])

// In component render
render() {
  return Div([
    On('user.name', (name) => {
      // React to name changes
      this.updateProfile(name);
    }),
    // Rest of component
  ]);
}
```

### OnState - Subscribe to State Changes

```javascript
import { OnState } from '@base-framework/atoms';

render() {
  return Div([
    OnState('isOpen', (isOpen) => {
      if (isOpen) {
        this.loadContent();
      }
    }),
    // Component content
  ]);
}
```

### OnStateOpen - Run on State Becomes True

```javascript
import { OnStateOpen } from '@base-framework/atoms';

render() {
  return Div([
    OnStateOpen('isVisible', () => {
      // Only runs when isVisible becomes true
      this.startAnimation();
    }),
    // Component content
  ]);
}
```

## Parent Context

### UseParent - Access Parent Component

```javascript
import { UseParent } from '@base-framework/atoms';

const ChildComponent = Atom((props) => (
  Div([
    UseParent(({ data, state, panel }) => {
      // Access parent's data
      console.log(panel.data.items);

      // Call parent methods
      panel.selectItem(props.id);

      return null; // Or return markup that uses parent context
    }),
    // Child content
  ])
));
```

### Practical Example

```javascript
class Tabs extends Component {
  setData() {
    return new Data({
      activeTab: 0
    });
  }

  selectTab(index) {
    this.data.activeTab = index;
  }

  render() {
    return Div([
      TabButtons([
        UseParent(({ panel }) => (
          Button({
            click: () => panel.selectTab(0),
            class: panel.data.activeTab === 0 ? 'active' : ''
          }, 'Tab 1')
        ))
      ])
    ]);
  }
}
```

## Jot - Higher Order Components

Create components with built-in two-way binding:

```javascript
import { Jot } from '@base-framework/base';

// Create jot component
const Toggle = Jot((checked, setChecked) => (
  Button({
    click: () => setChecked(!checked),
    class: checked ? 'bg-primary' : 'bg-muted'
  }, [
    Span(checked ? 'ON' : 'OFF')
  ])
));

// Usage with external state
const state = new Data({ enabled: false });

Toggle({
  value: state.enabled,
  change: (val) => state.enabled = val
})
```

### SearchDropdown Example

```javascript
const SearchDropdown = Jot((value, setValue, props) => (
  Div([
    Input({
      value: value,
      input: (e) => setValue(e.target.value),
      placeholder: props.placeholder
    }),
    Dropdown({
      items: props.items.filter(item =>
        item.toLowerCase().includes(value.toLowerCase())
      ),
      onSelect: (item) => setValue(item)
    })
  ])
));

// Usage
SearchDropdown({
  value: this.data.search,
  change: (val) => this.data.search = val,
  placeholder: 'Search...',
  items: ['Apple', 'Banana', 'Cherry']
})
```

## Computed Values

### Simple Computed Properties

```javascript
class Cart extends Component {
  setData() {
    return new Data({
      items: [],
      taxRate: 0.08
    });
  }

  // Computed in render
  render() {
    const subtotal = this.data.items.reduce((sum, item) =>
      sum + (item.price * item.quantity), 0
    );
    const tax = subtotal * this.data.taxRate;
    const total = subtotal + tax;

    return Div([
      Div([
        Span('Subtotal: '),
        Span(Format.currency(subtotal))
      ]),
      Div([
        Span('Tax: '),
        Span(Format.currency(tax))
      ]),
      Div([
        Span('Total: '),
        Span(Format.currency(total))
      ])
    ]);
  }
}
```

### With Watchers for Updates

```javascript
class FilteredList extends Component {
  setData() {
    return new Data({
      items: allItems,
      filter: '',
      filtered: allItems
    });
  }

  render() {
    return Div([
      // Watch filter changes
      On('filter', (filter) => {
        this.data.filtered = this.data.items.filter(item =>
          item.name.toLowerCase().includes(filter.toLowerCase())
        );
      }),

      Input({ bind: 'filter', placeholder: 'Filter...' }),

      Div({
        for: ['filtered', (item) => ItemCard(item)]
      })
    ]);
  }
}
```

## Conditional Rendering

### Using State/Data for Conditions

```javascript
class ConditionalView extends Component {
  setupStates() {
    return {
      view: 'loading' // 'loading' | 'content' | 'error'
    };
  }

  render() {
    return Div([
      // Conditional based on state
      this.state.view === 'loading' ? LoadingSpinner() : null,

      this.state.view === 'content' ? ContentView() : null,

      this.state.view === 'error' ? ErrorMessage() : null
    ]);
  }
}
```

### Data-Driven Conditionals

```javascript
render() {
  return Div([
    // Show if has items
    this.data.items.length > 0 ? (
      Div({
        for: ['items', (item) => ItemCard(item)]
      })
    ) : (
      EmptyState({ message: 'No items found' })
    ),

    // Show loading indicator
    this.state.isLoading ? LoadingSpinner() : null,

    // Show error
    this.data.error ? (
      Alert({
        type: 'destructive',
        title: 'Error',
        description: this.data.error
      })
    ) : null
  ]);
}
```

## Common Patterns

### Form with Validation

```javascript
class ContactForm extends Component {
  setData() {
    return new Data({
      name: '',
      email: '',
      message: '',
      errors: {}
    });
  }

  validate() {
    const errors = {};

    if (!this.data.name) {
      errors.name = 'Name is required';
    }

    if (!this.data.email || !this.data.email.includes('@')) {
      errors.email = 'Valid email is required';
    }

    if (!this.data.message) {
      errors.message = 'Message is required';
    }

    this.data.errors = errors;
    return Object.keys(errors).length === 0;
  }

  submit(e) {
    e.preventDefault();

    if (this.validate()) {
      // Submit form
      console.log('Form data:', this.data);
    }
  }

  render() {
    return Form({ submit: (e) => this.submit(e) }, [
      FormField([
        Label('Name'),
        Input({ bind: 'name' }),
        this.data.errors.name ? (
          Span({ class: 'text-red-500 text-sm' }, this.data.errors.name)
        ) : null
      ]),

      FormField([
        Label('Email'),
        Input({ bind: 'email', type: 'email' }),
        this.data.errors.email ? (
          Span({ class: 'text-red-500 text-sm' }, this.data.errors.email)
        ) : null
      ]),

      FormField([
        Label('Message'),
        Textarea({ bind: 'message' }),
        this.data.errors.message ? (
          Span({ class: 'text-red-500 text-sm' }, this.data.errors.message)
        ) : null
      ]),

      Button({ type: 'submit', variant: 'primary' }, 'Submit')
    ]);
  }
}
```

### Master-Detail Pattern

```javascript
class MasterDetail extends Component {
  setData() {
    return new Data({
      items: [],
      selectedId: null
    });
  }

  get selectedItem() {
    return this.data.items.find(item => item.id === this.data.selectedId);
  }

  render() {
    return Div({ class: 'grid grid-cols-2 gap-4' }, [
      // Master list
      Div({ class: 'border-r' }, [
        Div({
          for: ['items', (item) => (
            Div({
              class: `p-4 cursor-pointer ${
                item.id === this.data.selectedId ? 'bg-primary text-white' : ''
              }`,
              click: () => this.data.selectedId = item.id
            }, item.name)
          )]
        })
      ]),

      // Detail view
      Div([
        this.selectedItem ? (
          Div([
            H2(this.selectedItem.name),
            P(this.selectedItem.description)
          ])
        ) : (
          P('Select an item')
        )
      ])
    ]);
  }
}
```

## Best Practices

### 1. Avoid Direct DOM Manipulation
```javascript
// ❌ WRONG
document.getElementById('myDiv').innerHTML = 'new content';

// ✅ CORRECT - Use data binding
this.data.content = 'new content';
```

### 2. Use Appropriate Data Structure
```javascript
// ❌ WRONG - Using state for complex data
setupStates() {
  return {
    user: { name: '', email: '' }  // Too complex for state
  };
}

// ✅ CORRECT - Use Data for objects
setData() {
  return new Data({
    user: { name: '', email: '' }
  });
}
```

### 3. Minimize Watchers
```javascript
// ❌ AVOID - Watcher for every property
On('prop1', callback)
On('prop2', callback)
On('prop3', callback)

// ✅ BETTER - Compute in render or single watcher
render() {
  const computed = this.data.prop1 + this.data.prop2 + this.data.prop3;
  return Div(computed);
}
```

### 4. Clean Array Updates
```javascript
// ✅ Reassign for reactivity
this.data.items = this.data.items.filter(item => item.id !== removeId);

// ✅ Push/pop work too
this.data.items.push(newItem);
this.data.items.pop();

// ✅ Splice works
this.data.items.splice(index, 1);
```

## Next Steps

- [Component Authoring](./05-Component-Authoring.md) - Build stateful components
- [Molecules Documentation](./04-Molecules.md) - Composed components
- [Forms Guide](./06-Forms.md) - Form handling patterns
