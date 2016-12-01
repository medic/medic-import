#
#  `import` targets default to dry run, so to do a real import set some
#  variables:
#
#   EXTRA_IMPORT_FLAGS='' EXTRA_IMPORT_FILTERS=cat make import
#

VILLAGE ?= 2b2592a0d2
EXTRA_IMPORT_FLAGS ?= -d
EXTRA_IMPORT_FILTERS ?= head -2

all: init dist/zones.csv dist/concessions.csv dist/people.csv

.PHONY: init

init:
	test -d dist || mkdir dist

dist/zones.csv: CHW_Zones.csv
	cat CHW_Zones.csv | \
	  ./node_modules/.bin/medic-format-csv -c zones-config.js \
	    > dist/zones.csv

dist/concessions.csv: Concessions.csv dist/zones.csv
	cat Concessions.csv | \
	  ./node_modules/.bin/medic-format-csv -c concessions-config.js \
	    > dist/concessions.csv

dist/people.csv: People.csv dist/concessions.csv
	cat People.csv | \
	  ./node_modules/.bin/medic-format-csv -c people-config.js \
	    > dist/people.csv

import: import-zones import-users import-concessions import-people

import-zones:
	# create zones (places)
	cat dist/zones.csv | $(EXTRA_IMPORT_FILTERS) | ./node_modules/.bin/medic-import \
	  $(EXTRA_IMPORT_FLAGS) \
	  -c uuid,name,external_id \
	  -p $(VILLAGE) \
	  places-level-2
	# create people associated with zones
	cat dist/zones.csv | $(EXTRA_IMPORT_FILTERS) | ./node_modules/.bin/medic-import \
	  $(EXTRA_IMPORT_FLAGS) \
	  -c uuid:place,contact.uuid:uuid,contact.name:name \
	  people
	# set contact/person on zone 
	cat dist/zones.csv | $(EXTRA_IMPORT_FILTERS) | ./node_modules/.bin/medic-import \
	  $(EXTRA_IMPORT_FLAGS) \
	  -c uuid,contact.uuid:contact \
	  places-update

import-users:
	cat dist/zones.csv | $(EXTRA_IMPORT_FILTERS) | ./node_modules/.bin/medic-import \
	  $(EXTRA_IMPORT_FLAGS) \
	  -c username,password,uuid:place,contact.uuid:contact,name,external_id \
	  -p $(VILLAGE) \
	  users

import-concessions:
	# create concessions (places)
	cat dist/concessions.csv | $(EXTRA_IMPORT_FILTERS) | ./node_modules/.bin/medic-import \
	  $(EXTRA_IMPORT_FLAGS) \
	  -c uuid,parent,name,external_id \
	  places-level-3
	# create people associated with concessions
	cat dist/concessions.csv | $(EXTRA_IMPORT_FILTERS) | ./node_modules/.bin/medic-import \
	  $(EXTRA_IMPORT_FLAGS) \
	  -c uuid:place,contact.uuid:uuid,contact.name:name,person_external_id:external_id,date_of_birth,age,menage,sex \
	  people
	# set contact/person on concession
	cat dist/concessions.csv | $(EXTRA_IMPORT_FILTERS) | ./node_modules/.bin/medic-import \
	  $(EXTRA_IMPORT_FLAGS) \
	  -c uuid,contact.uuid:contact \
	  places-update

import-people:
	# create people, import all columns
	cat dist/people.csv | $(EXTRA_IMPORT_FILTERS) | ./node_modules/.bin/medic-import \
	  $(EXTRA_IMPORT_FLAGS) \
	  people

clean:
	rm -rf dist
