# Utils Documentation - Base Framework UI

## Overview
Base Framework UI provides utility functions for formatting, date/time manipulation, and image processing.

## Format Utilities

The `Format` module provides reactive formatters that work with data binding:

```javascript
import { Format } from '@base-framework/ui/utils';
```

### Number Formatting

Format numbers with thousands separators:

```javascript
// Static usage
Format.number(['count', (value) => {
  // Returns: "1,234,567"
  return value;
}])

// In component
Span({
  onState: Format.number('count')
})

// Result: Displays "1,234,567" when count is 1234567
```

### Currency Formatting

Format values as currency with symbol and decimals:

```javascript
// Default $ symbol
Format.money('price')
// Returns: "$1,234.56"

// Custom currency symbol
Format.money('price', '€')
// Returns: "€1,234.56"

// With default value
Format.money('price', '$', '0.00')
// Returns: "$0.00" if price is null/undefined

// In component
Span({
  onState: Format.money('total', '$')
})
```

### Phone Number Formatting

Format 10-digit US phone numbers:

```javascript
Format.phone('phoneNumber')
// Input: "5551234567"
// Output: "(555) 123-4567"

// In component
Span({
  onState: Format.phone('contactPhone', 'N/A')
})
```

### Boolean Formatting

Format boolean values as text:

```javascript
// Default Yes/No
Format.yesno('isActive')
// true → "Yes"
// false → "No"

// Custom labels
Format.yesno('isEnabled', 'Enabled', 'Disabled')
// true → "Enabled"
// false → "Disabled"

// In component
Span({
  onState: Format.yesno('accepted', 'Accepted', 'Declined')
})
```

### Integer Formatting

Convert to integer (removes decimals):

```javascript
Format.integer('count', 0)
// 5.7 → "5"
// "10" → "10"
// null → "0" (default)

// In component
Span({
  onState: Format.integer('quantity', '0')
})
```

### Date Formatting

Format dates using DateTime:

```javascript
// Standard date format
Format.date('createdDate')
// Output: "12/22/2024"

// With default value
Format.date('updatedDate', 'Not updated')

// In component
Span({
  onState: Format.date('publishDate', 'Not published')
})
```

### Date and Time Formatting

Format date with time:

```javascript
Format.dateTime('timestamp')
// Output: "12/22/2024 3:45 PM"

// In component
Span({
  onState: Format.dateTime('lastLogin', 'Never')
})
```

### Time Formatting

Format time only:

```javascript
Format.time('startTime')
// Output: "3:45 PM"

// 24-hour format
Format.time('startTime', 24)
// Output: "15:45"

// In component
Span({
  onState: Format.time('appointmentTime')
})
```

## Watcher Callbacks

Format utilities return watcher callbacks that integrate with Base Framework's reactive system:

### Simple Watcher

```javascript
// String path
On('count', Format.number('count')[1])
```

### Object Watcher

```javascript
// With options
On(Format.money('price', '$'))
```

### Array Watcher

```javascript
// Multiple properties
On(['price', Format.money(['price'], '$')])
```

## DateTime Utilities

Base Framework provides DateTime utilities (from `@base-framework/base`):

```javascript
import { DateTime } from '@base-framework/base';

// Format date
DateTime.format('standard', '2024-12-22')
// Output: "12/22/2024"

// Format time
DateTime.formatTime('2024-12-22T15:45:00', 12)
// Output: "3:45 PM"

DateTime.formatTime('2024-12-22T15:45:00', 24)
// Output: "15:45"

// Month names
DateTime.monthNames
// ['January', 'February', ...]

// Day names
DateTime.dayNames
// ['Sunday', 'Monday', ...]
```

## Image Scaler Utilities

Utilities for image manipulation with pointer events:

```javascript
import { ImageScaler } from '@base-framework/ui/utils';
```

### Creating Image Scaler

```javascript
const scaler = new ImageScaler({
  container: element,
  maxZoom: 3,
  minZoom: 0.5,
  step: 0.1
});

// Enable zoom
scaler.enableZoom();

// Enable drag
scaler.enableDrag();

// Zoom in
scaler.zoomIn();

// Zoom out
scaler.zoomOut();

// Reset
scaler.reset();

// Destroy
scaler.destroy();
```

### Image Scaler with Component

```javascript
export class ImageViewer extends Component {
  after() {
    const img = this.panel.querySelector('img');

    this.scaler = new ImageScaler({
      container: img,
      maxZoom: 5,
      minZoom: 1
    });

    this.scaler.enableZoom();
    this.scaler.enableDrag();
  }

  render() {
    return Div([
      Img({ src: this.imageUrl }),

      Div({ class: 'flex gap-2 mt-4' }, [
        Button({ click: () => this.scaler.zoomIn() }, 'Zoom In'),
        Button({ click: () => this.scaler.zoomOut() }, 'Zoom Out'),
        Button({ click: () => this.scaler.reset() }, 'Reset')
      ])
    ]);
  }

  destroy() {
    if (this.scaler) {
      this.scaler.destroy();
    }
  }
}
```

## Practical Examples

### Formatted Data Table

```javascript
import { DataTable } from '@base-framework/ui/organisms';
import { Format } from '@base-framework/ui/utils';

new DataTable({
  headers: [
    { label: 'Name', key: 'name' },
    {
      label: 'Price',
      key: 'price',
      render: (value) => Format.money(value, '$')
    },
    {
      label: 'In Stock',
      key: 'inStock',
      render: (value) => Format.yesno(value, 'Yes', 'No')
    },
    {
      label: 'Phone',
      key: 'phone',
      render: (value) => Format.phone(value)
    }
  ],
  rows: products
})
```

### Reactive Formatted Display

```javascript
export class PriceDisplay extends Component {
  setData() {
    return new Data({
      price: 0,
      quantity: 1
    });
  }

  render() {
    return Div({ class: 'space-y-2' }, [
      // Price per unit
      Div([
        Span('Price: '),
        Span({
          class: 'font-bold',
          onState: Format.money('price', '$')
        })
      ]),

      // Quantity
      Div([
        Span('Quantity: '),
        Span({
          class: 'font-bold',
          onState: Format.integer('quantity', '0')
        })
      ]),

      // Total (computed)
      Div([
        Span('Total: '),
        Span({
          class: 'text-lg font-bold',
          onState: ['price', 'quantity', (price, quantity) => {
            const total = price * quantity;
            return Format.money([total], '$')[1](total);
          }]
        })
      ])
    ]);
  }
}
```

### User Profile with Formatting

```javascript
export class UserProfile extends Component {
  declareProps() {
    this.user = null;
  }

  render() {
    return Card([
      CardHeader([
        CardTitle(this.user.name)
      ]),

      CardContent([
        // Email
        Div({ class: 'space-y-1' }, [
          Label('Email'),
          P(this.user.email)
        ]),

        // Phone
        Div({ class: 'space-y-1' }, [
          Label('Phone'),
          P(Format.phone([this.user.phone], 'N/A')[1](this.user.phone))
        ]),

        // Member since
        Div({ class: 'space-y-1' }, [
          Label('Member Since'),
          P(Format.date([this.user.createdAt])[1](this.user.createdAt))
        ]),

        // Active status
        Div({ class: 'space-y-1' }, [
          Label('Status'),
          Badge({
            color: this.user.isActive ? 'green' : 'gray'
          }, Format.yesno([this.user.isActive], 'Active', 'Inactive')[1](this.user.isActive))
        ])
      ])
    ]);
  }
}
```

### Invoice with Currency Formatting

```javascript
export class Invoice extends Component {
  declareProps() {
    this.items = [];
    this.taxRate = 0.08;
  }

  calculateSubtotal() {
    return this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }

  calculateTax(subtotal) {
    return subtotal * this.taxRate;
  }

  calculateTotal(subtotal, tax) {
    return subtotal + tax;
  }

  render() {
    const subtotal = this.calculateSubtotal();
    const tax = this.calculateTax(subtotal);
    const total = this.calculateTotal(subtotal, tax);

    return Card([
      CardHeader([
        CardTitle('Invoice')
      ]),

      CardContent([
        // Items
        Table([
          Thead([
            Tr([
              Th('Item'),
              Th('Quantity'),
              Th('Price'),
              Th('Total')
            ])
          ]),
          Tbody([
            this.items.map(item => (
              Tr([
                Td(item.name),
                Td(Format.integer([item.quantity])[1](item.quantity)),
                Td(Format.money([item.price], '$')[1](item.price)),
                Td(Format.money([item.price * item.quantity], '$')[1](item.price * item.quantity))
              ])
            ))
          ])
        ]),

        // Totals
        Div({ class: 'mt-4 space-y-2 text-right' }, [
          Div([
            Span('Subtotal: '),
            Span({ class: 'font-semibold' }, Format.money([subtotal], '$')[1](subtotal))
          ]),
          Div([
            Span('Tax: '),
            Span({ class: 'font-semibold' }, Format.money([tax], '$')[1](tax))
          ]),
          Div([
            Span({ class: 'text-lg' }, 'Total: '),
            Span({ class: 'text-lg font-bold' }, Format.money([total], '$')[1](total))
          ])
        ])
      ])
    ]);
  }
}
```

### Date Range Display

```javascript
export class EventDetails extends Component {
  declareProps() {
    this.event = null;
  }

  render() {
    return Div([
      H2(this.event.title),

      Div({ class: 'mt-4 space-y-2' }, [
        // Start date and time
        Div([
          Label('Starts:'),
          P(Format.dateTime([this.event.startDate])[1](this.event.startDate))
        ]),

        // End date and time
        Div([
          Label('Ends:'),
          P(Format.dateTime([this.event.endDate])[1](this.event.endDate))
        ]),

        // Duration
        Div([
          Label('Duration:'),
          P(this.calculateDuration())
        ])
      ])
    ]);
  }

  calculateDuration() {
    const start = new Date(this.event.startDate);
    const end = new Date(this.event.endDate);
    const hours = Math.floor((end - start) / (1000 * 60 * 60));
    return `${hours} hours`;
  }
}
```

## Creating Custom Formatters

You can create custom formatters following the same pattern:

```javascript
/**
 * Custom percentage formatter
 */
export const formatPercentage = (watcher, decimals = 2) => {
  const callBack = (value) => {
    const num = parseFloat(value);
    if (isNaN(num)) return '0%';
    return `${(num * 100).toFixed(decimals)}%`;
  };

  return createWatcherCallback(watcher, callBack);
};

// Usage
Span({
  onState: formatPercentage('conversionRate', 1)
})
// 0.156 → "15.6%"
```

```javascript
/**
 * Custom file size formatter
 */
export const formatFileSize = (watcher) => {
  const callBack = (bytes) => {
    if (bytes === 0) return '0 B';

    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
  };

  return createWatcherCallback(watcher, callBack);
};

// Usage
Span({
  onState: formatFileSize('fileSize')
})
// 1536 → "1.50 KB"
```

## Best Practices

### 1. Use Formatters for Display Only

```javascript
// ✅ CORRECT - Format for display
Span({
  onState: Format.money('price', '$')
})

// ❌ WRONG - Don't store formatted values in data
this.data.formattedPrice = Format.money(this.data.price);  // Wrong!
```

### 2. Provide Default Values

```javascript
// ✅ CORRECT - Handle null/undefined
Format.money('price', '$', '0.00')
Format.date('lastLogin', 'Never')
Format.phone('phoneNumber', 'N/A')
```

### 3. Choose Appropriate Format

```javascript
// ✅ Numbers with separators
Format.number('population')  // 1,234,567

// ✅ Money with decimals
Format.money('price')  // $1,234.56

// ✅ Integers without decimals
Format.integer('quantity')  // 5
```

### 4. Use DateTime for Consistency

```javascript
// ✅ CORRECT - Use built-in DateTime
DateTime.format('standard', date)

// ❌ AVOID - Custom date formatting can be inconsistent
date.toLocaleDateString()
```

## Next Steps

- [Component Authoring](./07-Component-Authoring.md) - Build components
- [Performance](./09-Performance.md) - Optimization techniques
- [Advanced Patterns](./10-Advanced-Patterns.md) - Complex use cases
