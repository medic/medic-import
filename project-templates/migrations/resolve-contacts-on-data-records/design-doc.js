
const path = require('path');

require('dotenv').config({
  path: path.resolve(__dirname, 'env')
});

const NAME = process.env.MIGRATION_NAME;

/*
 * The CouchDB js interpreter by default is pretty old so it does not interpret
 * ES5/6, so anything inside the ddoc object should be code that works on
 * netscape navigator.
 */
const ddoc = {
  _id: `_design/${NAME}`,
  views: {}
};

/*
 * emitting the uuid of the related doc in the value here so when queried with
 * include_docs=true both docs are in the result.
 */
ddoc.views[NAME] = {
  map: function(doc) {
    if (doc &&
        doc.type === 'data_record' &&
        typeof doc.contact === 'string') {
      emit(doc.contact, {_id: doc.contact});
      emit(doc.contact);
    }
  }
};

module.exports = ddoc;
