var http = require('http');

var updata = {
  menu : function(port){
    //console.log(port);
    http.request({
        port: port,
        path: '/api/updataMenu',
        method: 'GET'
    }, function (res) {
    }).on('error', function (e) {
      console.log('problem with request: ' + e.message);
    }).end();
  }
}

module.exports = updata;