var password = require('password-generator'),
    csv = require('fast-csv'),
    uuid = require('uuid');

var normalize = require('./lib/normalize'),
    relatedData,
    config;

var supervisorsConfig = {
  columns: {
    uuid: uuid,
    name: {
      use: 'Supervisor',
      unique: true
    }
  }
};

var usersConfig = {
  columns: {
    name: {
      use: 'Surname',
      format: normalize.name
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
    "place.uuid": uuid
  }
};

var usersConfigWithSupervisors = {
  columns: {
    name: {
      use: 'Surname',
      format: normalize.name
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
      var file = './data/Supervisors-Masajja-Ver2.csv';
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

// set your config here
config = usersConfig;

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
