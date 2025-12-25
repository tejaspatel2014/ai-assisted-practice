# AI Coding Agents Guide — Next.js Project

This repository is a Next.js 16 App Router project using TypeScript, Tailwind CSS v4, pnpm, and Jest. It is MCP-enabled so agent tools can query the running dev server for errors, routes, and project metadata.

## Stack Overview

- Next.js: `16.1.0` (App Router, `app/`)
- React: `19.x`
- TypeScript: `5.x`
- Tailwind CSS: `v4` with `@import "tailwindcss"` in `app/globals.css`
- Package manager: `pnpm`
- Testing: Jest + Testing Library (jsdom)
- MCP: `next-devtools-mcp` configured via `.mcp.json`

## Quick Start for Agents

1. Start the dev server:
   ```bash
   pnpm dev
   ```
2. MCP config is already present at project root:
   ```json
   {
     "mcpServers": {
       "next-devtools": {
         "command": "npx",
         "args": ["-y", "next-devtools-mcp@latest"]
       }
     }
   }
   ```
3. MCP-compatible coding agents will auto-discover `/_next/mcp` from the running Next.js instance and connect via `next-devtools-mcp`.

## MCP Tools Exposed

When the dev server is running, `next-devtools-mcp` enables:

- `get_errors`: Current build/runtime/type errors from the dev server
- `get_logs`: Path to dev log file (browser console + server output)
- `get_page_metadata`: Route/component/render info for a page
- `get_project_metadata`: Project structure, config, dev server URL
- `get_server_action_by_id`: Resolve Server Action to source file/function name

Reference: https://nextjs.org/docs/app/guides/mcp

## Project Conventions

- App Router structure lives in `app/`.
  - Example home page: `app/page.tsx`
  - Layouts: `app/layout.tsx`
  - Route handlers: `app/<route>/route.ts`
- Import alias: `@/*` maps to project root (see `tsconfig.json`). Always use absolute imports like `import X from '@/path/to/X'`.
- Client vs Server Components:
  - Use `"use client"` at the top for components that need React hooks, browser APIs, or event handlers.
  - Server Components fetch data and run on the server by default.
  - Server Actions should be defined in Server Components or in files imported by them; use `"use server"` for explicit server actions.
  - Only Client Components may use `useState`, `useEffect`, `useRouter`, etc.

## Tailwind CSS (v4)

- Global styles: `app/globals.css` with Tailwind imported.
- Theme variables: CSS variables in `:root` and dark mode via `prefers-color-scheme` are already configured.
- Use utility classes directly in component `className`.

## Testing

- Run tests:
  ```bash
  pnpm test
  ```
- Setup:
  - `jest.config.cjs` (Babel transform for TS/JSX)
  - `jest-environment-jsdom`
  - `@testing-library/react` + `@testing-library/jest-dom`
- Place tests under `__tests__/`, e.g. `__tests__/Hello.test.tsx`.

## Absolute Imports

- Setup:
  - TypeScript: `compilerOptions.baseUrl` is set to `.` and `paths` maps `@/*` to project root in [tsconfig.json](tsconfig.json).
  - Jest: `moduleNameMapper` resolves `^@/(.*)$` to `<rootDir>/$1` in [jest.config.cjs](jest.config.cjs).
- Usage:
  - Use `@/` for all internal imports in TS/TSX and tests.
  - Example: `import Hello from '@/components/Hello'` instead of `../components/Hello`.
  - CSS: you may also import via `@/` (e.g., `import '@/app/globals.css'`) to stay consistent.
- Migration tip:
  - If you add new folders, no config changes are needed—`@/*` already covers the entire repo root.

## Common Agent Tasks (Examples)

- Add a new page:
  - Create `app/example/page.tsx` (Server Component by default)
  - If interactivity is required, add `"use client"` to the component file
- Add a route handler:
  - Create `app/api/items/route.ts` exporting HTTP methods (e.g., `GET`, `POST`)
- Wire a Client Component:
  - Create `components/MyWidget.tsx` with `"use client"`
  - Import into a page: `import MyWidget from '@/components/MyWidget'`
- Use Server Actions safely:
  - Define action with `"use server"`
  - Call from Client Component via form `action` or using `useActionState`

## MCP Troubleshooting

- Ensure Next.js version is `>= 16`
- Verify `.mcp.json` exists at the project root
- Restart the dev server after adding or changing MCP config
- Agents should load the MCP config automatically; if not, ensure they support `.mcp.json`

## Do’s and Don’ts for Agents

- Do:
  - Use App Router conventions in `app/`
  - Respect `@/*` import alias
  - Keep components minimal and typed; prefer `export default` for pages
  - Add tests for new components or critical logic
  - Use Tailwind utilities; avoid inline styles unless necessary
  - Ensure interactive elements use pointer cursors: add `cursor-pointer` (or `enabled:cursor-pointer`) to clickable buttons and links; for disabled states, prefer `disabled:cursor-default` or `disabled:cursor-not-allowed`
  - Use Tailwind theme tokens for colors instead of raw hex values. Define tokens under `@theme inline` in [app/globals.css](app/globals.css) (e.g., `--color-ui-grey-500: #808080;`) and reference them via utility classes like `text-ui-grey-500`, `border-ui-grey-500`, etc. When adding new colors, first create a token, then use the corresponding `text-*`/`bg-*`/`border-*` class.
- Don’t:
  - Modify `next.config.ts` unless required
  - Leak secrets or write credentials to the repo
  - Introduce non-Next.js routing libraries
  - Break server/client boundaries (hooks in Server Components)

## Images: Safe Fallbacks

- Always guard `next/image` `src` values. Remote APIs may return missing or empty image URLs.
- Use a local placeholder when `src` is falsy or blank, e.g. `/avatar-placeholder.svg` in `public/`.
- Example:

```tsx
<Image
  src={user.avatar_url?.trim() || "/avatar-placeholder.svg"}
  alt={user.login}
  width={64}
  height={64}
  className="h-16 w-16 rounded-full"
/>
```

- For remote images, consider configuring `images.remotePatterns` in `next.config.ts` to explicitly allow domains like `avatars.githubusercontent.com`.

## TypeScript: Never Use `any` for Type Declarations

- **Never use `any` for type declarations or type assertions.** Always use precise types, or `unknown` if the type is not known, and then narrow via checks or schemas.
- For untyped inputs, use `unknown` and validate or narrow before use.
- Define small, focused interfaces for API responses and errors.
- When parsing JSON, parse to `unknown` and cast only after validation/narrowing.
- If a library forces `any`, isolate it and convert using runtime validation (e.g., Zod).

**Do not use `as any` in tests or production code.** For mocks, use the correct return type (e.g., `Window | null` for `window.open`).

Example: replace `any` when parsing an error body.

```ts
type GitHubErrorResponse = {
  message?: string;
  documentation_url?: string;
  error?: string;
  errors?: Array<{
    resource?: string;
    field?: string;
    code?: string;
    message?: string;
  }>;
};

const text = await res.text();
let body: unknown;
try {
  body = JSON.parse(text);
} catch {
  body = undefined;
}

const err = body as GitHubErrorResponse | undefined;
const message = err?.error || err?.message || "Request failed";
```

## Helpful Commands

- Dev server:
  ```bash
  pnpm dev
  ```
- Lint:
  ```bash
  pnpm run lint
  ```
- Test:
  ```bash
  pnpm test
  ```

## Contact & References

- Next.js MCP docs: https://nextjs.org/docs/app/guides/mcp
- Next.js docs: https://nextjs.org/docs
- MCP spec: https://modelcontextprotocol.io/

## Forms: React Hook Form + Zod

Use `react-hook-form` for lightweight form state and `zod` for schema validation. Client Components must include "use client".

### Install

```bash
pnpm add react-hook-form zod @hookform/resolvers
```

### Quick Start (Client Component)

Create a client form with Zod validation and error messages.

```tsx
"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const schema = z.object({
  name: z.string().min(2, "Name is too short"),
  email: z.string().email("Invalid email"),
});

type FormData = z.infer<typeof schema>;

export default function SimpleForm({
  onSubmit,
}: {
  onSubmit?: (data: FormData) => void;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: "onSubmit",
  });

  return (
    <form
      onSubmit={handleSubmit((data) => onSubmit?.(data))}
      className="space-y-4 max-w-md">
      <div>
        <label className="block text-sm font-medium">Name</label>
        <input
          {...register("name")}
          className="mt-1 w-full rounded border p-2"
          placeholder="Ada Lovelace"
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
        )}
      </div>
      <div>
        <label className="block text-sm font-medium">Email</label>
        <input
          {...register("email")}
          className="mt-1 w-full rounded border p-2"
          placeholder="ada@example.com"
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
        )}
      </div>
      <button
        type="submit"
        disabled={isSubmitting}
        className="rounded bg-foreground px-4 py-2 text-background hover:bg-[#383838] dark:hover:bg-[#ccc]">
        {isSubmitting ? "Submitting…" : "Submit"}
      </button>
    </form>
  );
}
```

### Server Actions Integration

- Define an action with "use server" in a Server Component or imported file.
- Pass the action to a client form via `form` `action` attribute or call from `handleSubmit`.
- Validate on both client (Zod) and server (re-validate input) before persisting.

Example server action:

```ts
"use server";
import { z } from "zod";

const schema = z.object({ name: z.string().min(2), email: z.string().email() });

export async function saveUser(formData: { name: string; email: string }) {
  const parsed = schema.safeParse(formData);
  if (!parsed.success) {
    throw new Error("Invalid input");
  }
  // Persist data (DB/API) here.
}
```

### Tips

- Client vs Server: Only Client Components may use `useForm`.
- Accessibility: Use `<label>` and `aria-invalid` when appropriate.
- Styling: Prefer Tailwind utilities; avoid inline styles.
- Testing: Use Testing Library to simulate input/submit and assert error messages.
