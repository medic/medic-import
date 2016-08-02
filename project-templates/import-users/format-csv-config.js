var normalize = require('medic-import').normalize,
    password = require('password-generator'),
    uuid = require('uuid');

module.exports = {
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
