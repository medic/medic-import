EXTRA_IMPORT_FLAGS ?= -d
COUCH_URL ?= http://admin:secret@localhost:5984
USER_DATA ?= Thika.users.updated.csv
PREGNANCY_DATA ?= Pregnancy Data - Thika.csv
CURLJZ = curl -sfS --compressed -H 'content-type:application/json'

.PHONY: init

all: init dist/pregnancies-final.csv

init:
	test -d dist || mkdir dist
	test -d tmp || mkdir tmp

tmp/users.json:
	# assumes username is in a column labeled "username"
	cat "${USER_DATA}" | \
	  ./node_modules/.bin/medic-csv-to-json | \
	  jq '{keys: [.[] | "org.couchdb.user:" + .username]}' | \
	  ${CURLJZ} -d@- ${COUCH_URL}/medic/_all_docs?include_docs=true > tmp/users.json

tmp/contacts.json: tmp/users.json
	cat tmp/users.json | \
	  jq  '{"keys": [.rows[] | .doc.contact_id]}' | \
	  ${CURLJZ} -d@- ${COUCH_URL}/medic/_all_docs?include_docs=true > tmp/contacts.json

dist/pregnancies-final.csv: tmp/contacts.json
	cat "${PREGNANCY_DATA}" | \
	  ./node_modules/.bin/medic-format-csv \
	  -c format-csv-config-lg-pregnancies.js \
	  > dist/pregnancies-final.csv

import: dist/pregnancies-final.csv
	COUCH_URL=${COUCH_URL} ./import-pregnancies ${EXTRA_IMPORT_FLAGS} \
	  ./tmp/users.json ./tmp/contacts.json ./dist/pregnancies-final.csv

clean:
	rm -rf tmp dist
