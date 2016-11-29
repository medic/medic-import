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

First prepare a query for the `_all_docs` view based on the CSV data.  The
column name in the CSV file is "UUID", so we use that in the `jq` filter.

```
cat "Missing Content field.csv" | ./medic-csv-to-json | \
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
jq  '.[] | select(.ok != true)' results.json 
```

# Editing documents based on columns in a CSV file

I have a CSV file with data I'd like to use to update documents.  Each row
includes an ID and values should map to property names on the doc.

Convert the csv file to a list of JSON objects:

```
cat new_hierarchy_data.csv | \
  ./node_modules/.bin/medic-csv-to-json > data.json
```

Create your index which maps the property names and values:

```
cat data.json | \
  jq '[ .[] | {id:.chw_area_uuid, parish: .Parish, district: .District, health_facility: .Health_Facility}]' > index.json
```

Query the `_all_docs` view based on keys/ID and save the rows:

```
cat data.json | jq '{"keys":[ .[] | .chw_area_uuid ]}' | \
  curljz -d@- "$COUCH_URL/medic/_all_docs?include_docs=true" > rows.json
```

Then run the data through the `update-properties` script passing the index file
as an argument. This also removes null docs (documents that might have been
deleted):

```
cat rows.json | jq '{docs: [.rows[] | select(.doc != null).doc]}' |
  ./node_modules/.bin/medic-update-properties index.json > docs-edited.json 
```

Check the difference between a random doc:

```
doc=9ead76b2-8d63-4694-b117-5becbe3df22e
cat docs-edited.json  | \
  jq --arg doc $doc '.docs[] | select(._id == $doc)' > new.json
cat rows.json | \
  jq --arg doc $doc '.rows[] | select(.doc._id == $doc).doc' > old.json
json-diff old.json new.json
```

```diff
 {
+  parish: "Musowala"
+  district: "Sikaso"
+  health_facility: "Mdehje HC II"
 }
```

Apply changes to production and save results:

```
curljz -d@docs-edited.json $COUCH_URL/medic/_bulk_docs > results.json
```

# Checking Results after a Bulk Update

After running a bulk update using the `_bulk_docs` API you are returned result
data in your response.  Examine the results to determine if your bulk update
executed properly.

First check that the `ok` property is always true.  This should return nothing:

```
jq  '.[] | select(.ok != true)' results.json 
```

Verify the revision was incremented by one.  This assures your request
incremented the existing doc and not something else like not create a new
document, that can happen if your request body was incorrect or some other
inconsistency exists.

```
$ doc=9ead76b2-8d63-4694-b117-5becbe3df22e
```

```
$ cat docs-edited.json | \
    jq --arg doc $doc '.docs[] | select(._id == $doc) | ._id, ._rev'
"9ead76b2-8d63-4694-b117-5becbe3df22e"
"3-8657dca5b1b28dee21a0be180c0b97d5"
```

```
$ cat results.json | jq --arg doc "$doc" '.[] | select(.id == $doc)'
{
  "ok": true,
  "id": "9ead76b2-8d63-4694-b117-5becbe3df22e",
  "rev": "4-1a7ffc213b34e480ab5201c724c15777"
}
```

# Dealing with bulk update failures

Here are some typical remedies for bulk edit failures.  The most common reason
is a conflict (409) or a server error (502) if the bulk update is very large.

If you think the bulk update is very large (over 30M or 5000k docs) you can
break your update up into smaller parts.

If see conflicts then that doc was updated prior to applying your edit, you can
run through the recipe again to fix them. 


# Cleaning Up Null Docs

If you query a view based on `keys` and some keys don't match any documents
then your rows data will include nulls.  If you plan to use that data against
the `_bulk_docs` API you will need to remove them because null values are not
allowed.

You will see an error when trying to parse your results similar to this:

```
jq  '.[] | select(.ok != false)' results.json
parse error: Invalid numeric literal at line 1, column 7
```

```
cat results.json 
Server error: Cannot read property '_id' of null
```

Count null rows from a view query:

```
$ cat rows.json | jq '[.rows[] | select(.doc == null)] | length'
17
```

Remove null rows from view results and prepare for bulk docs update:

```
cat rows.json | jq '{docs: [.rows[] | select(.doc != null).doc]}' > docs.json
```

# Splitting A Bulk Update

You have a rather large set of docs (i.e. 10000) for bulk update and would like
to divide it up.

```
jq '{docs: .docs[0:5000]}' docs.json > docs-pt1.json
jq '{docs: .docs[5000:]}' docs.json > docs-pt2.json
```
