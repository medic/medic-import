var password = require('password-generator'),
    uuid = require('uuid');

var normalize = require('../../../lib/normalize');

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
