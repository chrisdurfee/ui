# Organisms Documentation - Base Framework UI

## Overview
Organisms are complex components with internal state management, combining atoms and molecules into functional units like tables, navigation, tabs, and calendars.

## TabGroup Component

Tabbed interface with state management:

```javascript
import { TabGroup } from '@base-framework/ui/organisms';

class MyTabbedView extends Component {
  render() {
    return new TabGroup({
      options: [
        { label: 'Overview', value: 'overview' },
        { label: 'Details', value: 'details' },
        { label: 'Settings', value: 'settings' }
      ],
      onSelect: (value) => {
        console.log('Selected tab:', value);
      }
    });
  }
}
```

### Tab Props

| Prop | Type | Description |
|------|------|-------------|
| `options` | array | Array of {label, value, disabled?} objects |
| `class` | string | Additional CSS classes |
| `onSelect` | function | Tab selection handler |

### Tab States

```javascript
// Tabs use internal state 'selected'
OnState('selected', (value) => {
  // React to tab changes
  loadTabContent(value);
})
```

### Underlined Tabs

```javascript
import { UnderlinedTabGroup } from '@base-framework/ui/organisms';

new UnderlinedTabGroup({
  options: tabs,
  onSelect: handleTabChange,
  class: 'border-b'
})
```

## Calendar Component

Full calendar with date selection:

```javascript
import { Calendar } from '@base-framework/ui/organisms';

new Calendar({
  selectedDate: '2024-01-15',
  selectedCallBack: (date) => {
    console.log('Selected:', date);
  },
  blockPriorDates: false
})
```

### Calendar Props

| Prop | Type | Description |
|------|------|-------------|
| `selectedDate` | string | Initially selected date (YYYY-MM-DD) |
| `selectedCallBack` | function | Date selection handler |
| `blockPriorDates` | boolean | Disable dates before today |

### Calendar States

```javascript
// Calendar states
setupStates() {
  return {
    view: 'calendar'  // 'calendar' | 'months' | 'years'
  };
}
```

### Calendar Data

```javascript
setData() {
  return new Data({
    currentDate: '2024-01-15',
    current: {
      date: 15,
      month: 0,  // 0-indexed
      year: 2024
    },
    today: {
      date: 22,
      month: 11,
      year: 2024
    }
  });
}
```

### Calendar Methods

```javascript
// Navigate months
goToPreviousMonth()
goToNextMonth()

// Set current date
setCurrentDate(month, year)

// Select date
selectDate(date)
```

## Data Table Components

### DataTable

Basic data table with sorting and selection:

```javascript
import { DataTable } from '@base-framework/ui/organisms';

new DataTable({
  headers: [
    { label: 'Name', key: 'name', sortable: true },
    { label: 'Email', key: 'email', sortable: true },
    { label: 'Status', key: 'status' }
  ],
  rows: [
    { id: 1, name: 'John Doe', email: 'john@example.com', status: 'Active' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', status: 'Inactive' }
  ]
})
```

### DataTable Props

| Prop | Type | Description |
|------|------|-------------|
| `headers` | array | Column definitions |
| `rows` | array | Data rows |
| `selectable` | boolean | Enable row selection |
| `sortable` | boolean | Enable sorting |
| `onRowClick` | function | Row click handler |

### ScrollableDataTable

Table with fixed height and scrolling:

```javascript
import { ScrollableDataTable } from '@base-framework/ui/organisms';

new ScrollableDataTable({
  headers: headers,
  rows: rows,
  maxHeight: '500px'
})
```

### DynamicDataTable

Table with dynamic data loading:

```javascript
import { DynamicDataTable } from '@base-framework/ui/organisms';

new DynamicDataTable({
  headers: headers,
  loadData: async (page, pageSize) => {
    // Fetch data from API
    return await fetchUsers(page, pageSize);
  },
  pageSize: 20
})
```

### Table Header

Custom table headers:

```javascript
import { TableHeader } from '@base-framework/ui/organisms';

TableHeader({
  headers: [
    { label: 'Name', key: 'name', width: '30%' },
    { label: 'Email', key: 'email', width: '40%' },
    { label: 'Actions', key: 'actions', width: '30%' }
  ],
  sortable: true,
  onSort: (key, direction) => {
    // Handle sorting
  }
})
```

### DataTable Body

```javascript
import { DataTableBody } from '@base-framework/ui/organisms';

DataTableBody({
  rows: data,
  columns: headers,
  renderCell: (row, column) => {
    // Custom cell rendering
    return Td(row[column.key]);
  }
})
```

## Navigation Components

### Navigation

Main navigation component:

```javascript
import { Navigation } from '@base-framework/ui/organisms';

new Navigation({
  brand: 'My App',
  links: [
    { label: 'Home', href: '/', icon: Icons.home },
    { label: 'Products', href: '/products', icon: Icons.box },
    { label: 'About', href: '/about', icon: Icons.info }
  ],
  actions: [
    Button({ variant: 'primary' }, 'Sign In')
  ]
})
```

### Sidebar Menu

Collapsible sidebar navigation:

```javascript
import { SidebarMenu } from '@base-framework/ui/organisms';

new SidebarMenu({
  items: [
    {
      label: 'Dashboard',
      icon: Icons.home,
      href: '/dashboard'
    },
    {
      label: 'Settings',
      icon: Icons.settings,
      children: [
        { label: 'Profile', href: '/settings/profile' },
        { label: 'Account', href: '/settings/account' }
      ]
    }
  ],
  collapsed: false
})
```

### Navigation Menu

Dropdown navigation menus:

```javascript
import { NavigationMenu } from '@base-framework/ui/organisms';

NavigationMenu({
  items: [
    {
      label: 'Products',
      children: [
        { label: 'All Products', href: '/products' },
        { label: 'New Arrivals', href: '/products/new' },
        { label: 'Sale', href: '/products/sale' }
      ]
    },
    {
      label: 'Resources',
      children: [
        { label: 'Documentation', href: '/docs' },
        { label: 'Tutorials', href: '/tutorials' },
        { label: 'Blog', href: '/blog' }
      ]
    }
  ]
})
```

### Inline Navigation

Horizontal navigation links:

```javascript
import { InlineNavigation } from '@base-framework/ui/organisms';

InlineNavigation({
  links: [
    { label: 'Overview', href: '/overview' },
    { label: 'Analytics', href: '/analytics' },
    { label: 'Reports', href: '/reports' }
  ],
  activeHref: '/overview'
})
```

### Mobile Navigation

Mobile-optimized navigation:

```javascript
import { MobileNavigation } from '@base-framework/ui/organisms';

new MobileNavigation({
  items: menuItems,
  brand: 'My App',
  logo: '/logo.svg'
})
```

## Overlay Components

### Panel

Slide-in panel overlay:

```javascript
import { Panel } from '@base-framework/ui/organisms';

class SettingsPanel extends Panel {
  declareProps() {
    super.declareProps();
    this.title = 'Settings';
    this.position = 'right';  // left/right
  }

  render() {
    return super.render([
      // Panel content
      Div({ class: 'space-y-4' }, [
        H3('Application Settings'),
        // Settings form
      ])
    ]);
  }
}
```

### Overlay

Full-screen overlay component:

```javascript
import { Overlay } from '@base-framework/ui/organisms';

new Overlay({
  content: ContentComponent(),
  onClose: () => closeOverlay(),
  dismissible: true
})
```

## Search Components

### SearchBar

Search input with suggestions:

```javascript
import { SearchBar } from '@base-framework/ui/organisms';

new SearchBar({
  placeholder: 'Search...',
  onSearch: (query) => {
    // Perform search
    return searchResults(query);
  },
  onSelect: (result) => {
    // Handle selection
    navigateTo(result.url);
  }
})
```

### SearchDropdown

Search with dropdown results:

```javascript
import { SearchDropdown } from '@base-framework/ui/organisms';

SearchDropdown({
  bind: 'searchQuery',
  items: searchableItems,
  filterFn: (item, query) => {
    return item.name.toLowerCase().includes(query.toLowerCase());
  },
  onSelect: (item) => {
    this.data.selectedItem = item;
  }
})
```

## Signature Component

Digital signature capture:

```javascript
import { Signature } from '@base-framework/ui/organisms';

new Signature({
  width: 400,
  height: 200,
  onSave: (signatureData) => {
    // Save signature image data
    saveSignature(signatureData);
  }
})
```

### Signature Methods

```javascript
// Clear signature
signature.clear()

// Get signature data URL
const imageData = signature.toDataURL()

// Check if signed
const isSigned = signature.isEmpty()
```

## ButtonGroup Component

Grouped button controls:

```javascript
import { ButtonGroup } from '@base-framework/ui/organisms';

new ButtonGroup({
  buttons: [
    { label: 'Left', value: 'left', icon: Icons.alignLeft },
    { label: 'Center', value: 'center', icon: Icons.alignCenter },
    { label: 'Right', value: 'right', icon: Icons.alignRight }
  ],
  selected: 'left',
  onSelect: (value) => {
    this.data.alignment = value;
  }
})
```

## List Components

### UserList

Display list of users with avatars:

```javascript
import { UserList } from '@base-framework/ui/organisms';

new UserList({
  users: [
    { id: 1, name: 'John Doe', avatar: '/john.jpg', role: 'Admin' },
    { id: 2, name: 'Jane Smith', avatar: '/jane.jpg', role: 'User' }
  ],
  onUserClick: (user) => {
    viewUserProfile(user.id);
  }
})
```

## Practical Examples

### Dashboard with Tabs and Table

```javascript
class Dashboard extends Component {
  setData() {
    return new Data({
      selectedTab: 'overview',
      users: []
    });
  }

  async loadUsers() {
    this.data.users = await fetchUsers();
  }

  render() {
    return Div([
      // Tab navigation
      new TabGroup({
        options: [
          { label: 'Overview', value: 'overview' },
          { label: 'Users', value: 'users' },
          { label: 'Analytics', value: 'analytics' }
        ],
        onSelect: (value) => {
          this.data.selectedTab = value;
          if (value === 'users') {
            this.loadUsers();
          }
        }
      }),

      // Tab content
      Div({ class: 'mt-4' }, [
        this.data.selectedTab === 'overview' ? (
          OverviewContent()
        ) : null,

        this.data.selectedTab === 'users' ? (
          new DataTable({
            headers: [
              { label: 'Name', key: 'name' },
              { label: 'Email', key: 'email' },
              { label: 'Role', key: 'role' }
            ],
            rows: this.data.users
          })
        ) : null
      ])
    ]);
  }
}
```

### Sidebar Layout with Navigation

```javascript
class AppLayout extends Component {
  setupStates() {
    return {
      sidebarOpen: true
    };
  }

  render() {
    return Div({ class: 'flex h-screen' }, [
      // Sidebar
      new SidebarMenu({
        collapsed: !this.state.sidebarOpen,
        items: [
          { label: 'Home', href: '/', icon: Icons.home },
          { label: 'Projects', href: '/projects', icon: Icons.folder },
          { label: 'Settings', href: '/settings', icon: Icons.settings }
        ]
      }),

      // Main content
      Div({ class: 'flex-1 overflow-auto' }, [
        // Content
        this.children
      ])
    ]);
  }
}
```

### Calendar with Date Selection

```javascript
class EventScheduler extends Component {
  setData() {
    return new Data({
      selectedDate: null,
      events: []
    });
  }

  loadEvents(date) {
    // Load events for selected date
    this.data.events = getEventsForDate(date);
  }

  render() {
    return Div({ class: 'grid grid-cols-2 gap-4' }, [
      // Calendar
      Div([
        new Calendar({
          selectedDate: this.data.selectedDate,
          selectedCallBack: (date) => {
            this.data.selectedDate = date;
            this.loadEvents(date);
          }
        })
      ]),

      // Events list
      Div([
        H3('Events'),
        this.data.events.length > 0 ? (
          Div({
            for: ['events', (event) => (
              EventCard(event)
            )]
          })
        ) : (
          EmptyState({
            title: 'No events',
            description: 'No events scheduled for this date'
          })
        )
      ])
    ]);
  }
}
```

### Searchable Data Table

```javascript
class UsersTable extends Component {
  setData() {
    return new Data({
      users: [],
      filteredUsers: [],
      searchQuery: ''
    });
  }

  render() {
    return Div([
      // Search
      SearchBar({
        placeholder: 'Search users...',
        onSearch: (query) => {
          this.data.searchQuery = query;
          this.data.filteredUsers = this.data.users.filter(user =>
            user.name.toLowerCase().includes(query.toLowerCase()) ||
            user.email.toLowerCase().includes(query.toLowerCase())
          );
        }
      }),

      // Watch search changes
      On('searchQuery', (query) => {
        if (!query) {
          this.data.filteredUsers = this.data.users;
        }
      }),

      // Table
      new DataTable({
        headers: tableHeaders,
        rows: this.data.searchQuery ? this.data.filteredUsers : this.data.users
      })
    ]);
  }
}
```

## Best Practices

### 1. Use Component Classes for State

```javascript
// ✅ CORRECT - Organism with Component class
export class MyOrganism extends Component {
  setData() {
    return new Data({ items: [] });
  }

  setupStates() {
    return { isOpen: false };
  }

  render() {
    return Div([...]);
  }
}
```

### 2. Expose Methods for External Control

```javascript
export class Panel extends Component {
  open() {
    this.state.isOpen = true;
  }

  close() {
    this.state.isOpen = false;
  }

  toggle() {
    this.state.isOpen = !this.state.isOpen;
  }
}

// Usage
const panel = new Panel();
panel.open();
```

### 3. Use declareProps for Configuration

```javascript
declareProps() {
  this.title = '';
  this.items = [];
  this.onSelect = null;
  this.maxHeight = '400px';
}
```

### 4. Provide Sensible Defaults

```javascript
render() {
  const maxHeight = this.maxHeight || '400px';
  const items = this.items || [];

  return Div({ style: `max-height: ${maxHeight}` }, [
    // Content
  ]);
}
```

## Next Steps

- [Pages Documentation](./06-Pages.md) - Page layouts and templates
- [Component Authoring](./07-Component-Authoring.md) - Build complex components
- [Utils Documentation](./08-Utils.md) - Utility functions
