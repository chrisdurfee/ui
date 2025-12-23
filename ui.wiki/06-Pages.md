# Pages Documentation - Base Framework UI

## Overview
Page components provide layout structures and routing integration for building complete application pages. They extend the Base Framework's routing system.

## Page Base Class

All page components extend from the `Page` class:

```javascript
import { Page } from '@base-framework/ui/pages';

export class MyPage extends Page {
  declareProps() {
    this.class = '';  // Additional CSS classes
  }

  render() {
    return Div({ class: this.class }, this.children);
  }
}
```

## BasicPage

Foundation for route-based pages with update lifecycle:

```javascript
import { BasicPage } from '@base-framework/ui/pages';

export class DashboardPage extends BasicPage {
  /**
   * Called every time the route is activated
   */
  update(params) {
    // Load data based on route params
    this.loadDashboardData(params.id);
  }

  render() {
    return Div([
      H1('Dashboard'),
      // Page content
    ]);
  }
}
```

### Update Method

The `update(params)` method is called when:
- Route is first activated
- Route parameters change
- Navigating to the same route with different params

```javascript
update(params) {
  // params contains route parameters
  if (params.id) {
    this.loadUser(params.id);
  }

  if (params.tab) {
    this.switchTab(params.tab);
  }
}
```

## MainSection

Container for main content area with routing:

```javascript
import { MainSection } from '@base-framework/ui/pages';

MainSection({
  route: [
    { path: '/', component: HomePage },
    { path: '/about', component: AboutPage },
    { path: '/contact', component: ContactPage }
  ]
}, [
  // Additional content outside router
])
```

### With Navigation

```javascript
Div([
  Navigation({
    links: navLinks
  }),

  MainSection({
    route: routes,
    class: 'container mx-auto p-4'
  })
])
```

## Sidebar Layout Pages

### SidebarMenuPage

Page with collapsible sidebar navigation:

```javascript
import { SidebarMenuPage } from '@base-framework/ui/pages';

export class AppPage extends SidebarMenuPage {
  declareProps() {
    super.declareProps();

    this.title = 'My Application';

    this.links = [
      { label: 'Home', href: '/', icon: Icons.home },
      { label: 'Projects', href: '/projects', icon: Icons.folder },
      { label: 'Settings', href: '/settings', icon: Icons.settings }
    ];

    this.routes = [
      { path: '/', component: HomePage },
      { path: '/projects', component: ProjectsPage },
      { path: '/settings', component: SettingsPage }
    ];
  }

  // Optional: Customize sidebar
  addSidebar() {
    return new SidebarMenu({
      links: this.links,
      title: this.title
    });
  }

  // Optional: Customize main content
  addBody() {
    return Div({ class: 'flex-1 p-6' }, this.children);
  }
}
```

### SidebarMenuPage Props

| Prop | Type | Description |
|------|------|-------------|
| `routes` | array | Route definitions |
| `links` | array | Sidebar navigation links |
| `switch` | array | Additional route switches |
| `title` | string | Application title |

## Full-Page Layouts

### FullPage

Full viewport page without padding:

```javascript
import { FullPage } from '@base-framework/ui/pages';

export class SplashPage extends FullPage {
  render() {
    return Div({ class: 'h-screen bg-primary flex items-center justify-center' }, [
      Logo(),
      H1({ class: 'text-4xl text-white' }, 'Welcome')
    ]);
  }
}
```

### FullscreenPage

True fullscreen page (100vw x 100vh):

```javascript
import { FullscreenPage } from '@base-framework/ui/pages';

export class VideoPage extends FullscreenPage {
  render() {
    return Div({ class: 'relative w-full h-full' }, [
      Video({ src: videoUrl, class: 'w-full h-full object-cover' }),
      CloseButton()
    ]);
  }
}
```

### FullContainPage

Full viewport with container constraints:

```javascript
import { FullContainPage } from '@base-framework/ui/pages';

export class LandingPage extends FullContainPage {
  render() {
    return Div({ class: 'container mx-auto px-4' }, [
      Hero(),
      Features(),
      CallToAction()
    ]);
  }
}
```

## Centered Layouts

### CenterPage

Vertically and horizontally centered content:

```javascript
import { CenterPage } from '@base-framework/ui/pages';

export class LoginPage extends CenterPage {
  render() {
    return Card({ class: 'w-full max-w-md' }, [
      CardHeader([
        CardTitle('Sign In')
      ]),
      CardContent([
        LoginForm()
      ])
    ]);
  }
}
```

### Use Cases for CenterPage:
- Login/signup forms
- Error pages (404, 500)
- Loading screens
- Modal-like content

## BlankPage

Minimal page without any default styling:

```javascript
import { BlankPage } from '@base-framework/ui/pages';

export class CustomPage extends BlankPage {
  render() {
    return Div([
      // Complete custom layout
      CustomHeader(),
      CustomContent(),
      CustomFooter()
    ]);
  }
}
```

## Page Templates

### AsideTemplate

Two-column layout with sidebar and main content:

```javascript
import { AsideTemplate } from '@base-framework/ui/pages';

AsideTemplate({
  left: Sidebar(),
  right: MainContent()
})

// With custom widths
AsideTemplate({
  left: Div({ class: 'w-64' }, [Sidebar()]),
  right: Div({ class: 'flex-1' }, [MainContent()])
})
```

## Routing Integration

### Basic Routing

```javascript
import { BasicPage } from '@base-framework/ui/pages';

class HomePage extends BasicPage {
  render() {
    return Div([
      H1('Home'),
      NavLink({ to: '/about' }, 'About Us')
    ]);
  }
}

// In router configuration
const routes = [
  { path: '/', component: HomePage },
  { path: '/about', component: AboutPage }
];
```

### Nested Routes

```javascript
class ParentPage extends BasicPage {
  render() {
    return Div([
      Navigation(),

      MainSection({
        route: [
          { path: '/products', component: ProductsListPage },
          { path: '/products/:id', component: ProductDetailPage }
        ]
      })
    ]);
  }
}
```

### Route Parameters

```javascript
class UserPage extends BasicPage {
  update(params) {
    // Access route parameters
    const userId = params.id;
    this.loadUser(userId);
  }

  setData() {
    return new Data({
      user: null
    });
  }

  async loadUser(id) {
    this.data.user = await fetchUser(id);
  }

  render() {
    return Div([
      this.data.user ? (
        UserProfile({ user: this.data.user })
      ) : (
        LoadingSpinner()
      )
    ]);
  }
}

// Route: /users/:id
```

### Query Parameters

```javascript
class SearchPage extends BasicPage {
  update(params) {
    // Access query params
    const query = params.q || '';
    const page = params.page || 1;

    this.performSearch(query, page);
  }

  render() {
    return Div([
      SearchBar(),
      SearchResults()
    ]);
  }
}

// Route: /search?q=term&page=1
```

## Practical Examples

### Dashboard Layout

```javascript
import { SidebarMenuPage } from '@base-framework/ui/pages';
import { Icons } from '@base-framework/ui/icons';

export class DashboardLayout extends SidebarMenuPage {
  declareProps() {
    super.declareProps();

    this.title = 'Dashboard';

    this.links = [
      {
        label: 'Overview',
        href: '/dashboard',
        icon: Icons.home
      },
      {
        label: 'Analytics',
        href: '/dashboard/analytics',
        icon: Icons.chart
      },
      {
        label: 'Users',
        href: '/dashboard/users',
        icon: Icons.users
      },
      {
        label: 'Settings',
        href: '/dashboard/settings',
        icon: Icons.settings
      }
    ];

    this.routes = [
      { path: '/dashboard', component: OverviewPage },
      { path: '/dashboard/analytics', component: AnalyticsPage },
      { path: '/dashboard/users', component: UsersPage },
      { path: '/dashboard/settings', component: SettingsPage }
    ];
  }

  addSidebar() {
    return new SidebarMenu({
      links: this.links,
      title: this.title,
      collapsed: false
    });
  }

  addBody() {
    return Div({ class: 'flex-1 p-8 overflow-auto' }, [
      // Breadcrumbs
      Breadcrumb(),

      // Page content
      this.children
    ]);
  }
}
```

### Authentication Layout

```javascript
import { CenterPage } from '@base-framework/ui/pages';

export class AuthPage extends CenterPage {
  render() {
    return Div({ class: 'w-full max-w-md space-y-8' }, [
      // Logo
      Div({ class: 'flex justify-center' }, [
        Logo({ size: 'lg' })
      ]),

      // Auth form card
      Card([
        CardHeader([
          CardTitle('Welcome Back')
        ]),

        CardContent([
          MainSection({
            route: [
              { path: '/login', component: LoginForm },
              { path: '/signup', component: SignupForm },
              { path: '/forgot-password', component: ForgotPasswordForm }
            ]
          })
        ])
      ])
    ]);
  }
}
```

### Error Pages

```javascript
import { CenterPage } from '@base-framework/ui/pages';

export class NotFoundPage extends CenterPage {
  render() {
    return Div({ class: 'text-center space-y-4' }, [
      H1({ class: 'text-6xl font-bold' }, '404'),
      P({ class: 'text-xl text-muted-foreground' }, 'Page not found'),

      Button({
        variant: 'primary',
        click: () => app.navigate('/')
      }, 'Go Home')
    ]);
  }
}

export class ErrorPage extends CenterPage {
  declareProps() {
    super.declareProps();
    this.error = null;
  }

  render() {
    return Div({ class: 'text-center space-y-4 max-w-md' }, [
      Icon({ size: '3xl', class: 'text-destructive mx-auto' }, Icons.alert),

      H1({ class: 'text-2xl font-bold' }, 'Something went wrong'),

      P({ class: 'text-muted-foreground' }, this.error?.message || 'An unexpected error occurred'),

      Div({ class: 'flex gap-2 justify-center' }, [
        Button({
          variant: 'outline',
          click: () => location.reload()
        }, 'Retry'),

        Button({
          variant: 'primary',
          click: () => app.navigate('/')
        }, 'Go Home')
      ])
    ]);
  }
}
```

### Marketing Landing Page

```javascript
import { FullContainPage } from '@base-framework/ui/pages';

export class LandingPage extends FullContainPage {
  render() {
    return Div([
      // Header
      Div({ class: 'container mx-auto px-4 py-6' }, [
        Navigation({
          brand: 'Product Name',
          links: [
            { label: 'Features', href: '#features' },
            { label: 'Pricing', href: '#pricing' },
            { label: 'About', href: '#about' }
          ],
          actions: [
            Button({ variant: 'outline' }, 'Sign In'),
            Button({ variant: 'primary' }, 'Get Started')
          ]
        })
      ]),

      // Hero
      Div({ class: 'container mx-auto px-4 py-20 text-center' }, [
        H1({ class: 'text-5xl font-bold mb-4' }, 'Build Amazing Products'),
        P({ class: 'text-xl text-muted-foreground mb-8' }, 'The best platform for your business'),

        Button({
          variant: 'primary',
          size: 'lg'
        }, 'Start Free Trial')
      ]),

      // Features section
      Div({ id: 'features', class: 'container mx-auto px-4 py-20' }, [
        FeaturesGrid()
      ]),

      // Pricing section
      Div({ id: 'pricing', class: 'container mx-auto px-4 py-20' }, [
        PricingCards()
      ]),

      // Footer
      Footer()
    ]);
  }
}
```

## Page Lifecycle

### Lifecycle Methods

```javascript
class MyPage extends BasicPage {
  /**
   * Called before component is mounted
   */
  before() {
    // Initialize data, check permissions
    if (!isAuthenticated()) {
      app.navigate('/login');
      return false;  // Prevent mounting
    }
  }

  /**
   * Called after component is mounted
   */
  after() {
    // Start loading data, set up listeners
    this.loadData();
  }

  /**
   * Called when route is activated
   */
  update(params) {
    // Handle route changes
    this.updateContent(params);
  }

  /**
   * Called before component is unmounted
   */
  destroy() {
    // Clean up listeners, cancel requests
    this.cleanup();
  }
}
```

## Best Practices

### 1. Use Appropriate Layout

```javascript
// ✅ CORRECT - Login with CenterPage
export class LoginPage extends CenterPage {
  render() {
    return LoginForm();
  }
}

// ✅ CORRECT - Dashboard with SidebarMenuPage
export class DashboardPage extends SidebarMenuPage {
  // ...
}
```

### 2. Handle Route Parameters

```javascript
// ✅ CORRECT - Update data on route change
update(params) {
  if (params.id !== this.currentId) {
    this.currentId = params.id;
    this.loadData(params.id);
  }
}
```

### 3. Clean Up Resources

```javascript
// ✅ CORRECT - Clean up in destroy
destroy() {
  if (this.subscription) {
    this.subscription.unsubscribe();
  }

  if (this.intervalId) {
    clearInterval(this.intervalId);
  }
}
```

### 4. Use MainSection for Routing

```javascript
// ✅ CORRECT - Use MainSection for nested routes
MainSection({
  route: [
    { path: '/users', component: UsersPage },
    { path: '/users/:id', component: UserDetailPage }
  ]
})
```

## Next Steps

- [Component Authoring](./07-Component-Authoring.md) - Build custom components
- [Utils Documentation](./08-Utils.md) - Utility functions
- [Routing Guide](./09-Routing.md) - Advanced routing patterns
