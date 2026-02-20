# GitHub Pages Deployment

The UI showcase application is automatically deployed to GitHub Pages when changes are pushed to the `main` branch.

## Live Demo

🔗 **URL**: https://sjs2k20.github.io/platonic-dice/

## How It Works

### Automatic Deployment

The deployment is handled by `.github/workflows/deploy-pages.yml`:

1. **Triggers** on:
   - Push to `main` branch affecting UI, core, or dice packages
   - Manual workflow dispatch (via GitHub Actions UI)

2. **Build Process**:
   - Install all workspace dependencies
   - Build `@platonic-dice/core` (generates CommonJS modules)
   - Build `@platonic-dice/dice` (generates ES modules + type definitions)
   - Build `@platonic-dice/ui` (Vite production build with CommonJS handling)

3. **Deployment**:
   - Uploads built static files from `packages/ui/dist/`
   - Deploys to GitHub Pages environment
   - Available at `https://sjs2k20.github.io/platonic-dice/`

### Configuration

**Vite Config** (`packages/ui/vite.config.ts`):

```typescript
export default defineConfig({
  base: "/platonic-dice/", // GitHub Pages subdirectory path
  // ... other config
});
```

The `base` setting ensures all assets (JS, CSS, images) use correct paths when deployed to a subdirectory.

### Version Badge

The UI displays a version badge (v0.2.2 - PREVIEW) to indicate it's not a finished version.

## Manual Deployment

To trigger a deployment manually:

1. Go to: https://github.com/sjs2k20/platonic-dice/actions
2. Select "Deploy UI to GitHub Pages" workflow
3. Click "Run workflow" → "Run workflow"

## Local Preview of Production Build

To test the production build locally:

```bash
# Build the production version
pnpm --filter @platonic-dice/ui run build

# Preview it locally
pnpm --filter @platonic-dice/ui run preview
```

This runs at http://localhost:4173 (different from dev server port 3000).

## Repository Settings Required

For first-time setup, enable GitHub Pages in repository settings:

1. Go to: https://github.com/sjs2k20/platonic-dice/settings/pages
2. Under "Source": Select "GitHub Actions"
3. Save

The workflow will then automatically deploy on subsequent pushes to main.

## Troubleshooting

**404 Errors on deployed site?**

- Check `base: "/platonic-dice/"` matches your repository name
- Ensure `.nojekyll` file exists in dist (workflow adds this automatically)

**Build failures?**

- Check GitHub Actions logs: https://github.com/sjs2k20/platonic-dice/actions
- Verify all workspace dependencies are properly installed
- Ensure core and dice packages build successfully before UI

**Assets not loading?**

- Verify all imports use relative paths or Vite's special `import.meta.url`
- Check browser console for 404s and note the incorrect paths
