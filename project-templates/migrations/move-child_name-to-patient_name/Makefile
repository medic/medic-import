
SHELL=/bin/sh -o pipefail

all: node_modules ddoc.json

node_modules: package.json
	npm install

ddoc.json: node_modules ddoc/index.js ddoc/map.js
	./node_modules/.bin/5984 compile ddoc/index.js > ddoc.json

install: ddoc.json
	cat ddoc.json | \
	  ./node_modules/.bin/5984 fetch-revs "$$COUCH_URL/medic" | \
	  ./node_modules/.bin/5984 bulk "$$COUCH_URL/medic" | \
	  tee /dev/stderr | \
	  jq -e '.ok == true' > /dev/null

uninstall:
	cat ddoc.json | \
	  jq -c '._deleted = true' | \
	  ./node_modules/.bin/5984 fetch-revs "$$COUCH_URL/medic" | \
	  ./node_modules/.bin/5984 bulk "$$COUCH_URL/medic" | \
	  tee /dev/stderr | \
	  jq -e '.ok == true' > /dev/null

clean: uninstall
	rm ddoc.json
