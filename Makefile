# Base command
NPM_CMD = npm
GO_CMD = go

# Templ
TEMPL_CMD = $(GOPATH)/bin/templ

# Goose DB Migration
include .env
MIGRATION_DIR = migrations
GOOSE_CMD = $(GOPATH)/bin/goose -dir $(MIGRATION_DIR) postgres "$(DB_URI)"	

ENTRYPOINT = stashbin.go

BUILD_NAME = stashbin

help:
	@egrep -h '\s##\s' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m  %-15s\033[0m %s\n", $$1, $$2}'


generate:  ## Generate templ files
	@echo "Generating templ files..."
	@$(TEMPL_CMD) generate 
	@echo "Generating static files..."
	@$(GO_CMD) generate ./...


dev: ## Run dev server
	@echo "Running dev server..."
	@$(NPM_CMD) run watch & $(GO_CMD) run $(ENTRYPOINT) && kill $!


clean: ## Cleanup the project
	@echo "Cleaning up files"
	@rm -f $(BINARY_NAME)
	@rm -rf ./assets
	@rm -rf ./view/*templ.go


migrate-status:  ## Print migration status
	@$(GOOSE_CMD) status

revision:  ## Create new migration file
	@$(GOOSE_CMD) create $(name) sql

upgrade:  ## Migrate the DB to the most recent version available
	@$(GOOSE_CMD) up

downgrade: ## Roll back the DB version by 1
	@$(GOOSE_CMD) down