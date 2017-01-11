```

Usage: cat data.json | ./extend-properties [-ah] index.json > data-edited.json

Description:

  Take a list of JSON documents/objects on standard input and apply changes to it. 
  The index file is also a list of JSON documents/objects and must include an
  `id` property grouped with other properties.

Options:
  
  -h  This help information.

  -a  Update all occurrences of an object on a document, rather than just
      updating the first occurrence.  This can be useful to update embedded
      documents, but be warned because this can cause conflicts if your
      document is self-referential or has a version of itself embedded in
      itself.

```
