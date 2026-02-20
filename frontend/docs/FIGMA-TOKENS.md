# Figma design tokens

Tokens are generated from the [Financy Community Styleguide](https://www.figma.com/design/neN9iRrmqDs4JIktNdezAe/Financy--Community-?node-id=3-377) via the Figma REST API.

## Regenerating tokens

From the `frontend` directory:

```bash
npm run figma:tokens
```

Requires a Figma personal access token in the repo root `.env` as `token` or `FIGMA_ACCESS_TOKEN`.

Output: `src/styles/figma-tokens.json` (colors and typography extracted from the styleguide node).

## Theme mapping

- **Shadcn CSS variables** in `src/index.css` (`:root`) define the app theme. To align with Figma, override `--primary`, `--background`, etc. with values from `figma-tokens.json` (convert hex to HSL if needed).
- **Tailwind** theme in `tailwind.config.js` uses those CSS variables; no change needed unless you add new token keys.
- Manual overrides: document any custom mappings here (e.g. "Primary button → `--primary`", "Body text → `text-base`").
