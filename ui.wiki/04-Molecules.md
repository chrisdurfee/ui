# Molecules Documentation - Base Framework UI

## Overview
Molecules are composed components that combine atoms and add light functionality. They represent common UI patterns like alerts, dropdowns, forms, and modals.

## Alert Component

Display contextual messages and notifications:

```javascript
import { Alert } from '@base-framework/ui/molecules';
import { Icons } from '@base-framework/ui/icons';
```

### Available Types

| Type | Description | Border Color |
|------|-------------|--------------|
| `default` | Standard alert | Gray border |
| `info` | Informational message | Blue border |
| `warning` | Warning message | Yellow border |
| `success` | Success message | Green border |
| `destructive` | Error/danger message | Red border |

### Usage

```javascript
// Basic alert
Alert({
  title: 'Notification',
  description: 'This is an alert message'
})

// With type
Alert({
  type: 'info',
  title: 'Information',
  description: 'Here is some important information'
})

// With icon
Alert({
  type: 'success',
  title: 'Success!',
  description: 'Your changes have been saved',
  icon: Icons.check
})

// Warning
Alert({
  type: 'warning',
  title: 'Warning',
  description: 'This action cannot be undone',
  icon: Icons.info
})

// Error
Alert({
  type: 'destructive',
  title: 'Error',
  description: 'Something went wrong',
  icon: Icons.close
})
```

### Props Reference

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `title` | string | Yes | Alert title |
| `description` | string | Yes | Alert message |
| `type` | string | No | Alert type (default/info/warning/success/destructive) |
| `icon` | string (SVG) | No | Icon to display |

## Dropdown Component

Render selectable dropdown menus:

```javascript
import { Dropdown } from '@base-framework/ui/molecules';
```

### Usage

```javascript
// Basic dropdown
Dropdown((item) => {
  console.log('Selected:', item);
})

// With grouped items (use 'for' with data)
Div({
  for: ['groups', (group) => Dropdown(onSelect)]
})
```

### DropdownItem

Individual dropdown items:

```javascript
import { DropdownItem } from '@base-framework/ui/molecules';

DropdownItem({
  label: 'Option 1',
  value: 'opt1',
  icon: Icons.home
}, onSelect)

// With description
DropdownItem({
  label: 'Settings',
  value: 'settings',
  description: 'Manage your preferences',
  icon: Icons.settings
}, onSelect)
```

### DropdownMenu

Container for dropdown menus with positioning:

```javascript
import { DropdownMenu } from '@base-framework/ui/molecules';

DropdownMenu({
  trigger: Button({ variant: 'outline' }, 'Open Menu'),
  items: [
    { label: 'Edit', value: 'edit', icon: Icons.edit },
    { label: 'Delete', value: 'delete', icon: Icons.trash }
  ],
  onSelect: (item) => handleAction(item)
})
```

## Modal Component

Create modal dialogs and drawers:

```javascript
import { Modal } from '@base-framework/ui/molecules';
```

### Basic Modal

```javascript
class MyModal extends Modal {
  declareProps() {
    super.declareProps();
    // Add custom props
  }

  render() {
    return super.render([
      // Modal content here
      Div([
        H2('Modal Title'),
        P('Modal content goes here')
      ])
    ]);
  }
}

// Usage
const modal = new MyModal({
  title: 'Confirmation',
  description: 'Are you sure?',
  onSubmit: () => handleConfirm(),
  onClose: () => handleClose()
});
```

### Modal Props

| Prop | Type | Description |
|------|------|-------------|
| `title` | string | Modal title |
| `description` | string | Modal description |
| `size` | string | Modal size (sm/md/lg/xl) |
| `type` | string | Modal type (right/left/drawer) |
| `hidePrimaryButton` | boolean | Hide primary action button |
| `hideFooter` | boolean | Hide footer entirely |
| `icon` | string (SVG) | Title icon |
| `onSubmit` | function | Submit handler |
| `onClose` | function | Close handler |
| `back` | boolean | Show back button |

### Modal Sizes

```javascript
// Small modal
new Modal({ size: 'sm', title: 'Small' })

// Medium (default)
new Modal({ size: 'md', title: 'Medium' })

// Large
new Modal({ size: 'lg', title: 'Large' })

// Extra large
new Modal({ size: 'xl', title: 'Extra Large' })
```

### Drawer Modals

```javascript
// Right drawer
new Modal({
  type: 'right',
  title: 'Settings',
  size: 'md'
})

// Left drawer
new Modal({
  type: 'left',
  title: 'Navigation'
})
```

### Modal Container

```javascript
import { ModalContainer } from '@base-framework/ui/molecules';

// Wrap content in modal container
ModalContainer({
  size: 'md',
  onClose: () => close()
}, [
  // Modal content
])
```

## Form Components

### Form

Enhanced form with validation handling:

```javascript
import { Form, FormField, FormControl } from '@base-framework/ui/molecules';

Form({
  submit: (e, parent) => {
    // Form data available in parent.data
    console.log('Submitted:', parent.data);
  },
  class: 'space-y-4'
}, [
  FormField([
    Label('Username'),
    Input({ bind: 'username', required: true })
  ]),

  Button({ type: 'submit' }, 'Submit')
])
```

### FormField

Wrapper for form field with label and error:

```javascript
import { FormField } from '@base-framework/ui/molecules';

FormField([
  Label('Email'),
  Input({ bind: 'email', type: 'email', required: true }),
  Span({ class: 'text-sm text-muted-foreground' }, 'We\'ll never share your email')
])
```

### FormControl

Advanced form control with validation:

```javascript
import { FormControl } from '@base-framework/ui/molecules';

FormControl({
  label: 'Password',
  name: 'password',
  bind: 'password',
  type: 'password',
  required: true,
  error: this.data.errors.password,
  hint: 'Must be at least 8 characters'
})
```

### FormCard

Form layout with card styling:

```javascript
import { FormCard } from '@base-framework/ui/molecules';

FormCard({
  title: 'User Information',
  description: 'Enter your details below',
  submit: handleSubmit
}, [
  FormField([...]),
  FormField([...])
])
```

## Combobox Component

Searchable select with dropdown:

```javascript
import { Combobox } from '@base-framework/ui/molecules';

Combobox({
  items: [
    { label: 'Apple', value: 'apple' },
    { label: 'Banana', value: 'banana' },
    { label: 'Cherry', value: 'cherry' }
  ],
  placeholder: 'Select a fruit',
  selectFirst: true,
  onSelect: (item, parent) => {
    console.log('Selected:', item);
  }
})
```

### Props

| Prop | Type | Description |
|------|------|-------------|
| `items` | array | Array of {label, value} objects |
| `class` | string | Additional CSS classes |
| `maxWidth` | string | Maximum width class |
| `width` | string | Width class |
| `name` | string | Form field name |
| `required` | boolean | Required field |
| `selectFirst` | boolean | Auto-select first item |
| `onSelect` | function | Selection handler |

### With Binding

```javascript
Combobox({
  items: countries,
  bind: 'selectedCountry',
  required: true,
  onSelect: (item) => {
    this.data.selectedCountry = item.value;
  }
})
```

## Date & Time Components

### DatePicker

Calendar-based date picker with input:

```javascript
import { DatePicker } from '@base-framework/ui/molecules';

DatePicker({
  bind: 'selectedDate',
  placeholder: 'mm/dd/yyyy',
  required: false,
  blockPriorDates: false
})

// With date blocking
DatePicker({
  bind: 'appointmentDate',
  blockPriorDates: true,
  placeholder: 'Select date'
})
```

### DateRangePicker

Select date ranges:

```javascript
import { DateRangePicker } from '@base-framework/ui/molecules';

DateRangePicker({
  bind: 'dateRange',
  startBind: 'startDate',
  endBind: 'endDate',
  placeholder: 'Select date range'
})
```

### TimePicker

Time selection component:

```javascript
import { TimePicker } from '@base-framework/ui/molecules';

TimePicker({
  bind: 'selectedTime',
  format: '24',  // or '12'
  required: false
})
```

### TimeFrame

Preset time frame selector:

```javascript
import { TimeFrame } from '@base-framework/ui/molecules';

TimeFrame({
  bind: 'timeframe',
  options: [
    { label: 'Last 7 days', value: '7d' },
    { label: 'Last 30 days', value: '30d' },
    { label: 'Last 90 days', value: '90d' }
  ]
})
```

## Dialog Component

Confirmation and action dialogs:

```javascript
import { Dialog } from '@base-framework/ui/molecules';

Dialog({
  title: 'Delete Item',
  description: 'Are you sure you want to delete this item? This action cannot be undone.',
  confirmText: 'Delete',
  cancelText: 'Cancel',
  onConfirm: () => deleteItem(),
  onCancel: () => close()
})
```

### Confirmation Dialog

```javascript
import { Confirmation } from '@base-framework/ui/molecules';

Confirmation({
  title: 'Confirm Action',
  message: 'Do you want to proceed?',
  confirmVariant: 'destructive',
  onConfirm: () => performAction()
})
```

## Avatar Components

### Avatar

User avatar with image or initials:

```javascript
import { Avatar } from '@base-framework/ui/molecules';

// With image
Avatar({
  src: '/path/to/image.jpg',
  alt: 'User Name',
  size: 'md'
})

// With initials
Avatar({
  initials: 'JD',
  size: 'lg'
})
```

### Sizes

- `xs` - Extra small
- `sm` - Small
- `md` - Medium (default)
- `lg` - Large
- `xl` - Extra large

### StatusIndicator

Avatar with status indicator:

```javascript
import { StatusIndicator } from '@base-framework/ui/molecules';

StatusIndicator({
  status: 'online',  // online/offline/away/busy
  size: 'md'
}, [
  Avatar({ src: userImage })
])
```

## Breadcrumb Component

Navigation breadcrumbs:

```javascript
import { Breadcrumb } from '@base-framework/ui/molecules';

Breadcrumb({
  items: [
    { label: 'Home', href: '/' },
    { label: 'Products', href: '/products' },
    { label: 'Details', href: '/products/123' }
  ]
})
```

### DotsIndicator

Breadcrumb with collapsed middle items:

```javascript
import { DotsIndicator } from '@base-framework/ui/molecules';

DotsIndicator({
  items: [
    { label: 'Home', href: '/' },
    { label: 'Products', href: '/products' },
    { label: 'Category', href: '/products/category' },
    { label: 'Subcategory', href: '/products/category/sub' },
    { label: 'Item', href: '/products/category/sub/item' }
  ],
  maxVisible: 3
})
```

## Counter Component

Increment/decrement input:

```javascript
import { Counter } from '@base-framework/ui/molecules';

Counter({
  bind: 'quantity',
  min: 1,
  max: 99,
  step: 1,
  size: 'md'
})
```

## Toggle Component

Switch/toggle control:

```javascript
import { Toggle } from '@base-framework/ui/molecules';

Toggle({
  bind: 'enabled',
  label: 'Enable notifications',
  size: 'md'
})

// With description
Toggle({
  bind: 'darkMode',
  label: 'Dark Mode',
  description: 'Use dark theme throughout the app',
  size: 'lg'
})
```

## ThemeToggle Component

Light/dark theme switcher:

```javascript
import { ThemeToggle } from '@base-framework/ui/molecules';

// Icon button
ThemeToggle({ variant: 'icon' })

// With label
ThemeToggle({
  variant: 'withLabel',
  label: 'Theme'
})
```

## Popover Component

Floating content overlay:

```javascript
import { PopOver } from '@base-framework/ui/molecules';

PopOver({
  trigger: Button('Show Info'),
  content: Div([
    H4('Popover Title'),
    P('Popover content goes here')
  ]),
  position: 'bottom'
})
```

### Positions

- `top`
- `bottom`
- `left`
- `right`
- `top-start`
- `top-end`
- `bottom-start`
- `bottom-end`

## Notification Component

Toast-style notifications:

```javascript
import { Notification } from '@base-framework/ui/molecules';

Notification({
  type: 'success',
  title: 'Success',
  message: 'Operation completed successfully',
  duration: 3000
})

// Error notification
Notification({
  type: 'error',
  title: 'Error',
  message: 'Something went wrong',
  dismissible: true
})
```

### NotificationContainer

Manages multiple notifications:

```javascript
import { NotificationContainer } from '@base-framework/ui/molecules';

// In your app root
NotificationContainer({
  position: 'top-right'  // top-right/top-left/bottom-right/bottom-left
})
```

## EmptyState Component

Show when no content is available:

```javascript
import { EmptyState } from '@base-framework/ui/molecules';

EmptyState({
  icon: Icons.inbox,
  title: 'No items found',
  description: 'Get started by creating your first item',
  action: Button({ variant: 'primary' }, 'Create Item')
})
```

## Image Uploaders

### ImageUploader

Upload and preview images:

```javascript
import { ImageUploader } from '@base-framework/ui/molecules';

ImageUploader({
  bind: 'imageUrl',
  accept: 'image/*',
  maxSize: 5 * 1024 * 1024,  // 5MB
  onUpload: async (file) => {
    // Handle upload
    return uploadedUrl;
  }
})
```

### LogoUploader

Specialized logo uploader:

```javascript
import { LogoUploader } from '@base-framework/ui/molecules';

LogoUploader({
  bind: 'logo',
  size: 'lg',
  shape: 'circle',  // circle/square
  onUpload: async (file) => {
    return await uploadLogo(file);
  }
})
```

## DelayComponent

Render content after delay:

```javascript
import { DelayComponent } from '@base-framework/ui/molecules';

DelayComponent({
  delay: 1000,  // milliseconds
  content: LoadingSpinner()
})
```

## Practical Examples

### Login Form

```javascript
import { Form, FormField, FormControl } from '@base-framework/ui/molecules';
import { Button } from '@base-framework/ui/atoms';

Form({
  submit: (e, parent) => {
    login(parent.data.email, parent.data.password);
  }
}, [
  FormControl({
    label: 'Email',
    bind: 'email',
    type: 'email',
    required: true,
    placeholder: 'you@example.com'
  }),

  FormControl({
    label: 'Password',
    bind: 'password',
    type: 'password',
    required: true
  }),

  Button({
    type: 'submit',
    variant: 'primary',
    class: 'w-full'
  }, 'Sign In')
])
```

### User Profile Card

```javascript
Card([
  CardHeader({ class: 'flex items-center gap-4' }, [
    Avatar({
      src: user.avatar,
      size: 'xl'
    }),
    Div([
      CardTitle(user.name),
      P({ class: 'text-muted-foreground' }, user.email)
    ])
  ]),

  CardContent([
    Div({ class: 'space-y-2' }, [
      Toggle({
        bind: 'emailNotifications',
        label: 'Email Notifications'
      }),
      Toggle({
        bind: 'pushNotifications',
        label: 'Push Notifications'
      })
    ])
  ]),

  CardFooter([
    Button({ variant: 'primary' }, 'Save Changes')
  ])
])
```

### Delete Confirmation

```javascript
import { Modal } from '@base-framework/ui/molecules';
import { Icons } from '@base-framework/ui/icons';

class DeleteConfirmModal extends Modal {
  constructor() {
    super({
      title: 'Delete Item',
      description: 'This action cannot be undone.',
      icon: Icons.trash,
      size: 'sm',
      onSubmit: () => this.handleDelete()
    });
  }

  handleDelete() {
    deleteItem(this.itemId);
    this.close();
  }

  render() {
    return super.render([
      Alert({
        type: 'destructive',
        title: 'Warning',
        description: 'All data associated with this item will be permanently deleted.'
      })
    ]);
  }
}
```

## Best Practices

### 1. Use Form Components

```javascript
// ✅ CORRECT - Use Form with submit handler
Form({ submit: handleSubmit }, [
  FormField([...])
])

// ❌ AVOID - Manual form handling
BaseForm({ submit: (e) => {
  e.preventDefault();
  // manual validation...
}})
```

### 2. Bind Inputs

```javascript
// ✅ CORRECT - Use bind for two-way binding
Input({ bind: 'username' })

// ❌ AVOID - Manual value management
Input({
  value: this.data.username,
  input: (e) => this.data.username = e.target.value
})
```

### 3. Leverage Combobox for Searchable Selects

```javascript
// ✅ CORRECT - Combobox for many options
Combobox({
  items: countries,
  onSelect: handleSelect
})

// ❌ AVOID - Regular select with 100s of options
Select({ options: countries })
```

## Next Steps

- [Organisms Documentation](./05-Organisms.md) - Complex components
- [Forms Guide](./06-Forms.md) - Advanced form patterns
- [Component Authoring](./07-Component-Authoring.md) - Build your own
