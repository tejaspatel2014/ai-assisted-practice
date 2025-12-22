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
- Import alias: `@/*` maps to project root (see `tsconfig.json`). Prefer `import X from '@/path/to/X'`.
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
- Don’t:
  - Modify `next.config.ts` unless required
  - Leak secrets or write credentials to the repo
  - Introduce non-Next.js routing libraries
  - Break server/client boundaries (hooks in Server Components)

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
