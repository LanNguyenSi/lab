.PHONY: help up down install build clean dev test frost-core

# Colors for output
BLUE := \033[0;34m
GREEN := \033[0;32m
YELLOW := \033[0;33m
NC := \033[0m # No Color

# Detect OS for path handling
ifeq ($(OS),Windows_NT)
    FROST_CORE_PATH := ..\frost-core
else
    FROST_CORE_PATH := ../frost-core
endif

help: ## Show this help message
	@echo "$(BLUE)Frost Dashboard - Development Commands$(NC)"
	@echo ""
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "  $(GREEN)%-15s$(NC) %s\n", $$1, $$2}'
	@echo ""

frost-core: ## Clone and build frost-core if not present
	@if [ ! -d "$(FROST_CORE_PATH)" ]; then \
		echo "$(YELLOW)Cloning frost-core...$(NC)"; \
		git clone https://github.com/LanNguyenSi/frost-core.git $(FROST_CORE_PATH); \
	else \
		echo "$(GREEN)frost-core already exists$(NC)"; \
	fi
	@echo "$(YELLOW)Building frost-core...$(NC)"
	@cd $(FROST_CORE_PATH) && npm install && npm run build
	@echo "$(GREEN)frost-core ready!$(NC)"

install: frost-core ## Install all dependencies (frost-core + dashboard)
	@echo "$(YELLOW)Installing dashboard dependencies...$(NC)"
	@npm install
	@echo "$(YELLOW)Linking frost-core...$(NC)"
	@npm install $(FROST_CORE_PATH)
	@echo "$(GREEN)Dependencies installed!$(NC)"

up: install ## Start dev server (install deps first if needed)
	@echo "$(BLUE)Starting Frost Dashboard dev server...$(NC)"
	@npm run dev

dev: up ## Alias for 'up'

docker-up: ## Start with Docker Compose
	@echo "$(BLUE)Starting Frost Dashboard with Docker...$(NC)"
	@docker-compose up --build

docker-down: ## Stop Docker containers
	@docker-compose down

build: ## Build for production
	@echo "$(YELLOW)Building for production...$(NC)"
	@npm run build
	@echo "$(GREEN)Build complete! Output in dist/$(NC)"

preview: build ## Preview production build
	@npm run preview

test: ## Run tests (if available)
	@if [ -f "package.json" ] && grep -q '"test"' package.json; then \
		npm test; \
	else \
		echo "$(YELLOW)No tests configured$(NC)"; \
	fi

clean: ## Clean build artifacts and dependencies
	@echo "$(YELLOW)Cleaning...$(NC)"
	@rm -rf node_modules dist .vite
	@echo "$(GREEN)Clean complete!$(NC)"

clean-all: clean ## Clean everything including frost-core
	@if [ -d "$(FROST_CORE_PATH)" ]; then \
		echo "$(YELLOW)Cleaning frost-core...$(NC)"; \
		cd $(FROST_CORE_PATH) && rm -rf node_modules dist .vite; \
	fi
	@echo "$(GREEN)Everything cleaned!$(NC)"

update: ## Update frost-core to latest
	@echo "$(YELLOW)Updating frost-core...$(NC)"
	@if [ -d "$(FROST_CORE_PATH)" ]; then \
		cd $(FROST_CORE_PATH) && git pull && npm install && npm run build; \
		npm install $(FROST_CORE_PATH); \
		echo "$(GREEN)frost-core updated!$(NC)"; \
	else \
		echo "$(YELLOW)frost-core not found, run 'make install' first$(NC)"; \
	fi

status: ## Show status of dependencies
	@echo "$(BLUE)Frost Dashboard Status:$(NC)"
	@echo ""
	@if [ -d "node_modules" ]; then \
		echo "  $(GREEN)✓$(NC) Dashboard dependencies installed"; \
	else \
		echo "  $(YELLOW)✗$(NC) Dashboard dependencies missing (run 'make install')"; \
	fi
	@if [ -d "$(FROST_CORE_PATH)" ]; then \
		echo "  $(GREEN)✓$(NC) frost-core found at $(FROST_CORE_PATH)"; \
		if [ -d "$(FROST_CORE_PATH)/dist" ]; then \
			echo "  $(GREEN)✓$(NC) frost-core built"; \
		else \
			echo "  $(YELLOW)✗$(NC) frost-core not built (run 'make install')"; \
		fi \
	else \
		echo "  $(YELLOW)✗$(NC) frost-core not found (run 'make install')"; \
	fi
	@echo ""
