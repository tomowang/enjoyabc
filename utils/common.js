var moment = require('moment')
  , util = require('util')
  , get_date = function(){
    return moment(this.date).format('LL');
  }
  , get_size = function () {
    var size = this.size, unit = 'B'; // size in byte
    if (size >= 1024 && size < 1024 * 1024) {
      size = (size / 1024).toFixed(2);
      unit = 'KB';
    } else if (size >= 1024 * 1024 && size < 1024 * 1024 * 1024) {
      size = (size / (1024 * 1024)).toFixed(2);
      unit = 'MB';
    } else if (size >= 1024 * 1024 * 1024) {
      size = (size / (1024 * 1024 * 1024)).toFixed(2);
      unit = 'GB';
    }
    return util.format('%d%s', size, unit)
  };

exports.get_date = get_date;
exports.get_size = get_size;
