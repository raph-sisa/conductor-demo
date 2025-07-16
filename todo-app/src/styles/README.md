# Styling System Documentation

## Overview

This todo application uses **Tailwind CSS** as the primary styling framework, configured with a custom design system that provides consistent theming, responsive design, and component-based styling.

## Design System

### Color Palette

The application uses a comprehensive color system with semantic color names:

#### Primary Colors (Blue)
- `primary-50` to `primary-900` - Main brand colors
- Usage: Buttons, links, active states, progress indicators

#### Secondary Colors (Gray)
- `secondary-50` to `secondary-900` - Text, backgrounds, borders
- Usage: Text colors, neutral backgrounds, subtle borders

#### Semantic Colors
- **Success** (`success-50` to `success-900`) - Green tones for positive actions
- **Warning** (`warning-50` to `warning-900`) - Yellow/orange tones for warnings
- **Error** (`error-50` to `error-900`) - Red tones for errors and destructive actions

### Typography

#### Font Family
- **Primary**: Inter (Google Fonts)
- **Fallback**: system-ui, sans-serif

#### Heading Hierarchy
- `h1`: 4xl (mobile) → 5xl (tablet) → 6xl (desktop)
- `h2`: 3xl (mobile) → 4xl (tablet) → 5xl (desktop)
- `h3`: 2xl (mobile) → 3xl (tablet) → 4xl (desktop)
- `h4`: xl (mobile) → 2xl (tablet) → 3xl (desktop)
- `h5`: lg (mobile) → xl (tablet) → 2xl (desktop)
- `h6`: base (mobile) → lg (tablet) → xl (desktop)

### Spacing System

Custom spacing values extend Tailwind's default spacing:
- `spacing-18`: 4.5rem
- `spacing-88`: 22rem
- `spacing-128`: 32rem

### Shadows

Custom shadow system for depth and elevation:
- `shadow-soft`: Subtle shadow for cards and panels
- `shadow-medium`: Medium shadow for interactive elements
- `shadow-hard`: Strong shadow for modals and overlays

### Border Radius

Extended border radius values:
- `rounded-xl`: 1rem
- `rounded-2xl`: 1.5rem

## Component Classes

### Buttons

#### Base Button
```css
.btn
```
Base button class with focus states and transitions.

#### Button Variants
- `.btn-primary` - Primary action buttons
- `.btn-secondary` - Secondary action buttons
- `.btn-success` - Success/confirmation buttons
- `.btn-warning` - Warning buttons
- `.btn-error` - Error/destructive buttons
- `.btn-outline` - Outline style buttons
- `.btn-outline-primary` - Primary outline buttons
- `.btn-ghost` - Ghost/minimal buttons

#### Button Sizes
- `.btn-sm` - Small buttons
- `.btn-lg` - Large buttons

### Forms

#### Form Controls
- `.form-input` - Text inputs
- `.form-textarea` - Textareas
- `.form-select` - Select dropdowns
- `.form-checkbox` - Checkboxes
- `.form-radio` - Radio buttons

### Cards

#### Card Structure
- `.card` - Base card container
- `.card-header` - Card header section
- `.card-body` - Card main content
- `.card-footer` - Card footer section

### Navigation

#### Navigation Components
- `.nav` - Navigation container
- `.nav-link` - Navigation links
- `.nav-link.active` - Active navigation state

### Alerts

#### Alert Types
- `.alert-success` - Success messages
- `.alert-warning` - Warning messages
- `.alert-error` - Error messages
- `.alert-info` - Informational messages

### Badges

#### Badge Variants
- `.badge-primary` - Primary badges
- `.badge-secondary` - Secondary badges
- `.badge-success` - Success badges
- `.badge-warning` - Warning badges
- `.badge-error` - Error badges

### Loading States

#### Loading Components
- `.loading` - Pulse animation
- `.skeleton` - Skeleton loading placeholder
- `.spinner` - Spinning loader

### Task-Specific Components

#### Task Components
- `.task-card` - Individual task cards
- `.task-card.completed` - Completed task styling
- `.task-title` - Task title styling
- `.task-description` - Task description styling
- `.task-meta` - Task metadata styling

#### Project Components
- `.project-card` - Project cards
- `.project-title` - Project title styling
- `.project-description` - Project description styling
- `.project-stats` - Project statistics styling

### Layout Components

#### Container Classes
- `.container` - Max-width 7xl container
- `.container-sm` - Max-width 2xl container
- `.container-md` - Max-width 4xl container

#### Layout Structure
- `.main-header` - Main application header
- `.main-nav` - Main navigation
- `.main-content` - Main content area
- `.sidebar` - Sidebar navigation
- `.sidebar-nav` - Sidebar navigation container
- `.sidebar-nav-item` - Sidebar navigation items

## Responsive Design

### Breakpoints

Tailwind's default breakpoints are used:
- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px
- `2xl`: 1536px

### Responsive Typography

All headings automatically scale across breakpoints using responsive classes:
```css
h1 { @apply text-4xl md:text-5xl lg:text-6xl; }
```

### Layout Responsiveness

The main layout uses CSS Grid with responsive columns:
```css
grid-cols-1 lg:grid-cols-4
```

## Custom Utility Classes

### Text Utilities
- `.text-balance` - Balanced text wrapping
- `.text-pretty` - Pretty text wrapping

### Scrollbar Utilities
- `.scrollbar-hide` - Hide scrollbars

### Gradient Utilities
- `.gradient-primary` - Primary gradient
- `.gradient-secondary` - Secondary gradient
- `.gradient-success` - Success gradient

### Glass Effect Utilities
- `.glass` - Light glass effect
- `.glass-dark` - Dark glass effect

## Usage Examples

### Basic Task Card
```jsx
<div className="task-card">
  <div className="card-body">
    <h3 className="task-title">Task Title</h3>
    <p className="task-description">Task description</p>
  </div>
</div>
```

### Form with Validation
```jsx
<form className="space-y-4">
  <input type="text" className="form-input" placeholder="Task title" />
  <textarea className="form-textarea" placeholder="Description"></textarea>
  <button type="submit" className="btn btn-primary">Add Task</button>
</form>
```

### Responsive Layout
```jsx
<div className="container">
  <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
    <aside className="lg:col-span-1">Sidebar</aside>
    <main className="lg:col-span-3">Main Content</main>
  </div>
</div>
```

## Best Practices

1. **Use semantic color names** - Prefer `primary-600` over `blue-600`
2. **Leverage component classes** - Use `.btn-primary` instead of raw Tailwind classes
3. **Follow responsive patterns** - Use consistent responsive breakpoints
4. **Maintain accessibility** - All form controls include proper focus states
5. **Use consistent spacing** - Follow the 4px grid system (space-1, space-2, etc.)

## Customization

To customize the design system, modify the `tailwind.config.js` file:

```javascript
theme: {
  extend: {
    colors: {
      primary: {
        // Your custom primary colors
      }
    }
  }
}
```

## Performance Considerations

- CSS-in-JS is avoided in favor of utility classes
- Tailwind's purging ensures only used styles are included
- Custom components use `@apply` directive for better performance
- Responsive images and layouts prevent layout shifts