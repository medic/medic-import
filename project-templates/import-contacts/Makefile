#
# `import` targets default to dry run, so to do a real import set some
# variables:
#
#   EXTRA_IMPORT_FLAGS='' EXTRA_IMPORT_FILTERS=cat make import
#

BRANCH ?= 72e410c79b
EXTRA_IMPORT_FLAGS ?= -d
EXTRA_IMPORT_FILTERS ?= head -2

all: init dist/zones.csv dist/concessions.csv dist/people.csv

.PHONY: init

init:
	test -d dist || mkdir dist

dist/zones.csv: CHW_Zones_Sabossa.csv
	cat CHW_Zones_Sabossa.csv | \
	  ./node_modules/.bin/medic-format-csv -c zones-config.js \
	    > dist/zones.csv

dist/concessions.csv: V1_Sabossa_Concessions.csv
	cat V1_Sabossa_Concessions.csv | \
	  ./node_modules/.bin/medic-format-csv -c concessions-config.js \
	    > dist/concessions.csv

dist/people.csv: V1_Sabossa_People.csv
	cat V1_Sabossa_People.csv | \
	  ./node_modules/.bin/medic-format-csv -c people-config.js \
	    > dist/people.csv

import: import-zones import-concessions import-people

import-zones:
	# create zones (places)
	cat dist/zones.csv | $(EXTRA_IMPORT_FILTERS) | ./node_modules/.bin/medic-import \
	  $(EXTRA_IMPORT_FLAGS) \
	  -c uuid,name,external_id \
	  -t places-level-2 $(BRANCH)
	# create people associated with zones
	cat dist/zones.csv | $(EXTRA_IMPORT_FILTERS) | ./node_modules/.bin/medic-import \
	  $(EXTRA_IMPORT_FLAGS) \
	  -c uuid:place,contact.uuid:uuid,contact.name:name \
	  -t people
	# set contact/person on zone 
	cat dist/zones.csv | $(EXTRA_IMPORT_FILTERS) | ./node_modules/.bin/medic-import \
	  $(EXTRA_IMPORT_FLAGS) \
	  -c uuid,contact.uuid:contact \
	  -t places-update

import-concessions:
	# create concessions (places)
	cat dist/concessions.csv | $(EXTRA_IMPORT_FILTERS) | ./node_modules/.bin/medic-import \
	  $(EXTRA_IMPORT_FLAGS) \
	  -c uuid,parent,name,external_id \
	  -t places-level-3
	# create people associated with concessions
	cat dist/concessions.csv | $(EXTRA_IMPORT_FILTERS) | ./node_modules/.bin/medic-import \
	  $(EXTRA_IMPORT_FLAGS) \
	  -c uuid:place,contact.uuid:uuid,contact.name:name \
	  -t people
	# set contact/person on concession
	cat dist/concessions.csv | $(EXTRA_IMPORT_FILTERS) | ./node_modules/.bin/medic-import \
	  $(EXTRA_IMPORT_FLAGS) \
	  -c uuid,contact.uuid:contact \
	  -t places-update

import-people:
	# create people, import all columns
	cat dist/people.csv | $(EXTRA_IMPORT_FILTERS) | ./node_modules/.bin/medic-import \
	  $(EXTRA_IMPORT_FLAGS) \
	  -t people

clean:
	rm -rf dist
