# @platonic-dice/ui

Interactive React showcase application for the `@platonic-dice` packages.

## Features

- 🎲 Interactive dice rolling demonstrations
- 📊 Visual representation of roll results and probabilities
- 📜 Roll history tracking
- 🎨 Modern, responsive UI
- ⚡ Fast hot module reloading with Vite

## Development

```bash
# Install dependencies (from monorepo root)
pnpm install

# Start development server with hot reloading
pnpm --filter @platonic-dice/ui run dev

# Build for production
pnpm --filter @platonic-dice/ui run build

# Preview production build
pnpm --filter @platonic-dice/ui run preview
```

The development server will start at `http://localhost:3000` with automatic browser opening.

## Project Structure

```
src/
├── components/     # React components
├── hooks/          # Custom React hooks
├── styles/         # CSS and styling
├── utils/          # Utility functions
├── App.tsx         # Main application component
└── main.tsx        # Application entry point
```

## Tech Stack

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool with HMR
- **@platonic-dice/core** - Core dice rolling logic
- **@platonic-dice/dice** - Persistent dice with history

## Adding New Features

1. Create components in `src/components/`
2. Add custom hooks in `src/hooks/`
3. Use path aliases for clean imports:
   - `@/` → `src/`
   - `@components/` → `src/components/`
   - `@hooks/` → `src/hooks/`
   - `@styles/` → `src/styles/`
   - `@utils/` → `src/utils/`

## Note

This package is marked as `private` and will not be published to npm.
