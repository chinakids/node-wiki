var http = require('http');

var updata = {
  menu : function(port){
    http.request({
        port: port,
        path: '/api/updataMenu',
        method: 'GET'
    }, function (res) {
      console.log('保存且目录更新成功');
    }).on('error', function (e) {
      console.log('problem with request: ' + e.message);
    }).end();
  }
}

module.exports = updata;