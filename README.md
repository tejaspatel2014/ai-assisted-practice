This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server (pnpm):

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Tailwind CSS

Tailwind v4 is preconfigured. Global styles are in `app/globals.css` and PostCSS is configured in `postcss.config.mjs`.

## Testing

Run unit tests with Jest (pnpm):

```bash
pnpm test
```

Testing setup uses `jest-environment-jsdom`, `@testing-library/react`, and `@testing-library/jest-dom`. Add tests under `__tests__/`.

## MCP (Coding Agents)

Enable the Next.js MCP server for agent integrations by adding `.mcp.json` at the project root (already added):

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

Start your dev server and your MCP-compatible agent will auto-connect:

```bash
pnpm dev
```

Tools exposed include `get_errors`, `get_logs`, `get_page_metadata`, `get_project_metadata`, and `get_server_action_by_id`. See https://nextjs.org/docs/app/guides/mcp for details.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
