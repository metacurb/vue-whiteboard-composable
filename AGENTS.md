# AGENTS.md

## Project Context

- This repository publishes `vue-whiteboard-composable`, a Vue 3 composable for SVG whiteboard drawing.
- The repo also contains a Vite-powered demo app used for local verification and GitHub Pages deployment.
- Package manager: `pnpm`
- Preferred local runtime: Node.js `24` to match CI

## Repository Map

- `src/composables/useWhiteboard.ts`: primary composable implementation
- `src/types/whiteboard.ts`: exported whiteboard types
- `src/utils/whiteboard.ts`: helper logic for SVG/history serialization
- `src/utils/whiteboard.test.ts`: Vitest coverage for utility behavior
- `src/index.ts`: public package entry point
- `src/App.vue`, `src/components/*`: demo app and manual test surface
- `vite.config.ts`: library build config
- `vite.config.demo.ts`: demo build config
- `.github/workflows/*.yml`: CI and release automation
- `release-please-config.json` and `.release-please-manifest.json`: release-please versioning and changelog config

## Working Rules For Agents

- Keep changes aligned with a published library first and the demo app second.
- Do not break the public exports from `src/index.ts` without explicit instruction.
- Treat `README.md` as part of the public contract. If usage or API changes, update it.
- Prefer adding or updating tests when changing history, serialization, export, or type behavior.
- Validate demo-facing changes in `src/App.vue` and `src/components/*` when modifying interactions.
- Do not commit built output in `dist/` unless the user explicitly asks for it.
- Prefer `pnpm` commands over `npm` or `yarn`.

## Validation

Use the smallest relevant set of checks for the change:

- `pnpm lint` for linting and autofixes
- `pnpm test` for Vitest
- `pnpm build` for exported library or build config changes
- `pnpm build:demo` when changing demo-only build behavior

## Release Flow

- `release-please` owns version bumps and changelog updates.
- `.github/workflows/release-please.yml` runs on pushes to `main` and maintains the release PR.
- Merging the release PR creates the tag and a draft GitHub release.
- Publishing the GitHub release triggers `.github/workflows/release.yml`.
- `.github/workflows/release.yml` publishes the package to npm from the released tag and deploys the demo to GitHub Pages.

## Commit And PR Conventions

- Use Conventional Commits for all commit messages and PR titles.
- Prefer squash merge commit titles that also follow Conventional Commits, because release automation and changelog quality depend on clear commit history.
- Use one of these types when the change should appear in release notes:
  - `feat`: new user-facing functionality
  - `fix`: bug fixes
  - `perf`: performance improvements
  - `refactor`: internal changes that should appear under `Changed`
  - `deps`: dependency updates that should appear under `Changed`
- Use `chore`, `docs`, `test`, and `ci` for changes that should not trigger a release by themselves.

## Format

- Use `type: short summary`
- Optional scope is allowed: `type(scope): short summary`
- Breaking changes must use `!` or a `BREAKING CHANGE:` footer

## Examples

- `feat: add pressure-sensitive stroke sizing`
- `fix: preserve redo history after importing saved state`
- `perf: reduce redraw work during pointer move`
- `refactor: simplify whiteboard serialization helpers`
- `deps: update vite to latest compatible version`
- `docs: clarify demo and library build commands`

## Release Notes Mapping

- `feat` -> `Added`
- `fix` -> `Fixed`
- `perf`, `refactor`, `deps` -> `Changed`

## Notes For Agents

- Do not use emoji prefixes in commit messages or PR titles.
- Do not invent non-standard types when a standard type fits.
- If a change is not releasable, prefer `chore`, `docs`, `test`, or `ci`.
