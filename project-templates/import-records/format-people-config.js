var normalize = require('medic-bulk-utils').normalize,
    csv = require('fast-csv'),
    uuid = require('uuid'),
    path = require('path');

var relatedData,
    relatedDataConfig = {
      path: ['dist', 'places-level-3.csv'],
      onRow: function(obj) {
        // map a lookup key to a uuid
        relatedData[obj.household_id] = obj.uuid;
      }
    };

var config = {
  columns: {
    uuid: uuid,
    external_id: 'person_id',
    household_id: 'household_id',
    name: {
      use: 'name',
      format: [normalize.name]
    },
    sex: 'sex',
    exact_dob_known: 'exact_dob_known',
    place: function() {
      var key = this.household_id;
      if (typeof relatedData[key] !== 'undefined') {
        return relatedData[key];
      } else {
        console.error(this);
        throw new Error('Place ID not found: ' + key);
      }
    },
    date_of_birth: {
      use: 'date_of_birth',
      format: [normalize.date,'MM/DD/YYYY'],
      optional: true
    },
    phone: {
      use: 'phone',
      optional: true,
      format: [normalize.phone, '+502']
    },
    reported_date: {
      use: 'reported_date',
      format: [normalize.date,'MM/DD/YYYY','x'] //unix ms timestamp
    },
    occupation: 'occupation',
    civil_status: 'civil_status',
    years_in_school: 'years_in_school',
    has_children: 'has_children',
    live_with_children: 'live_with_children',
    num_pregnancies: 'num_pregnancies',
    all_children_living: 'all_children_living',
    num_children_living: 'num_children_living',
    num_children_dead: 'num_children_dead',
    dead_children_info: 'dead_children_info',
    diabetes_diagnosis: 'diabetes_diagnosis',
    pregnancy_info_type: 'pregnancy_info_type',
    pregnancy_info_number: 'pregnancy_info_number',
    mother_prenatal_care: 'mother_prenatal_care',
    pregnancy_length_months: 'pregnancy_length_months',
    birth_weight_pounds: 'birth_weight_pounds',
    birth_weight_ounces: 'birth_weight_ounces',
    birth_height_cm: 'birth_height_cm',
    has_older_sibling: 'has_older_sibling',
    older_sibling_dob: 'older_sibling_dob',
    has_chronic_illness_or_disability: 'has_chronic_illness_or_disability',
    chronic_illness_or_disability: 'chronic_illness_or_disability',
    chronic_illness_or_disability_other: 'chronic_illness_or_disability_other',
    chronic_illness_or_disability_final: 'chronic_illness_or_disability_final',
    status: 'status',
    currently_receiving_supplement: 'currently_receiving_supplement',
    notes: 'notes',
    patient_age_years: {
      use: 'patient_age_years',
      optional: true
    }
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
