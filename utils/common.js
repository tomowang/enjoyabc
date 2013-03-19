var moment = require('moment')
  , get_date = function(){
      return moment(this.date).format('LL');
    };

exports.get_date = get_date;
