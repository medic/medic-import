var uuid = require('uuid');

var supervisorsConfig = {
  columns: {
    name: {
      use: 'Supervisor',
      unique: true
    },
    uuid: uuid
  }
};

module.exports = supervisorsConfig;
