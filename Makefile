
all: docs
	
docs: docs/format-csv.md docs/import.md docs/export-mysql-query.md docs/update-properties.md

docs/format-csv.md: format-csv
	(echo '```'; ./format-csv -h; echo '```') > docs/format-csv.md 2>&1

docs/import.md: import
	(echo '```'; ./import; echo '```') > docs/import.md

docs/export-mysql-query.md: export-mysql-query
	(echo '```'; ./export-mysql-query; echo '```') > \
		docs/export-mysql-query.md 2>/dev/null

docs/update-properties.md: update-properties
	(echo '```'; ./update-properties -h; echo '```') > \
	  docs/update-properties.md 2>&1

cleandocs:
	rm -rf docs/*
