PACKAGE := $(shell which pnpm)
.PHONY: help client server dev-client dev-server

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

install: all
	cd client && $(PACKAGE) install && cd ../server && pnpm install
	@# Help: installs development dependencies

client: all
	cd client && $(PACKAGE) run start 
	@# Help: runs client in production mode

server: all
	cd server && $(PACKAGE) exec tsc && $(PACKAGE) run start
	@# Help: Starts server in production mode

dev-server: all
	cd server && $(PACKAGE) run dev
	@# Help: Starts server in dev mode

database-init:
	docker run -p "5432:5432" --name "postgres" -d -e POSTGRES_PASSWORD="supersecret" postgres
	@# Help: Starts a mongodb database in a docker container

database-stop:
	docker stop postgres || true

database-start:
	docker start postgres || true
