var uuid = require('uuid'),
    normalize = require('medic-import').normalize;

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
    }
  }
};
