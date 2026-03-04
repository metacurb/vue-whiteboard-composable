# Contributing to vue-whiteboard-composable

Thanks for contributing. This repository contains both the published Vue 3 composable and the local demo app used to exercise it.

## Development Setup

This project uses `pnpm` and targets Node.js `24` in CI. The package metadata allows modern Node `20.19+`, but using Node `24` locally keeps your environment aligned with GitHub Actions.

```bash
git clone https://github.com/metacurb/vue-whiteboard-composable.git
cd vue-whiteboard-composable
pnpm install
```

Start the demo app locally with:

```bash
pnpm dev
```

The Vite dev server runs at `http://localhost:5173`.

## Available Scripts

| Script | Purpose |
| --- | --- |
| `pnpm dev` | Run the demo app locally with Vite. |
| `pnpm build` | Type-check the project and build the distributable library. |
| `pnpm build:demo` | Build the demo site used for GitHub Pages deployment. |
| `pnpm preview` | Preview the current Vite build output locally. |
| `pnpm test` | Run the Vitest test suite. |
| `pnpm test:coverage` | Run tests with coverage output. |
| `pnpm lint` | Run oxlint and ESLint with autofix enabled. |
| `pnpm format` | Format files under `src/` with Prettier. |

## Project Layout

- `src/composables/useWhiteboard.ts`: main composable implementation.
- `src/types/whiteboard.ts`: public types and whiteboard data structures.
- `src/utils/whiteboard.ts`: serialization and SVG utility helpers.
- `src/utils/whiteboard.test.ts`: current Vitest coverage for whiteboard utilities.
- `src/index.ts`: library entry point exported in the published package.
- `src/App.vue` and `src/components/*`: local demo app for manual verification.
- `vite.config.ts`: library build configuration and type generation.
- `vite.config.demo.ts`: separate build for the demo deployment.

## Contribution Expectations

Before opening a pull request:

1. Run `pnpm lint`.
2. Run `pnpm test`.
3. Run `pnpm build` if you changed exported code, types, or build configuration.
4. Update `README.md` when the public API or usage changes.

When changing the composable:

- Preserve the package entry points exposed from `src/index.ts`.
- Keep Vue as a peer dependency and avoid introducing runtime dependencies unless they are necessary for the library.
- Add or update tests when changing serialization, history behavior, export behavior, or public types.
- Verify the demo still works when changing whiteboard interactions or UI-facing behavior.

## Release Workflow

This repository uses `release-please` to keep versioning and changelog updates simple.

- CI runs on pushes and pull requests targeting `main`.
- Merges to `main` trigger `.github/workflows/release-please.yml`, which opens or updates a release PR.
- Merging the release PR updates `package.json` and `CHANGELOG.md` and creates a draft GitHub release.
- Publishing that draft GitHub release triggers `.github/workflows/release.yml`, which publishes the package to npm and deploys the demo site from the released tag.
- Commit messages and PR titles should follow Conventional Commits so release automation can classify changes correctly.

## Pull Requests

Please keep pull requests focused and include:

- a short summary of the change,
- any API or behavior changes,
- test coverage added or updated,
- screenshots or short notes when the demo UI changes.
