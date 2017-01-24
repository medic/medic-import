```

Usage: cat data.json | ./node_modules/.bin/extend-properties [-ah] index.json > data-edited.json

Description:

  Take a list of JSON objects with an `_id` property on standard input and
  apply changes to it.  The changes are based on an index file that is a list
  of JSON objects with an `id` property and the other properties you want to
  change.

  This command is basically a wrapper around the Underscore.js `extend`
  function and calls it like this:

      newDoc = _.extend(origDoc, change);

Options:
  
  -h  This help information.

  -a  Update all occurrences of an object, rather than just updating the first
      or top level occurrence.  Be careful when using this on embedded
      documents, because this can cause conflicts if the embedded document is
      modified but the referenced doc is not updated.  To modify embedded
      documents properly you should update the source document first and then
      replace the embedded document so the `_rev` property matches.


```
