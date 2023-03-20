PACKAGE := $(shell which pnpm)
POSTGRES_URL := $(shell cat .env | grep POSTGRES_URL)
.PHONY: install dev database-start database-stop

# Prints Makefile help output
help:
	@printf "%-20s %s\n" "Target" "Description"
	@printf "%-20s %s\n" "------" "-----------"
	@make -pqR : 2>/dev/null \
        | awk -v RS= -F: '/^# File/,/^# Finished Make data base/ {if ($$1 !~ "^[#.]") {print $$1}}' \
        | sort \
        | egrep -v -e '^[^[:alnum:]]' -e '^$@$$' \
        | xargs -I _ sh -c 'printf "%-20s " _; make _ -nB | (grep -i "^# Help:" || echo "") | tail -1 | sed "s/^# Help: //g"'

all:
ifeq (, $(PACKAGE))
	$(warning "pnpm not present. Setting default executable to make")
	$(eval PACKAGE=$(shell which npm))
endif
	echo $(POSTGRES_URL) > server/.env
	@# Help: Auxillary target to set default node package manager

install: all
	$(PACKAGE) install
	cd client && $(PACKAGE) install && cd ../server && $(PACKAGE) install
	cd server && $(PACKAGE) exec prisma generate && $(PACKAGE) exec prisma migrate dev
	@# Help: installs development dependencies

dev: all database-start
	$(PACKAGE) exec npm-run-all --parallel dev-client dev-server
	@# Help: Starts server in dev mode

database-start:
	docker-compose up -d
	@# Help: Starts a postgres database and a supertokens instance

database-stop:
	docker-compose down
	@# Help: Stops postgres database and supertokens

database-reset: database-stop
	docker-compose down -v 
