var normalize = require('medic-bulk-utils').normalize,
    csv = require('fast-csv'),
    uuid = require('uuid'),
    path = require('path');

var relatedData,
    relatedDataConfig = {
      path: ['dist', 'people.csv'],
      onRow: function(obj) {
        // map a lookup key to a uuid
        relatedData[obj.external_id] = obj.uuid;
      }
    };

var config = {
  columns: {
    uuid: uuid,
    reported_date: {
      use: 'p_visit_date',
      format: [normalize.date,'MM/DD/YYYY','x'] //unix ms timestamp
    },
    reported_date_source: 'p_visit_date',
    person_id: 'person_id',
    contact: function() {
      var key = this.person_id;
      if (typeof relatedData[key] !== 'undefined') {
        return relatedData[key];
      } else {
        console.error(this);
        throw new Error('Concession ID not found: ' + key);
      }
    },
visit_id: 'visit_id',
source: 'source',
source_id: 'source_id',
  t_deparasite_date: {
    use: 't_deparasite_date',
    format: [normalize.date,'MM/DD/YYYY'],
    optional: true
  },
  t_visit_date: {
    use: 't_visit_date',
    format: [normalize.date,'MM/DD/YYYY'],
    optional: true
  },
t_weight_part_pounds: 't_weight_part_pounds',
t_weight_part_ounces: 't_weight_part_ounces',
t_height: 't_height',
t_wfa_grade: 't_wfa_grade',
t_hfa_grade: 't_hfa_grade',
t_wfh_grade: 't_wfh_grade',
t_currently_breastfeeding: 't_currently_breastfeeding',
t_exclusively_breastfeeding: 't_exclusively_breastfeeding',
t_age_stopped_exclusively_breastfeeding: 't_age_stopped_exclusively_breastfeeding',
t_age_stopped_all_breastfeeding: 't_age_stopped_all_breastfeeding',
t_contact_summary_weight: 't_contact_summary_weight',
t_contact_summary_height: 't_contact_summary_height',
name: 'name',
  date_of_birth: {
    use: 'date_of_birth',
    format: [normalize.date,'MM/DD/YYYY'],
    optional: true
  },
zscore_age_in_days0: 'zscore_age_in_days0',
zscore_sex0: 'zscore_sex0',
weight0: 'weight0',
sex: 'sex',
status: 'status',
currently_receiving_supplement: 'currently_receiving_supplement',
chronic_illness_or_disability_final: 'chronic_illness_or_disability_final',
patient_name: 'patient_name',
    child_dob: {
      use: 'child_dob',
      format: [normalize.date,'MM/DD/YYYY']
    },
child_sex: 'child_sex',
child_status: 'child_status',
receiving_supplement: 'receiving_supplement',
currently_breastfeeding: 'currently_breastfeeding',
breastfeeding_only: 'breastfeeding_only',
age_stopped_only_breastfeeding_months: 'age_stopped_only_breastfeeding_months',
age_stopped_all_breastfeeding_months: 'age_stopped_all_breastfeeding_months',
previous_weight_part_pounds: 'previous_weight_part_pounds',
previous_weight_part_ounces: 'previous_weight_part_ounces',
previous_height_centimeters: 'previous_height_centimeters',
previous_wfa_grade: 'previous_wfa_grade',
previous_lhfa_grade: 'previous_lhfa_grade',
  previous_deparasiting_date: {
    use: 'previous_deparasiting_date',
    format: [normalize.date,'MM/DD/YYYY'],
    optional: true
  },
  previous_deparasiting_date_fixed: {
    use: 'previous_deparasiting_date_fixed',
    format: [normalize.date,'MM/DD/YYYY'],
    optional: true
  },
  previous_visit_date: {
    use: 'previous_visit_date',
    format: [normalize.date,'MM/DD/YYYY'],
    optional: true
  },
  previous_visit_date_fixed: {
    use: 'previous_visit_date_fixed',
    format: [normalize.date,'MM/DD/YYYY'],
    optional: true
  },
  current_date: {
    use: 'current_date',
    format: [normalize.date,'MM/DD/YYYY'],
    optional: true
  },
  current_date_fixed: {
    use: 'current_date_fixed',
    format: [normalize.date,'MM/DD/YYYY'],
    optional: true
  },
  current_date_formatted: {
    use: 'current_date_formatted',
    format: [normalize.date,'MM/DD/YYYY'],
    optional: true
  },
  previous_deparasiting_date_formatted: {
    use: 'previous_deparasiting_date_formatted',
    format: [normalize.date,'MM/DD/YYYY'],
    optional: true
  },
days_since_last_deparasiting: 'days_since_last_deparasiting',
months_since_last_deparasiting: 'months_since_last_deparasiting',
    child_dob_formatted: {
      use: 'child_dob_formatted',
      format: [normalize.date,'MM/DD/YYYY']
    },
previous_weight_pounds: 'previous_weight_pounds',
child_present: 'child_present',
previous_contact_summary_weight: 'previous_contact_summary_weight',
previous_contact_summary_height: 'previous_contact_summary_height',
    p_deparasite_date: {
      use: 'p_deparasite_date',
      format: [normalize.date,'MM/DD/YYYY'],
      optional: true
    },
    p_visit_date: {
      use: 'p_visit_date',
      format: [normalize.date,'MM/DD/YYYY'],
      optional: true
    },
p_weight_part_pounds: 'p_weight_part_pounds',
p_weight_part_ounces: 'p_weight_part_ounces',
p_height: 'p_height',
p_wfa_grade: 'p_wfa_grade',
p_hfa_grade: 'p_hfa_grade',
p_wfh_grade: 'p_wfh_grade',
p_currently_breastfeeding: 'p_currently_breastfeeding',
p_exclusively_breastfeeding: 'p_exclusively_breastfeeding',
p_age_stopped_exclusively_breastfeeding: 'p_age_stopped_exclusively_breastfeeding',
p_age_stopped_all_breastfeeding: 'p_age_stopped_all_breastfeeding',
p_contact_summary_weight: 'p_contact_summary_weight',
p_contact_summary_height: 'p_contact_summary_height',
inactive_child_present: 'inactive_child_present',
active_child_present: 'active_child_present',
absent_reason: 'absent_reason',
promoter_community1: 'promoter_community1',
promoter_name1: 'promoter_name1',
    confirmation_dob: {
      use: 'confirmation_dob',
      format: [normalize.date,'MM/DD/YYYY'],
      optional: true
    },
visit_date_use_current: 'visit_date_use_current',
  visit_date_other_date: {
    use: 'visit_date_other_date',
    format: [normalize.date,'MM/DD/YYYY'],
    optional: true
  },
  visit_date_other_decimal_date_time: {
    use: 'visit_date_other_decimal_date_time',
    format: [normalize.date,'MM/DD/YYYY'],
    optional: true
  },
  visit_date_other_fixed: {
    use: 'visit_date_other_fixed',
    format: [normalize.date,'MM/DD/YYYY'],
    optional: true
  },
  visit_date_other_formatted: {
    use: 'visit_date_other_formatted',
    format: [normalize.date,'MM/DD/YYYY'],
    optional: true
  },
  current_date_decimal_date_time: {
    use: 'current_date_decimal_date_time',
    format: [normalize.date,'MM/DD/YYYY'],
    optional: true
  },
visit_date_other_decimal_date_time: 'visit_date_other_decimal_date_time',
  visit_date_final: {
    use: 'visit_date_final',
    format: [normalize.date,'MM/DD/YYYY'],
    optional: true
  },
location: 'location',
weight_part_pounds: 'weight_part_pounds',
weight_part_ounces: 'weight_part_ounces',
weight_pounds: 'weight_pounds',
actual_kg: 'actual_kg',
kg_upper_bound: 'kg_upper_bound',
kg_lower_bound: 'kg_lower_bound',
zscore_sex: 'zscore_sex',
zscore_age_in_days: 'zscore_age_in_days',
weight_kg: 'weight_kg',
calculated_weight_kg: 'calculated_weight_kg',
height_cm: 'height_cm',
current_wfa_grade: 'current_wfa_grade',
current_lhfa_grade: 'current_lhfa_grade',
current_wfh_grade: 'current_wfh_grade',
wfa_grade_difference: 'wfa_grade_difference',
lhfa_grade_difference: 'lhfa_grade_difference',
previous_weight_summary: 'previous_weight_summary',
previous_height_summary: 'previous_height_summary',
change_increase_pounds1: 'change_increase_pounds1',
change_increase_pounds2: 'change_increase_pounds2',
change_increase_ounces1: 'change_increase_ounces1',
change_increase_ounces2: 'change_increase_ounces2',
change_decrease_pounds1: 'change_decrease_pounds1',
change_decrease_pounds2: 'change_decrease_pounds2',
change_decrease_ounces1: 'change_decrease_ounces1',
change_decrease_ounces2: 'change_decrease_ounces2',
change_increase_height: 'change_increase_height',
change_decrease_height: 'change_decrease_height',
breastfeeding_currently: 'breastfeeding_currently',
only_breastfeeding: 'only_breastfeeding',
age_only_breastfed: 'age_only_breastfed',
age_stopped_breastfeeding: 'age_stopped_breastfeeding',
number_of_times_drink: 'number_of_times_drink',
drink_type: 'drink_type',
number_of_times_fruits: 'number_of_times_fruits',
number_of_times_herbs: 'number_of_times_herbs',
sick_last_week: 'sick_last_week',
number_of_days_diarrhea: 'number_of_days_diarrhea',
number_of_days_vomit: 'number_of_days_vomit',
number_of_days_cough: 'number_of_days_cough',
number_of_days_fever: 'number_of_days_fever',
number_of_days_flu: 'number_of_days_flu',
reference_needed: 'reference_needed',
reference_details: 'reference_details',
deparasiting_q1: 'deparasiting_q1',
deparasiting_q2: 'deparasiting_q2',
deparasiting_q3: 'deparasiting_q3',
  final_deparasite_date: {
    use: 'final_deparasite_date',
    format: [normalize.date,'MM/DD/YYYY'],
    optional: true
  },
notes: 'notes',
promoter_community2: 'promoter_community2',
promoter_name2: 'promoter_name2',
current_weight_summary: 'current_weight_summary',
current_summary_height: 'current_summary_height',
form: 'form',
type: 'type',
    // fields below here are passed directly and can be generated
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
