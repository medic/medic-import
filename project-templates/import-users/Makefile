
all: new-users.csv

new-users.csv: users.csv
	cat users.csv | \
	  ./bin/medic-format-csv -c format-csv-config.js > new-users.csv
clean:
	rm -f new-users.csv
