# AGENTS.md

Instructions for AI coding agents working in this repository.

## Project overview

**Loophacka** is a React single-page application built with Vite and TypeScript. It is a client-side frontend with no backend in this repo.

## Setup

```bash
npm install
```

Requires Node.js and npm. No environment variables or external services are needed for local development.

## Commands

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start dev server at http://localhost:5173 |
| `npm run build` | Typecheck (`tsc -b`) and production build to `dist/` |
| `npm run lint` | Run Oxlint |
| `npm run preview` | Serve the production build locally |

After non-trivial changes, run `npm run build` to verify the project compiles.

## Project structure

```
src/
  main.tsx          # Entry point — mounts App in StrictMode
  App.tsx           # Root component
  index.css         # Global styles
  assets/           # Static imports (images, SVGs)
  components/       # Shared UI components (create as needed)
  hooks/            # Custom React hooks (create as needed)
public/             # Static files served as-is (e.g. /icons.svg)
vite.config.ts      # Vite configuration
.oxlintrc.json      # Linter config
```

## Code style

### React

- Functional components and hooks only — no class components
- Colocate styles in sibling `.css` files (e.g. `App.css`); no CSS-in-JS unless requested
- Use `type="button"` on non-submit buttons
- Extract reusable logic into custom hooks under `src/hooks/`
- Place shared UI under `src/components/`

### TypeScript

- Strict mode is enabled — do not weaken types
- Avoid `any`; type component props with `interface`, unions with `type`
- Non-null assertions (`!`) only when the value is guaranteed

### Formatting

Match existing files:

- Single quotes
- No semicolons at end of import statements
- Default export for page-level components; named exports for utilities and hooks

## Dependencies

Do not add npm packages unless the task requires it or the user asks. This is intentionally minimal: React, React DOM, Vite, TypeScript, Oxlint.

## Git

- Do not commit unless explicitly asked
- Do not push to remote unless explicitly asked
- Do not amend commits that have been pushed

## Scope

- Make the smallest correct change for the task
- Do not refactor unrelated code
- Do not add tests, docs, or comments unless requested or clearly necessary
- Do not create markdown files unless requested
