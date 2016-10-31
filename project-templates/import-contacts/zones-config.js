var uuid = require('uuid'),
    normalize = require('medic-import').normalize;

module.exports = {
  columns: {
    uuid: uuid,
    chw_name: 'CHW Name',
    external_id: 'Zone',
    name: {
      format: function() {
        return normalize.name(this.chw_name) + ' (' + this.external_id + ')';
        //return this['CHW Name'] + ' (' + this['Zone ID'] + ')';
      },
      unique: true
    }
  }
};
