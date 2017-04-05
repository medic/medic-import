
const path = require('path');

require('dotenv').config({
  path: path.resolve(__dirname, 'env')
});

const NAME = process.env.MIGRATION_NAME;

/*
 * CouchDB does not interpret ES5/6 so anything inside this object should be
 * code that works on netscape navigator.
 */
const ddoc = {
  _id: `_design/${NAME}`,
  views: {}
};

/*
 * emitting the uuid of the related doc in the value here so when queriedy with
 * include_docs=true both docs are in the result.
 */
const map = function(doc) {
  if (doc &&
      doc.type === 'data_record' &&
      typeof doc.contact === 'string') {
    emit(doc.contact, {_id: doc.contact});
    emit(doc.contact);
  }
};

ddoc.views[NAME] = {
  map: map.toString()
};

process.stdout.write(JSON.stringify(ddoc));
