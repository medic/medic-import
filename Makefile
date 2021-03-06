
DOCS = docs/format-csv.md \
       docs/import.md \
       docs/export-mysql-query.md \
       docs/extend-properties.md \
       docs/BulkEditingCookbook.md

.PHONY: docs/BulkEditingCookbook.md

all: docs

docs: $(DOCS)

docs/format-csv.md: format-csv
	(echo '```'; ./format-csv -h; echo '```') > docs/format-csv.md 2>&1

docs/import.md: import
	(echo '```'; ./import; echo '```') > docs/import.md

docs/export-mysql-query.md: export-mysql-query
	(echo '```'; ./export-mysql-query; echo '```') > \
		docs/export-mysql-query.md 2>/dev/null

docs/extend-properties.md: extend-properties
	(echo '```'; ./extend-properties -h; echo '```') > \
	  docs/extend-properties.md 2>&1

docs/BulkEditingCookbook.md:
	./node_modules/.bin/doctoc --maxlevel 2 docs/BulkEditingCookbook.md

publish:
	read -a confirm -p "Clean out working files and publish? (y/n) " && \
	test "$$confirm" == "y" && \
	git clean -fd && \
	npm publish

cleandocs:
	rm $(DOCS)
