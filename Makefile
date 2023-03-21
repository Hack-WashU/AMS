PACKAGE := $(shell which pnpm)
POSTGRES_URL := $(shell cat .env | grep POSTGRES_URL)

ifneq (,$(findstring xterm,${TERM}))
	BLACK        := $(shell tput -Txterm setaf 0)
	RED          := $(shell tput -Txterm setaf 1)
	GREEN        := $(shell tput -Txterm setaf 2)
	YELLOW       := $(shell tput -Txterm setaf 3)
	LIGHTPURPLE  := $(shell tput -Txterm setaf 4)
	PURPLE       := $(shell tput -Txterm setaf 5)
	BLUE         := $(shell tput -Txterm setaf 6)
	WHITE        := $(shell tput -Txterm setaf 7)
	RESET := $(shell tput -Txterm sgr0)
else
	BLACK        := ""
	RED          := ""
	GREEN        := ""
	YELLOW       := ""
	LIGHTPURPLE  := ""
	PURPLE       := ""
	BLUE         := ""
	WHITE        := ""
	RESET        := ""
endif

# set target color
TARGET_COLOR := $(BLUE)

.PHONY: install dev database-start database-stop

# Prints Makefile help output
help:
	@printf "${LIGHTPURPLE}%-20s %s\n" "Target" "Description${RESET}"
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
	@echo " ${GREEN}>>> Make sure you've also installed the git hook: run \`make hooks\` <<<${RESET}"
	$(PACKAGE) install
	cd client && $(PACKAGE) install && cd ../server && $(PACKAGE) install
	cd server && $(PACKAGE) exec prisma generate && $(PACKAGE) exec tsc
	@# Help: installs development dependencies

dev: all database-start
	$(PACKAGE) exec npm-run-all --parallel dev-client dev-server
	@# Help: Starts server in dev mode

database-start:
	docker-compose up -d
	cd server && sleep 3 && $(PACKAGE) exec prisma migrate dev
	@# Help: Starts a postgres database and a supertokens instance

database-stop:
	docker-compose down
	@# Help: Stops postgres database and supertokens

database-reset: database-stop
	docker-compose down -v 
	@# Help: Resets postgres database and supertokens, removes all data

hooks:
	cp .github/hooks/* .git/hooks/
	chmod +x .git/hooks/*
	@# Help: Installs git hooks

