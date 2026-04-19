.PHONY: help install build test clean run docker-build docker-run demo

# Variables
IMAGE_NAME = allergen-guard
RECIPE_PATH = recipes/italian/pasta-carbonara.yml

help: ## Show this help message
	@echo "AllergenGuard - Available Commands:"
	@echo ""
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-15s\033[0m %s\n", $$1, $$2}'
	@echo ""

install: ## Install dependencies
	npm install

build: ## Build TypeScript
	npm run build

test: ## Run tests
	npm test

test-watch: ## Run tests in watch mode
	npm run test:watch

clean: ## Clean build artifacts
	rm -rf dist node_modules

run: build ## Run CLI (shows help)
	node dist/cli/index.js --help

demo: build ## Run demo allergen check
	@echo ""
	@echo "🔥 Demo: Checking pasta carbonara for gluten + eggs allergies"
	@echo ""
	node dist/cli/index.js check --recipe $(RECIPE_PATH) --allergies gluten,eggs
	@echo ""

scan: build ## Scan demo recipe
	@echo ""
	@echo "🔍 Scanning pasta carbonara recipe"
	@echo ""
	node dist/cli/index.js scan --recipe $(RECIPE_PATH)
	@echo ""

validate: build ## Validate demo recipe
	@echo ""
	@echo "✓ Validating pasta carbonara recipe"
	@echo ""
	node dist/cli/index.js validate --recipe $(RECIPE_PATH)
	@echo ""

docker-build: ## Build Docker image
	docker build -t $(IMAGE_NAME):latest .

docker-run: ## Run in Docker container
	docker run --rm -v $(PWD)/recipes:/app/recipes $(IMAGE_NAME):latest check --recipe /app/recipes/italian/pasta-carbonara.yml --allergies gluten,eggs

docker-demo: docker-build docker-run ## Build and run Docker demo

dev: ## Run in development mode (with tsx)
	npm run dev -- --help

# Default target
.DEFAULT_GOAL := help
