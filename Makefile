# ------------------------------------------------------------------------------
# IMPORTANT NOTE:
# This file requires tabs to work properly, do not substitute them with spaces.
# ------------------------------------------------------------------------------

SHELL := /bin/bash


prepare:
	./scripts/secrets.sh


build-assets:
	./scripts/build.sh assets

serve-assets:
	docker compose up assets -d

serve-prod:
	docker compose -f docker-compose.deploy.yml up -d


stop:
	docker compose down

build-dev:
	docker compose kill assets
	docker compose rm -f -v assets
	docker volume rm dd_assets_node_modules
	docker compose build assets

serve-dev:
	docker compose up -d

lint:
	pre-commit run --all-files


