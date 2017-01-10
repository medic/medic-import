# Bulk Editing Cookbook

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Setup](#setup)
- [Fetch docs based on plain text list of UUIDs](#fetch-docs-based-on-plain-text-list-of-uuids)
  - [Dealing with null values and view queries](#dealing-with-null-values-and-view-queries)
- [Checking results after a bulk update](#checking-results-after-a-bulk-update)
  - [Verify it parses and the `ok` property is always true](#verify-it-parses-and-the-ok-property-is-always-true)
  - [Verify the revision was incremented by one](#verify-the-revision-was-incremented-by-one)
  - [Clean up nulls in view results](#clean-up-nulls-in-view-results)
- [Dealing with bulk update failures](#dealing-with-bulk-update-failures)
- [Splitting a bulk update](#splitting-a-bulk-update)
- [Prepare user and contact data for import](#prepare-user-and-contact-data-for-import)
- [Fetch branch (place-level-1) hierarchy information](#fetch-branch-place-level-1-hierarchy-information)
- [Updating a static value](#updating-a-static-value)
- [Editing documents based on columns in a CSV file](#editing-documents-based-on-columns-in-a-csv-file)
- [Prepare a user's place data for bulk edit](#prepare-a-users-place-data-for-bulk-edit)
- [Prepare a user's report data for bulk edit](#prepare-a-users-report-data-for-bulk-edit)
- [Bulk edit data related to a user (via PouchDB)](#bulk-edit-data-related-to-a-user-via-pouchdb)
- [Prune a large contact](#prune-a-large-contact)
- [Update embedded docs](#update-embedded-docs)
- [Checking doc stats](#checking-doc-stats)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->


# Setup

Added these aliases because we use these options frequently:

```
alias ts='date -u +"%Y-%m-%dT%H:%M:%SZ"'   
alias curlj="curl -H 'content-type:application/json'"
alias curljz="curl --compressed -H 'content-type:application/json'"
```

Install [jq](https://stedolan.github.io/jq/) and
[json-diff](https://www.npmjs.com/package/json-diff).

# Fetch docs based on plain text list of UUIDs

You have a plain text list of UUIDs separated by a new line character and want
to fetch and prepare these docs for a bulk edit.

This first makes an `_all_docs` query and then prepares/formats the results for
a `_bulk_docs` query with jq:

```
cat file | \
  jq --raw-input --slurp '{keys: split("\n") }' | \
  curljz -d@- "$COUCH_URL/medic/_all_docs?include_docs=true" | \
  jq '{docs: [ .rows[] | select(.doc).doc ]}' > docs.json
```

## Dealing with null values and view queries

The jq `select` function above assures the row has a `.doc` property.  We have
to make this check because `_all_docs` returns a row for every key in the query
even if the doc is not found. 

Example of `_all_docs` query where key is not found:

```
$ echo '{"keys": ["bar","foo"] }' | \
    curlj -d@- $COUCH_URL/medic/_all_docs?include_docs=true | jq 

{
  "total_rows": 204,
  "offset": 0,
  "rows": [
    {
      "key": "bar",
      "error": "not_found"
    },
    {
      "id": "foo",
      "key": "foo",
      "value": {
        "rev": "1-4c6114c65e295552ab1019e2b046b10e"
      },
      "doc": {
        "_id": "foo",
        "_rev": "1-4c6114c65e295552ab1019e2b046b10e",
        "foo": "bar"
      }
    }
  ]
}
```

So when querying a view based on the `keys` parameter we need to watch out for
this because the `_bulk_docs` API will not accept nulls.

Example bad null value in `_bulk_docs` conversion:

```
$ echo '{"keys": ["bar","foo"] }' | \
    curlj -d@- $COUCH_URL/medic/_all_docs?include_docs=true | \
    jq '{"docs": [ .rows[] | .doc ]}'
{
  "docs": [
    null,
    {
      "_id": "foo",
      "_rev": "1-4c6114c65e295552ab1019e2b046b10e",
      "foo": "bar"
    }
  ]
}
```

If you pass a null to the `_bulk_docs` API you will get an error:

```
$ echo '{"keys": ["bar","foo"] }' | \
    curlj -d@- $COUCH_URL/medic/_all_docs?include_docs=true | \
    jq '{"docs": [ .rows[] | .doc ]}' | \
    curlj -d@- $COUCH_URL/medic/_bulk_docs

Server error: Cannot read property '_id' of null
```

If we remove the offending key we get a successful update:

```
$ echo '{"keys": ["foo"] }' | \
    curlj -d@- $COUCH_URL/medic/_all_docs?include_docs=true | \
    jq '{"docs": [ .rows[] | .doc ]}' | \
    curlj -d@- $COUCH_URL/medic/_bulk_docs

[{"ok":true,"id":"foo","rev":"2-7051cbe5c8faecd085a3fa619e6e6337"}]
```

So one way to guard against this is using the jq `select` function when making
`_all_docs` queries.


# Checking results after a bulk update

After running an update using the `_bulk_docs` API you get result data in your
response body.  You can examine the results to determine if your bulk update
executed properly.

## Verify it parses and the `ok` property is always true

This should return nothing:

```
jq  '.[] | select(.ok != true)' results.json 
```

If you get an error when you try to parse your results with `jq` it likely that
it contains error, not valid JSON.

```
$ jq  '.[] | select(.ok != true)' results.json
parse error: Invalid numeric literal at line 1, column 7

$ cat results.json 
Server error: Cannot read property '_id' of null
```

## Verify the revision was incremented by one

This assures your request incremented the existing doc and not something else,
like create a new document, that can happen through some inconsistency.

```
$ doc=9ead76b2-8d63-4694-b117-5becbe3df22e
```

First, check the revision used in the bulk update request:

```
$ cat docs-edited.json | \
    jq --arg doc $doc '.docs[] | select(._id == $doc) | ._id, ._rev'
"9ead76b2-8d63-4694-b117-5becbe3df22e"
"3-8657dca5b1b28dee21a0be180c0b97d5"
```

Confirm the revision went to 4 in the results:

```
$ cat results.json | jq --arg doc "$doc" '.[] | select(.id == $doc)'
{
  "ok": true,
  "id": "9ead76b2-8d63-4694-b117-5becbe3df22e",
  "rev": "4-1a7ffc213b34e480ab5201c724c15777"
}
```

## Clean up nulls in view results

Check if view results are missing docs.  Here 17 out of 1474 keys returned no
doc:

```
$ cat rows.json | jq '[.rows[] | select(.doc == null)] | length'
17
$ cat rows.json | jq '[.rows[] | select(.doc != null)] | length'
1474
```

Remove null rows from view results and prepare for bulk docs update:

```
cat rows.json | jq '{docs: [.rows[] | select(.doc != null).doc]}' > docs.json
```

# Dealing with bulk update failures

Here are some typical remedies for bulk edit failures.  The most common reason
is a conflict (409) or a server error (502) if the bulk update is very large.

If you think the bulk update is very large (over 30M or 5000 docs) you can
break your update up into smaller parts.

If you see conflicts then that doc was updated prior to applying your edit, you
can run through the recipe again to fix them. 


# Splitting a bulk update

You have a rather large set of docs (i.e. 10000) for bulk update and would like
to divide it up.

```
jq '{docs: .docs[0:5000]}' docs.json > docs-pt1.json
jq '{docs: .docs[5000:]}' docs.json > docs-pt2.json
```

# Prepare user and contact data for import

You have a CSV file that contains a column of usernames and you want to collect
all the related user data (person and user-settings docs) to prepare it for
import with `import-pregnancies`.

Use the `username` column in the CSV file to construct a view query and fetch 
the user-settings documents:

```
cat Kunesa\ new-users.csv | \
  ./node_modules/.bin/medic-csv-to-json | \
  jq '{keys: [.[] | "org.couchdb.user:" + .username]}' | \
  curljz -d@- $COUCH_URL/medic/_all_docs?include_docs=true > users.json
```

Then use that data to fetch the `person` docs:

```
cat users.json | \
  jq '{keys: [ .rows[] | select(.doc).doc.contact_id ]}' | \
  curljz -d@- $COUCH_URL/medic/_all_docs?include_docs=true > contacts.json
```

# Fetch branch (place-level-1) hierarchy information 

You want a list of names and IDs of branches from any given instance:

JSON

```
curljz -G \
  --data-urlencode 'key=["district_hospital"]' \
  $COUCH_URL/medic/_design/medic/_view/doc_by_type?include_docs=true | \
  jq '[.rows[] | { name: .doc.name, id: .doc._id}]'
```

Plain Text

```
curljz -G \
  --data-urlencode 'key=["district_hospital"]' \
  $COUCH_URL/medic/_design/medic/_view/doc_by_type?include_docs=true | \
  jq --raw-output '.rows[] | .doc.name + " "  + .doc._id'
```


# Updating a static value

You have a field/property that needs updating and the value is the same for all
of the docs.

You have a CSV file with the list of UUIDs to update.

First prepare a query for the `_all_docs` view based on the CSV data.  The
column name in the CSV file is "UUID", so we use that in the `jq` filter to
construct the query.  Then fetch all the documents and prepare for a
`_bulk_docs` query.

```
cat "Missing Content field.csv" | \
  ./node_modules/.bin/medic-csv-to-json | \
  jq '{keys: [ .[] | .UUID ]}' | \
  curljz -d@- $COUCH_URL/medic/_all_docs?include_docs=true | \
  jq '{docs: [ .rows[] | select(.doc).doc ]}' > docs.json
```

Set the property value on all the docs and prepare a request body that can be
used for a bulk update:

```
cat docs.json | \
  jq '{"docs": [ .rows[] | .doc | .content = "xml" ]}' > docs-edited.json
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
+  content: "xml"
 }
```

Apply changes to production and save result data:

```
curljz -d@docs-edited.json $COUCH_URL/medic/_bulk_docs > results.json
```

Then [check results for errors](#checking-results-after-a-bulk-update).

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
  jq '[ .[] | {
    id:.chw_area_uuid,
    parish: .Parish,
    district: .District,
    health_facility: .Health_Facility
  }]' > index.json
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
cat rows.json | \
  jq '{docs: [.rows[] | select(.doc).doc]}' | \
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

Then [check results for errors](#checking-results-after-a-bulk-update).

# Prepare a user's place data for bulk edit

We have a username and want to edit all the places related to that user.
Imagine for example a CHW (doc type health_center) who manages many families
(doc type clinic).  The CHW has an area and that contains all the families.

Fetch the user's place/facility ID:

```
user='glenng'
place=`curl $COUCH_URL/medic/org.couchdb.user:$user | \
            jq --raw-output .facility_id`
```

Fetch all the child places:

```
curljz -G \
  --data-urlencode 'startkey=["clinic","'$place'"]' \
  --data-urlencode 'endkey=["clinic","'$place'",{}]' \
  "$COUCH_URL/medic/_design/medic/_view/facilities_by_parent?include_docs=true" | \
  jq '{docs: [ .rows[] | select(.doc).doc ]}' > docs.json
```

Then edit `docs.json` and save it using the `_bulk_docs` API.

# Prepare a user's report data for bulk edit

We have a username and want to edit all the reports submitted by that user.

Fetch the user's place/facility ID:

```
user='glenng'
place=`curl $COUCH_URL/medic/org.couchdb.user:$user | \
            jq --raw-output .facility_id`
```

Fetch all the reports associated with the place:

```
curljz -G \
  --data-urlencode "startkey=[\"$place\"]" \
  --data-urlencode "endkey=[\"$place\",{}]" \
  "$COUCH_URL/medic/_design/medic/_view/reports_by_place?include_docs=true" | \
  jq '{docs: [ .rows[] | .doc ]}' > docs.json
```
       
Then edit `docs.json` and save it using the `_bulk_docs` API.

# Bulk edit data related to a user (via PouchDB)

You are logged in as a non-admin user via the app or a browser window and have
synchronized all your data with the server.  Now you want a copy of that data
to bulk edit.

First paste this script
([credit](http://stackoverflow.com/questions/11849562/how-to-save-the-output-of-a-console-logobject-to-a-file))
into the browser console.  This modifies the window's `console` object to save
data easier.

```
(function(console){
  console.save = function(data, filename){
    if(!data) {
      console.error('Console.save: No data')
      return;
    }
    if(!filename) filename = 'console.json'
    if(typeof data === "object"){
      data = JSON.stringify(data, undefined, 4)
    }
    var blob = new Blob([data], {type: 'text/json'}),
        e    = document.createEvent('MouseEvents'),
        a    = document.createElement('a')
    a.download = filename
    a.href = window.URL.createObjectURL(blob)
    a.dataset.downloadurl =  ['text/json', a.download, a.href].join(':')
    e.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null)
    a.dispatchEvent(e)
  }
})(console);
```

Then replace "glenng" here with the username string and paste into the console:

```
(function(username) {
  var db = new PouchDB('medic-user-' + username);
  db.allDocs().then(function(result) {console.save(result)});
}('glenng')); 
```

This will prompt your browser to save a file named `console.json`.  This file
contains all the document UUIDs in the user's PouchDB database.  Use it to
fetch all the docs from the server and prepare for bulk edit:

```
cat console.json | \
  jq '{keys: [.rows[] | .id]}' | \
  curljz -d@- "$COUCH_URL/medic/_all_docs?include_docs=true" | \
  jq '{docs: [.rows[] | select(.doc).doc]}' > docs.json
```

Do your edits, then updating the docs on the server will automatically sync
with the app or browser window.

# Prune a large contact

You have identified a contact document that is large and needs to be pruned.
These documents are self referential so a place has a person and a person has a
place and sometimes grow too big.

Fetch the document, prune it and save it:

```
curl $COUCH_URL/medic/967a00dff5e02add41819138abb3284d | \
  jq 'del(.contact.parent.contact.parent)' | \
  curlj -d@- $COUCH_URL/medic
```
  
# Update embedded docs 

You want to modify a document that is embedded in many other documents.

First, fetch all your docs and prepare for bulk edit, let's say you have
a list of UUIDs separated by new lines to start.

```
cat uuids.txt | \
  jq --raw-input --slurp '{keys: split("\n")}' | \
  curljz -d@- "$COUCH_URL/_all_docs?include_docs=true" | \
  jq '{docs: [.rows[] | select(.doc).doc]}' > docs.json
```

Then prepare the doc you want to prune, let's say a place or person with doc ID
d93a3fc1 that is embedded throughout the docs you just fetched above.

First fetch the doc and then edit it, this can be done manually.

```
curl $COUCH_URL/medic/d93a3fc1 > d93a3fc1.json
cp d93a3fc1.json d93a3fc1-pruned.json
[edit d93a3fc1-pruned.json]
```

Update the doc on the server to fix source of the problem so any new docs that
happen to need it get the fix:

```
curljz -d@d93a3fc1-pruned.json $COUCH_URL/medic
```

Now use the `updated-embedded` script to apply the pruned doc to the bulk edit
you have prepared.  This will find all instances of doc d93a3fc1 that is
embedded and replace it:

```
$ cat docs.json | \
    ./node_modules/.bin/medic-update-embedded d93a3fc1-pruned.json \
    > docs-pruned.json

{"docs": 4198, "updates": 12406}
```

Save the updates:

```
curljz -d@docs-pruned.json $COUCH_URL/medic/_bulk_docs > results.json
```

Then [check results for errors](#checking-results-after-a-bulk-update).

# Checking doc stats

To prove that a document is simpler after you have edited it there is a
`stats` script.

A common task is to see the stats on your docs before and after pruning:

```
$ cat data.json | ./node_modules/.bin/medic-stats
{"docs": 2039, "depth":90177, "length":34607692}
$ cat data-pruned.json | ./node_modules/.bin/medic-stats
{"docs": 2039, "depth":32998, "length":19398211}
```

Those are the totals for all of the docs.  You can also spot check a single doc
assuming the index ordering is the same which is usually the case.

Not pruned:

```
$ jq '.docs[311]' docs.json | ./node_modules/.bin/medic-stats | jq
[
  {
    "depth": 18,
    "length": 4950,
    "type": "data_record",
    "name": "Juanca Simone",
    "id": "8aa260df",
    "rev": "1-8076e138a0"
  }
]
```

Pruned:

```
$ jq '.docs[311]' docs-pruned.json | \
    ./node_modules/.bin/medic-stats | jq
[
  {
    "depth": 6,
    "length": 1981,
    "type": "data_record",
    "name": "Juanca Simone",
    "id": "8aa260df",
    "rev": "1-8076e138a0"
  }
]
```
