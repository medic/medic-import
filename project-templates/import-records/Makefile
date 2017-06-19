
SHELL=/bin/sh -o pipefail
export PATH := ./node_modules/.bin/:$(PATH)

DIST_DIR ?= dist
EXTRA_IMPORT_FLAGS ?= -d
EXTRA_IMPORT_FILTERS ?= head -2
PLACES_LEVEL_0 ?= places-level-0.csv
PLACES_LEVEL_0_DIST ?= places-level-0.csv
PLACES_LEVEL_1 ?= places-level-1.csv
PLACES_LEVEL_1_DIST ?= places-level-1.csv
PLACES_LEVEL_2 ?= places-level-2.csv
PLACES_LEVEL_2_DIST ?= places-level-2.csv
PLACES_LEVEL_3 ?= places-level-3.csv
PLACES_LEVEL_3_DIST ?= places-level-3.csv
PLACES_LEVEL_3_FIELDMAP ?= places-level-3-fieldmap.csv
PLACES_LEVEL_3_PEOPLE_FIELDMAP ?= places-level-3-people-fieldmap.csv
PEOPLE ?= people.csv
PEOPLE_DIST ?= people.csv
RECORDS ?= records.csv
RECORDS_DIST ?= records.csv
RECORDS_FIELDMAP ?= records-fieldmap.csv

#all: init $(PLACES_LEVEL_1_DIST) $(PLACES_LEVEL_2_DIST) $(PLACES_LEVEL_3_DIST) $(PEOPLE_DIST)
all: init $(DIST_DIR)/$(RECORDS_DIST)

.PHONY: init

init:
	test -d $(DIST_DIR) || mkdir $(DIST_DIR)
	test -d tmp || mkdir tmp

#$(PLACES_LEVEL_1_DIST): $(PLACES_LEVEL_1)
#	# Just copying because these places were created manually.
#	cp $(PLACES_LEVEL_1) $(PLACES_LEVEL_1_DIST)
#
#$(PLACES_LEVEL_2_DIST): $(PLACES_LEVEL_2)
#	cat $(PLACES_LEVEL_2) | \
#	  medic-format-csv -c places-level-2-config.js \
#	    > $(PLACES_LEVEL_2_DIST)

$(DIST_DIR)/$(PLACES_LEVEL_3_DIST): $(PLACES_LEVEL_3)
	cat $(PLACES_LEVEL_3) | \
 	  medic-format-csv -c format-places-level-3-config.js \
	  > tmp/$(PLACES_LEVEL_3_DIST)
	mv tmp/$(PLACES_LEVEL_3_DIST) $(DIST_DIR)

$(DIST_DIR)/$(PEOPLE_DIST): $(PEOPLE) $(DIST_DIR)/$(PLACES_LEVEL_3_DIST)
	cat $(PEOPLE) | \
	  medic-format-csv -c format-people-config.js \
	  > tmp/$(PEOPLE_DIST)
	mv tmp/$(PEOPLE_DIST) $(DIST_DIR)

$(DIST_DIR)/$(RECORDS_DIST): $(RECORDS) $(DIST_DIR)/$(PEOPLE_DIST)
	cat $(RECORDS) | \
	  medic-format-csv -c format-records-config.js \
	  > tmp/$(RECORDS_DIST)
	mv tmp/$(RECORDS_DIST) $(DIST_DIR)

.PHONY: import-places-level-3 import-people import-records

import: import-places-level-3 import-people import-records

import-places-level-3:
	###
	### create places
	###
	cat $(DIST_DIR)/$(PLACES_LEVEL_3_DIST) | $(EXTRA_IMPORT_FILTERS) | medic-import \
	  $(EXTRA_IMPORT_FLAGS) \
	  -c `cat $(PLACES_LEVEL_3_FIELDMAP) | medic-csv-to-json | jq  -r  '[.[]|.source + ":" + .target] | join(",")'` \
	  places-level-3
	###
	### create associated people
	###
	cat $(DIST_DIR)/$(PLACES_LEVEL_3_DIST) | $(EXTRA_IMPORT_FILTERS) | medic-import \
	  $(EXTRA_IMPORT_FLAGS) \
	  -c `cat $(PLACES_LEVEL_3_PEOPLE_FIELDMAP) | medic-csv-to-json | jq  -r  '[.[]|.source + ":" + .target] | join(",")'` \
	  people
	###
	### update contact on place
	###
	cat $(DIST_DIR)/$(PLACES_LEVEL_3_DIST) | $(EXTRA_IMPORT_FILTERS) | medic-import \
	  $(EXTRA_IMPORT_FLAGS) \
	  -c uuid,contact_uuid:contact \
	  places-update

import-people:
	###
	### create people, import all columns so -c not needed.
	###
	cat $(DIST_DIR)/$(PEOPLE_DIST) | $(EXTRA_IMPORT_FILTERS) | medic-import \
	  $(EXTRA_IMPORT_FLAGS) \
	  people

import-records:
	cat $(DIST_DIR)/$(RECORDS_DIST) | $(EXTRA_IMPORT_FILTERS) | medic-import \
	  $(EXTRA_IMPORT_FLAGS) \
	  -c `cat $(RECORDS_FIELDMAP) | medic-csv-to-json | jq  -r  '[.[]|.source + ":" + .target] | join(",")'` \
	  records

clean:
	rm -rf $(DIST_DIR)
