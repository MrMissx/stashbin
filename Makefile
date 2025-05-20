# Base command
NPM_CMD = pnpm
GO_CMD = go

# Templ
TEMPL_CMD = $(GO_CMD) tool templ

# Goose DB Migration
ifneq ("$(wildcard .env)","")
	include .env
endif

MIGRATION_DIR = database/migrations
MIGRATE_SOURCE = -database $(DB_URI)
MIGRATE_CMD = $(GOPATH)/bin/migrate

ENTRYPOINT = stashbin.go

BUILD_NAME = stashbin

help:
	@egrep -h '\s##\s' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m  %-15s\033[0m %s\n", $$1, $$2}'

install:  ## Install all dependencies
	@$(GO_CMD) mod download
	@$(NPM_CMD) install

generate:  ## Generate templ files
	@echo "Generating templ files..."
	@$(TEMPL_CMD) generate
	@echo "Generating static files..."
	@$(NPM_CMD) run build

build: generate ## build Production Executable
	go build -o $(BUILD_NAME)

dev: ## Run dev server
	@echo "Running dev server..."
	@$(NPM_CMD) run watch & $(GO_CMD) run $(ENTRYPOINT) && kill $!

dev-go: generate ## Run dev server (Go only)
	@$(GO_CMD) run $(ENTRYPOINT)


clean: ## Cleanup the project
	@echo "Cleaning up files"
	@rm -f $(BINARY_NAME)
	@rm -rf ./assets
	@rm -rf ./view/*templ.go


version:  ## Print migration version
	@$(MIGRATE_CMD) -path $(MIGRATION_DIR) $(MIGRATE_SOURCE) version

revision:  ## Create new migration file
	@$(MIGRATE_CMD) create -ext sql -dir $(MIGRATION_DIR) $(name) 

upgrade:  ## Migrate the DB to the most recent version available
	@$(MIGRATE_CMD) -path $(MIGRATION_DIR) $(MIGRATE_SOURCE) up

downgrade: ## Roll back the DB version by 1
	@$(MIGRATE_CMD) -path $(MIGRATION_DIR) $(MIGRATE_SOURCE) down
