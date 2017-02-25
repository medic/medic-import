var normalize = require('medic-bulk-utils').normalize,
    csv = require('fast-csv'),
    uuid = require('uuid'),
    path = require('path');

var relatedData,
    relatedDataConfig = {
      path: ['dist', 'concessions.csv'],
      onRow: function(obj) {
        // map a lookup key to a uuid
        relatedData[obj.external_id] = obj.uuid;
        relatedData[obj.person_external_id] = obj['contact.uuid'];
      }
    };

var config = {
  columns: {
    external_id: 'ID',
    uuid: function() {
      if (typeof relatedData[this.external_id] !== 'undefined') {
        return relatedData[this.external_id];
      }
      return uuid();
    },
    concession: 'Concession',
    place: function() {
      var key = this.concession;
      if (typeof relatedData[key] !== 'undefined') {
        return relatedData[key];
      } else {
        console.error(this);
        throw new Error('Concession ID not found: ' + key);
      }
    },
    name: {
      use: 'Nom',
      format: [normalize.name]
    },
    phone: {
      use: 'Phone',
      optional: true,
      format: [normalize.phone, '+233'] // Ghana
    },
    date_of_birth: {
      use: 'Date de naissance',
      format: [normalize.date, 'YYYY']
    },
    menage: 'Menage',
    sex: 'Sexe',
    relation_to_parent: 'Lien de parente'
  },
  related: {
    load: function(callback) {
      if (!relatedData) {
        relatedData = {};
      }
      csv
        .fromPath(path.resolve.apply(null, relatedDataConfig.path), {headers:true})
        .on("data", relatedDataConfig.onRow)
        .on("end", function() {
          callback();
        });
    }
  }
};

module.exports = function(callback) {
  if (config.related && config.related.load) {
    config.related.load(function(err) {
      if (err) {
        return console.error(err);
      }
      callback(null, config);
    });
  } else {
    callback(null, config);
  }
};
