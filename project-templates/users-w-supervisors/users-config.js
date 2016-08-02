var password = require('password-generator'),
    csv = require('fast-csv'),
    uuid = require('uuid'),
    path = require('path');

var normalize = require('../../../lib/normalize'),
    relatedData,
    config;

var usersConfigWithSupervisors = {
  columns: {
    name: {
      use: 'Surname',
      format: [normalize.name, {reverse: true}]
    },
    phone: {
      use: 'Chp_Phone',
      format: [normalize.phone, '+256']
    },
    external_id: 'ChpCode',
    supervisor: {
      use: 'Supervisor',
      optional: true
    },
    username: {
      format: function() {
        return normalize.username(this.name);
      },
      unique: true
    },
    password: password,
    "contact.uuid": uuid,
    "place.uuid": uuid,
    "place.supervisor": function() {
      var key = this.supervisor.trim();
      if (!key) return;
      if (!relatedData[key]) {
        console.error(this);
        throw new Error('Supervisor key not found: ' + key);
      }
      return relatedData[key];
    }
  },
  related: {
    load: function(callback) {
      var file = [__dirname, 'new-supervisors.csv'].join(path.sep);
      if (!relatedData) {
        relatedData = {};
      }
      csv
        .fromPath(file, {headers:true})
        .on("data", function(obj) {
          relatedData[obj.name] = obj.uuid;
        })
        .on("end", function() {
          callback();
        });
    }
  }
};

config = usersConfigWithSupervisors;

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
