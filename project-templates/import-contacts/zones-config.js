var uuid = require('uuid'),
    password = require('password-generator'),
    normalize = require('medic-bulk-utils').normalize;

module.exports = {
  columns: {
    uuid: uuid,
    chw_name: 'CHW Name',
    external_id: {
      use: 'Zone',
      unique: true
    },
    name: function() {
      return normalize.name(this.chw_name) + ' (' + this.external_id + ')';
      //return this['CHW Name'] + ' (' + this['Zone ID'] + ')';
    },
    'contact.uuid': uuid,
    'contact.name': {
      use: 'CHW Name',
      format: [normalize.name]
    },
    username: {
      format: function() {
        return normalize.username(normalize.name(this.chw_name));
      },
      unique: true
    },
    password: password
  }
};
