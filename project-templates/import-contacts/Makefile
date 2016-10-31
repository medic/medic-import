
BRANCH ?= 72e410c79b
EXTRA_IMPORT_FLAGS ?= -d

all: init dist/zones.csv dist/concessions.csv dist/people.csv

.PHONY: init

init:
	test -d dist || mkdir dist

dist/zones.csv: CHW_Zones_by_Village.csv
	cat CHW_Zones_by_Village.csv | \
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

# set EXTRA_IMPORT_FLAGS to '' or similar to override dry-run
import:
	cat dist/zones.csv | head -2 | \
	  ./node_modules/.bin/medic-import \
	  $(EXTRA_IMPORT_FLAGS) -i chw_name -t places-level-2 $(BRANCH)
	cat dist/concessions.csv | head -2 | \
	  ./node_modules/.bin/medic-import $(EXTRA_IMPORT_FLAGS) -i zone,nom -t places-level-3
	cat dist/people.csv | head -2 | \
	  ./node_modules/.bin/medic-import $(EXTRA_IMPORT_FLAGS) -i concession -t people

clean:
	rm -rf dist
