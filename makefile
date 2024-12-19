# Default target (dev)
all: dev

# Variables
GITHUB_REPO = git@github.com:darthrichlius/fastmicroservices-auth.git
BRANCH ?= main
DIST_DIR ?= ./dist

# Common target to prepare the environment (e.g., create required folders)
.PHONY: prepare
prepare:
	@echo "Preparing environment..."
	@mkdir -p mongo_data

# Clean target: Removes all containers, images, volumes, and networks for a fresh start
.PHONY: clean
clean:
	@echo "Removing all Docker containers, images, and volumes..."
	@docker-compose -f docker-compose.yml down --rmi all --volumes --remove-orphans || true
	@docker-compose -f docker-compose.prod.yml down --rmi all --volumes --remove-orphans || true
	@docker-compose -f docker-compose.test.yml down --rmi all --volumes --remove-orphans || true
	@echo "Docker cleanup complete."

# Initialize Node.js modules
.PHONY: node_modules
node_modules:
	@echo "Installing node modules..."
	@yarn install
	@echo "Node modules are ready."

# Dev target: Runs prepare, create-certs, and starts containers in development mode
.PHONY: dev
dev: node_modules prepare
	@echo "Creating certificates for development..."
	@./scripts/create-certs.sh
	@echo "Starting Docker containers in development mode..."
	@docker-compose -f docker-compose.yml --env-file .env up --build --remove-orphans --abort-on-container-exit

# Dev-clean target: Fully cleans the environment and starts dev containers without cache
.PHONY: dev-clean
dev-clean: clean prepare
	@echo "Creating certificates for development..."
	@./scripts/create-certs.sh
	@echo "Starting Docker containers in development mode without cache..."
	@docker-compose -f docker-compose.yml --env-file .env up --build --force-recreate --renew-anon-volumes

# Prod target: Runs prepare and starts the containers in production mode
.PHONY: prod
prod: docker-stop prepare
	@echo "Starting Docker containers in production mode..."
	@docker-compose -f docker-compose.prod.yml --env-file .env.prod up --build --remove-orphans  -d

# Test target: Build and start test containers
.PHONY: build
build: prod clean-dist
	@echo "Building production-ready files..."
	@docker-compose -f docker-compose.prod.yml exec -u root auth chmod 777 dist
	@docker-compose -f docker-compose.prod.yml exec -u root auth yarn build
	@echo "Build process completed."

# Test target: Build and start test containers
.PHONY: test
test: prepare
	@echo "Starting Docker containers in test mode..."
	@docker-compose -f docker-compose.test.yml --env-file .env.test up --build --remove-orphans -d

# Run tests inside the test containers
.PHONY: run-tests
run-tests:
	@echo "Running tests inside the auth container..."
	@docker-compose -f docker-compose.test.yml exec auth yarn test

# Stop all containers for all environments
.PHONY: docker-stop
docker-stop:
	@echo "Stopping all Docker containers..."
	@docker-compose -f docker-compose.yml down --volumes --remove-orphans || true
	@docker-compose -f docker-compose.test.yml down --volumes --remove-orphans || true
	@docker-compose -f docker-compose.prod.yml down --volumes --remove-orphans || true
	@echo "Docker containers stopped."

.PHONY: clean-dist
clean-dist:
	@docker-compose -f docker-compose.prod.yml exec -u root auth rm -rf dist/*

# Publish target: Builds and pushes production-ready code to GitHub
.PHONY: publish
publish: build
	@echo "Publishing to GitHub..."
# Ensure .env.production exists


# Ensure the dist directory exists
	#@ [ -d "$(DIST_DIR)" ] || { echo "$(DIST_DIR) not found, ensure build succeeded!"; exit 1; }
# Check if the GitHub remote is configured, and add it if not
	#@ git remote get-url github > /dev/null 2>&1 || git remote add github $(GITHUB_REPO)
	#@ echo "Remote set uo completed!"
# Force add the dist directory to the Git repository, , excluding the `packages/` folder
	#@ git add $(DIST_DIR) -f ':!packages/'
# Add all other changes, excluding the `packages/` folder
# @ git add . --exclude packages/
# Commit the changes with a timestamp-based message
	#@ git commit -m "chore: [publish] - production-ready dist files for tag $$(date +'%Y%m%d%H%M%S')"
# Generate a tag based on the current timestamp
	#@ TAG=v$(date +'%Y%m%d%H%M%S') && \
	git tag -a "$$TAG" -m "Automated publish tag $$TAG"
# Push the commit and the tag to the remote repository
	#@ git push --force $(GITHUB_REPO) $(BRANCH)
	#@ git push $(GITHUB_REPO) --tags
	#@ echo "Publish complete! Tag: $$TAG"
