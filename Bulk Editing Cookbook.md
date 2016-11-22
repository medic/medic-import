# Bulk Editing Cookbook

# Setup

Added these aliases because we use these options frequently:

```
alias curlj="curl -H 'content-type:application/json'"
alias curljz="curl --compressed -H 'content-type:application/json'"
```

# Updating a static value

You have a field that needs updating on a many docs and the value is the same
for all of them.

You have a CSV file with the list of UUIDs to update.

## Recipe 

First prepare a query for the `_all_docs` view based on the CSV data.  The
column name in the CSV file is "UUID", so we use that in the `jq` filter.

```
cat Missing\ Content\ field.csv | ./medic-csv-to-json | \
  jq '{"keys":[ .[] | .UUID ]}' > query
```

Fetch all your documents:

```
curljz -d@query $COUCH_URL/medic/_all_docs?include_docs=true > docs.json
```

Set the property value on all the docs:

```
cat docs.json | \
  jq '{"docs": [ .rows[] | .doc | .content = "foo" ]}' > docs-edited.json
```

Take a few samples from the output and compare them.  If you want you can diff
the entire files but that can take a long time depending on how many docs you
are editing.

```
cat docs.json | jq '.docs[1432]' > testold.json
cat docs-edited.json | jq '.docs[1432]' > testnew.json
json-diff old new
```

```diff
 {
+  content: "foo"
 }
```

Apply changes to production and save result data:

```
curljz -d@docs-edited.json $LG_PROD/medic/_bulk_docs > results.json
```

Check results for errors, this should return nothing.

```
jq  '.[] | select(.ok != false)' results.json 
```

# Dealing with bulk update failures

Here are some typical remedies for bulk edit failures.  The most common reason
is a conflict (409) or a server error (502) if the bulk update is very large.

If you think the bulk update is very large (over 30M or 5000k docs) you can
break your update up into smaller parts.

If see conflicts then that doc was updated prior to applying your edit, you can
run through the recipe again to fix them. 

