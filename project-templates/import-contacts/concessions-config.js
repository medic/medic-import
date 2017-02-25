var normalize = require('medic-bulk-utils').normalize,
    csv = require('fast-csv'),
    uuid = require('uuid'),
    path = require('path');

var relatedData,
    relatedDataConfig = {
      path: ['dist', 'zones.csv'],
      onRow: function(obj) {
        // map a lookup key to a uuid
        relatedData[obj.external_id] = obj.uuid;
      }
    };

var config = {
  columns: {
    uuid: uuid,
    external_id: 'Concession',
    person_external_id: 'ID',
    zone: 'Zone',
    parent: function() {
      var key = this.zone;
      if (typeof relatedData[key] !== 'undefined') {
        return relatedData[key];
      } else {
        console.error(this);
        throw new Error('Zone ID not found: ' + key);
      }
    },
    nom: 'Nom',
    name: function() {
      return normalize.name(this.nom) + ' (' + this.external_id + ')';
    },
    'contact.uuid': uuid,
    'contact.name': {
      use: 'Nom',
      format: [normalize.name]
    },
    date_of_birth: {
      use: 'Date de naissance',
      format: [normalize.date, 'YYYY']
    },
    age: 'Age',
    menage: 'Menage',
    sex: 'Sexe'
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
