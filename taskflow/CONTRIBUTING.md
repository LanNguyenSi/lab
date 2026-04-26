# Contributing

## Development Setup

```bash
make init
make dev
```

For Docker-based development:

```bash
make docker-up
```

## Before Opening a Pull Request

Run the full local quality gate:

```bash
make lint
make typecheck
make test
make build
```

## Contribution Guidelines

- Keep changes focused and avoid mixing refactors with unrelated fixes.
- Prefer small, reviewable commits with clear messages.
- Update documentation when behavior, setup, or developer workflow changes.
- Add or adjust tests when fixing bugs or changing task, project, tag, auth, or API behavior.
- Do not commit secrets, local databases, or generated local environment files.

## Pull Request Notes

- Describe the user-visible change and the technical reason for it.
- List any affected routes, APIs, or data model changes.
- Mention manual verification steps if UI behavior changed.
