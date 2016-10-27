var normalize = require('medic-import').normalize,
    uuid = require('uuid');

var TZ = 'GMT';

module.exports = {
  columns: {
    id: 'id',
    source_key: 'source_key',
    name: {
      // todo allow passing in only a function then just assume key and source
      // col name match
      use: 'name',
      format: normalize.name
    },
    family_name: function() {
      return normalize.name(this.name) + ' Family';
    },
    phone: {
      use: 'mobile_no',
      optional: true,
      format: function(val) {
        if (val !== '0000-000-000') {
          return normalize.phone(val, '+256');
        }
        return '';
      }
    },
    created: {
      use: 'created',
      format: function(val) {
        return new Date(val + ' ' + TZ).toGMTString();
      }
    },
    age: 'age',
    due_date: 'due_date',
    date_of_birth: function() {
      var d = new Date(this.created);
      d.setFullYear(d.getFullYear() - this.age);
      return d.getUTCFullYear() + '-' + (d.getUTCMonth() + 1) + '-' + d.getUTCDate();
    },
    // I am assuming average pregnancy is 40 weeks
    lmp_date: {
      use: 'due_date',
      format: function(val) {
        var d = new Date(new Date(val) - (40 * 7 * 24 * 60 * 60 * 1000));
        d = d.toDateString().split(/\s+/);
        return d[1] + ' ' + d[2] + ', ' + d[3]; // Mmm DD, YYYY
      }
    },
    latitude: 'latitude',
    longitude: 'longitude',
    geolocation: function() {
      return normalize.geo(this.latitude, this.longitude);
    },
    woman_uri: 'woman_uri',
    landmark_uri: 'landmark_uri',
    chpcode: 'chpcode',
    pstatus: 'pstatus',
    pregstatus: 'pregstatus',
    source_create_date: 'source_create_date',
    sync_back_key: 'sync_back_key',
    person_image_server: 'person_image_server',
    landmark_image_server: 'landmark_image_server',
    recordstatus: 'recordstatus',
    dangerSigns: 'dangerSigns',
    riskFactors: 'riskFactors',
    family_uuid: uuid,
    person_uuid: uuid,
    pregnancy_uuid: uuid
  }
};
