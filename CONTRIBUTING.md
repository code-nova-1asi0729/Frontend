# Contributing to Vigilia Frontend

Thanks for helping with Vigilia. These are the few rules we follow so the code stays easy to read and review.

## Branches

We use GitFlow:

- `main` only has released versions. Nobody commits to it directly.
- `develop` is where finished work comes together.
- `feature/<name>` is for new work. Create it from `develop`.
- `release/x.y.z` prepares a new version. It is merged into `main` and back into `develop`.

## Commits

We write commits in English with [Conventional Commits](https://www.conventionalcommits.org/):

```text
feat(incidents): use incident business command endpoints
fix(shared): improve spacing and icons of home role cards
```

Common types are `feat`, `fix`, `refactor`, `docs`, `build` and `chore`. The scope is the bounded context (`asset-monitoring`, `incidents`) or `shared`.

## Pull requests

- Open your pull request against `develop`, never against `main`.
- Keep it small and say what changed and how you tested it.
- Run `ng build` before asking for a merge.

## Code style

- One folder per bounded context, with `domain`, `application`, `infrastructure` and `presentation`.
- Business rules go in the entities. The store calls the API and keeps the state with signals.
- Views only show data and call the store.
- Every text on screen goes in `public/i18n/en.json` and `public/i18n/es.json`.
- Use Angular Material components. To change their look, use the Material overrides in `src/material-theme.scss`.

## Versions

We follow [Semantic Versioning](https://semver.org/) and write every release in [CHANGELOG.md](CHANGELOG.md).
