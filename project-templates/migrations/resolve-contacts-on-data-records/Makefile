
SHELL=/bin/sh -o pipefail
export PATH := ./node_modules/.bin/:$(PATH)

all: node_modules design-doc.json

node_modules: package.json
	npm install

design-doc.json: node_modules design-doc.js
	./node_modules/.bin/5984 compile design-doc.js > design-doc.json

install: design-doc.json
	cat design-doc.json | \
	  5984 fetch-revs "$$COUCH_URL/medic" | \
	  5984 bulk "$$COUCH_URL/medic" | \
	  tee /dev/stderr | \
	  jq -e '.ok == true' > /dev/null

uninstall:
	cat design-doc.json | \
	  jq -c '._deleted = true' | \
	  5984 fetch-revs "$$COUCH_URL/medic" | \
	  5984 bulk "$$COUCH_URL/medic" | \
	  tee /dev/stderr | \
	  jq -e '.ok == true' > /dev/null

clean: uninstall
	rm design-doc.json
