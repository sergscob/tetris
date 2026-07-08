.PHONY: all prod prod-https back front i-back i-front i back-admin

all:
	npm i && npm run client-build && npm run srv-build && npm run start

test:
	npm run test

coverage:
	npm run coverage

dev:
	npm run srv-dev 


clearports:
	(lsof -ti :3004 | xargs -r kill -9) || exit 0
	(lsof -ti :8080 | xargs -r kill -9) || exit 0

clear:
	rm -rf node_modules
	rm -rf build
	rm -rf coverage

