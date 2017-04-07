
const path = require('path');

require('dotenv').config({
  path: path.resolve(__dirname, '..', 'env')
});

if (!process.env.MIGRATION_NAME) {
  throw new Error("Missing environment variable: MIGRATION_NAME");
}

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

ddoc.views[NAME] = {
  map: require('./map')
};

module.exports = ddoc;
