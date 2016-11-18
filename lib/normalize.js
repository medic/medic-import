var formatDate = function(str) {
  var d = new Date(str),
      date =  d.getUTCDate().toString(),
      month = Number(d.getUTCMonth() + 1).toString(),
      year = d.getUTCFullYear();
  if (!d.getUTCDate()) { // failed to parse
    return str;
  }
  if (date.length === 1) {
    date = '0' + date;
  }
  if (month.length === 1) {
    month = '0' + month;
  }
  return year + '-' + date + '-' + month;
};

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
    return lat + ' ' + lon;
  },
  timestamp: function(str) {
    var d = str ? new Date(str) : new Date();
    return d.toISOString();
  },
  /*
   * Return the string date format: YYYY-MM-DD
   * All calculations assume GMT.  This should be upgraded to use moment.
   */
  date: function(str) {
    var match;
    // 2015
    if (/^\d{4}$/.test(str)) {
      return str + '-01-01';
    }
    // 25/5/2004 and 5/25/2004
    if (/^\d+\/\d+\/\d+$/.test(str)) {
      if (new Date(str).getDate()) {
        return formatDate(str);
      }
      match = str.match(/^(\d+)\/(\d+)\/(\d+)$/);
      return formatDate(match[2] + '/' + match[1] + '/' + match[3]);
    }
    // /10/2015
    // throw away bad data, only use year.
    if (/^\/\d+\/\d{4}$/.test(str)) {
      match = str.match(/\/(\d{4})$/);
      return formatDate(match[1]);
    }
    // 13//2016
    // throw away bad data, only use year.
    if (/^[\/]?\d+\/\/\d{4}$/.test(str)) {
      match = str.match(/^\d+\/\/(\d{4})$/);
      return formatDate(match[1]);
    }
    // Apr-12
    // We have a date, assume it's this year.
    if (/^\w+-\d+$/.test(str)) {
      return formatDate(str + '-' + (new Date()).getUTCFullYear());
    }
    // Can't do nothing for ya man.
    return str;
  }
};
