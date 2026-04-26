# TaskFlow

TaskFlow is a multilingual task management app built with Next.js, Prisma, SQLite, and NextAuth. The repository is optimized for local development with `make init` and can also be started in a containerized setup with Docker.

## Features

- Task, project, and tag management in a single workflow
- Built-in time tracking directly on tasks
- Dashboard and statistics views for quick status checks
- Multilingual UI support
- Local-first setup with optional Docker workflow

## Stack

- Next.js 16 with the App Router
- React 19 and TypeScript
- Tailwind CSS 4 and shadcn/ui
- Prisma ORM with SQLite
- NextAuth credentials authentication
- Jest and Testing Library

## Quick Start

### Local development

```bash
make init
make dev
```

The app will be available at `http://localhost:3000`.

`make init` will:

- create `.env` from `.env.example` if it does not exist yet
- install dependencies
- generate the Prisma client
- apply Prisma migrations to the local SQLite database

### Docker

```bash
make docker-up
```

The container starts the app on port `3000` and runs `prisma migrate deploy` automatically on startup. SQLite data is stored in a Docker volume mounted at `/app/data`.

If port `3000` is already in use:

```bash
APP_PORT=3001 make docker-up
```

## Repository Standards

- `main` workflows are validated in GitHub Actions
- `.env.example` is committed as the canonical local setup template
- local secrets remain ignored via `.gitignore`
- contributions are expected to pass lint, typecheck, tests, and production build

## Environment Variables

Example configuration:

```env
DATABASE_URL="file:../data/taskflow.db"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="change-me-to-a-long-random-string"
```

## Make Targets

- `make init` installs the project and initializes the database
- `make dev` starts the Next.js development server
- `make build` builds the application
- `make start` starts the production server
- `make lint` runs ESLint
- `make test` runs Jest in CI mode
- `make typecheck` runs `tsc --noEmit`
- `make db-generate` generates the Prisma client
- `make db-migrate` applies Prisma migrations
- `make docker-build` builds the Docker image
- `make docker-up` starts the app with Docker Compose
- `make docker-down` stops Docker Compose services
- `make docker-logs` tails Docker Compose logs

## NPM Scripts

- `npm run dev`
- `npm run build`
- `npm run start`
- `npm run lint`
- `npm run typecheck`
- `npm run test`
- `npm run db:generate`
- `npm run db:migrate`
- `npm run db:studio`

## Project Structure

```text
src/
  app/          Next.js routes and API endpoints
  components/   UI and feature components
  lib/          Auth, Prisma, and utility code
  types/        Shared types
prisma/
  migrations/   Database migrations
docker/
  entrypoint.sh Container startup with migrations
```

## Quality Checks

Before shipping changes, run at least:

```bash
make lint
make test
make build
```

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for development workflow, checks, and pull request expectations.

## Code of Conduct

See [CODE_OF_CONDUCT.md](./CODE_OF_CONDUCT.md).

## License

This project is licensed under the MIT License. See [LICENSE](./LICENSE).
