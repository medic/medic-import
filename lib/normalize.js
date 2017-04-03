var moment = require('moment');

module.exports = {
  name: function (name, opts) {
    opts = opts || {};
    if (opts.reverse) {
      // generally surname is first
      var parts = name.split(/\s+/);
      return module.exports.name(parts.pop() + ' ' + parts.join(' '));
    }
    // capitalize first letters
    return name.trim().split(/\s+/).map(function(word) {
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    }).join(' ');
  },
  phone: function(phone, prefix) {
    prefix = prefix || '+254'; // Kenya
    var val = phone.toString();
    if (val.length == 9 || val.length == 8) {
      return prefix + val;
    }
    if (val.match(/^\s*0/)) {
      return val.replace(/^\s*0/, prefix).replace(/[\-\s]/g,'');
    }
    return val;
  },
  username: function(name) {
    var parts = name.split(/\s+/),
        surname = parts[0],
        firstname = parts.pop();
    return surname.toLowerCase() +
           firstname.charAt(0).toLowerCase() +
           firstname.charAt(1).toLowerCase();
  },
  geo: function(lat, lon) {
    return `${lat} ${lon}`;
  },
  timestamp: function(str) {
    var d = str ? new Date(str) : new Date();
    return d.toISOString();
  },
  /*
   * Return the string date format: YYYY-MM-DD
   * All calculations assume GMT.
   */
  date: function(str, inFormat, outFormat) {
    if (str) {
      return moment.utc(str, inFormat).format(outFormat || 'YYYY-MM-DD');
    }
    return str;
  }
};
