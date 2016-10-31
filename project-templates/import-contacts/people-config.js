var normalize = require('medic-import').normalize,
    csv = require('fast-csv'),
    uuid = require('uuid'),
    path = require('path');

var relatedData,
    relatedDataConfig = {
      path: ['dist', 'concessions.csv'],
      onRow: function(obj) {
        // map a lookup key to a uuid
        relatedData[obj.external_id] = obj.uuid;
      }
    };

var config = {
  columns: {
    uuid: uuid,
    concession: 'Concession',
    place: function() {
      var key = this.concession;
      try {
        return relatedData[key];
      } catch(e) {
        console.error(this);
        throw new Error('Concession ID not found: ' + key);
      }
    },
    name: {
      use: 'Nom',
      format: [normalize.name]
    },
    date_of_birth: 'Date de naissance',
    external_id: 'ID',
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
