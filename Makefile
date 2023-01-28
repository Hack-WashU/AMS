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

install:
	cd client && pnpm install && cd ../server && pnpm install
	@# Help: installs development dependencies

client:
	cd client && pnpm run start 
	@# Help: runs client in production mode

server:
	cd server && pnpm run start
	@# Help: Starts server in production mode

dev-server:
	cd server && pnpm run dev
	@# Help: Starts server in dev mode

dev-client:
	
