
all: new-supervisors.csv new-users.csv

new-supervisors.csv: supervisors.csv
	cat supervisors.csv | \
	  node_modules/.bin/medic-format-csv -c supervisors-config.js > new-supervisors.csv
new-users.csv: users.csv
	cat users.csv | \
	  node_modules/.bin/medic-format-csv -c users-config.js > new-users.csv
clean:
	rm -f new-users.csv new-supervisors.csv
