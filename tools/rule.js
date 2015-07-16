var crypto = require('crypto');

var rule = {
  md5 : function(str){
    var md5 = crypto.createHash('md5');
    var d2 = md5.update(str).digest('hex');
    //console.log(d2);
    return d2;
  }
}
module.exports = rule;
