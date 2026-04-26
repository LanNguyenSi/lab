SHELL := /bin/bash
PORT ?= 3000

.PHONY: help init dev build start lint test typecheck db-generate db-migrate docker-build docker-up docker-down docker-logs

help:
	@echo "Available targets:"
	@echo "  make init         Install deps, create .env, generate Prisma client, run migrations"
	@echo "  make dev          Start the Next.js dev server (override with PORT=3005)"
	@echo "  make build        Build the application"
	@echo "  make start        Start the production server"
	@echo "  make lint         Run ESLint"
	@echo "  make test         Run Jest"
	@echo "  make typecheck    Run TypeScript typecheck"
	@echo "  make db-generate  Generate Prisma client"
	@echo "  make db-migrate   Apply Prisma migrations"
	@echo "  make docker-build Build the Docker image"
	@echo "  make docker-up    Start the app via docker compose"
	@echo "  make docker-down  Stop docker compose services"
	@echo "  make docker-logs  Tail docker compose logs"

init:
	@test -f .env || cp .env.example .env
	@mkdir -p data
	npm install --include=dev
	npm run db:generate
	npm run db:migrate

dev:
	@rm -f .next/dev/lock
	PORT=$(PORT) npm run dev -- --port $(PORT)

build:
	npm run build

start:
	npm run start

lint:
	npm run lint

test:
	npm test -- --runInBand

typecheck:
	npm run typecheck

db-generate:
	npm run db:generate

db-migrate:
	npm run db:migrate

docker-build:
	docker compose build

docker-up:
	docker compose up --build

docker-down:
	docker compose down

docker-logs:
	docker compose logs -f
