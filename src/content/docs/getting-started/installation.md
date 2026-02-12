---
title: Installation
description: How to install and use components from PB UI Registry in your project.
---

# Installation

Learn how to add components from PB UI Registry to your project.

## Prerequisites

Before installing components, make sure you have:

- Node.js 18+ installed
- A React project set up (Next.js, Vite, Astro, etc.)
- shadcn/ui initialized in your project

## Initialize shadcn/ui

If you haven't already initialized shadcn/ui in your project, run:

```bash
npx shadcn@latest init
```

Follow the prompts to configure shadcn/ui for your project. Make sure to select:
- **Base UI** as your component library
- **Tailwind CSS v4** for styling

## Installing Components

### Method 1: Direct URL Installation

Install components directly from the registry using their URL:

```bash
npx shadcn@latest add https://pranta-barua007.github.io/pb-ui-registry/r/component-name.json
```

Replace `component-name` with the actual component you want to install.

### Method 2: Configure Registry Namespace

For easier installation, configure the registry in your `components.json`:

```json
{
  "registries": {
    "pb": "https://pranta-barua007.github.io/pb-ui-registry/r"
  }
}
```

Then install components using the namespace:

```bash
npx shadcn@latest add @pb/component-name
```

## Usage

After installation, import and use components in your project:

```tsx
import { ComponentName } from "@/components/ui/component-name"

export default function Example() {
  return <ComponentName />
}
```

## Updating Components

Since components are copied to your project, updates are manual. To update a component:

1. Check the registry for the latest version
2. Re-install the component (it will overwrite the existing file)
3. Review changes and test your application

## Customization

All components are yours to customize:

- Modify styles in the component files
- Adjust behavior and props
- Extend functionality
- Change dependencies

The components use Tailwind CSS v4 with OKLCH colors and the `cn()` utility for className merging.

## Troubleshooting

### Component not found

Make sure the component name is correct and the registry URL is accessible.

### TypeScript errors

Ensure you have the correct TypeScript path aliases configured in `tsconfig.json`:

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

### Styling issues

Verify that:
- Tailwind CSS v4 is properly configured
- `global.css` includes `@import "tailwindcss"`
- CSS variables are defined in the `@theme` directive

## Next Steps

- Browse [available components](/components)
- Learn about [customization best practices](/guides/customization)
