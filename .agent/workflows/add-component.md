---
description: How to add a new component to the UI Registry
---

Follow these steps to add a new component to the registry. This ensures the component is correctly registered, documented, and available for users.

### 1. Create the Component Folder Structure
Create a new directory for the component in `src/registry/new-york/items/[component-name]`.
The structure should follow this pattern:

```
src/registry/new-york/items/[component-name]/
├── components/
│   └── [component-name].tsx    # The core component implementation
└── demo.tsx                    # A usage example for the documentation
```

### 2. Implement the Component
- **Core Component**: Place the implementation in the `components/` subfolder.
- **Demo**: The `demo.tsx` should provide a clear, standalone example of how to use the component. It should import other required UI components from `@/components/ui`.

### 3. Register the Component
Run the registry build script to update the manifest:
// turbo
```bash
pnpm build:registry
```
This script scans the `items` directory and updates `registry.json` and the `public/r/` files. Ensure `NODE_ENV=production` is unset if you want to test with localhost URLs, or keep the default Husky behavior for production.

### 4. Create Documentation
Create an MDX file in `src/content/docs/components/[component-name].mdx`. Use the following template:

```mdx
---
title: [Component Label]
description: [Short description of the component]
---

import CodePreview from "@/components/markdown/code-preview/code-preview.astro"
import InstallationTabs from "@/components/markdown/installation-tabs/installation-tabs.astro"

<CodePreview demo="[component-name]/demo" />

## Installation

<InstallationTabs registryItem="[component-name]" />

## Usage

```tsx
import { [ComponentClassName] } from "@/components/ui/[component-name]"
\```

```tsx
<[ComponentClassName]>
  {/* Content */}
</[ComponentClassName]>
\```
```

### 5. Verify and Commit (Optional: Validate the expected component is created first)
1. Check the documentation locally: `pnpm dev`.
2. Verify the registry item is generated in `public/r/[component-name].json`.
3. Commit your changes: `git add . && git commit -m 'feat: add [component-name] component'`.
   - *Note: The Husky pre-commit hook will automatically run linting and rebuild the registry in production mode.*

---

## 💡 Common Pitfalls & Pro-Tips

### 🛡️ ESM & Node.js Compatibility
When importing from `environment.js` in scripts (like `build-registry.js`) or Astro configs:
- **Rule**: Always include the `.js` extension (e.g., `import { ... } from './environment.js'`).
- **Rule**: Use relative paths from the root instead of aliases if the script runs outside the Vite context.

### ⚛️ Avoid Rendering Anti-Patterns
To prevent "Components created during render" lint errors:
- **Pitfall**: Never declare a `lazy()` component or a dynamic component inside the body of another React component.
- **Solution**: Declare them at the top level or use a **Component Cache** (as seen in `_code-preview-internal.tsx`) to ensure stable references across renders.

### 📝 Registry Import Cleanup
The `CodePreview` component and `build-registry.js` handle some import path mapping.
- **Pro-Tip**: When writing demos, you can use `@/registry/new-york/items/...` paths. The registry build script and preview component are configured to "cleanup" these paths for the user during installation (e.g., mapping them to `@/components/ui/...`).

### 🛠️ Environment-Aware Building
- **Pitfall**: Committed registry files containing `localhost` URLs.
- **Solution**: The Husky hook sets `NODE_ENV=production` automatically. Never bypass this during a commit unless you are debugging locally. This ensures `registry.json` always points to the production GitHub Pages URL.

### 🧹 Clean Linting
The pre-commit hook is strict. To avoid failures:
- Define types for dynamic imports (avoid `any` where possible).
- Use `useMemo` for heavy calculations in React.
- Ensure all assigned variables are used (or remove them).
- For scripts, ensure `eslint.config.mjs` has `globals: { ...globals.node }` configured for that directory.