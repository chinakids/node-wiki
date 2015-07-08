var markDown = {
  /**
   * 获取目录
   * @param  {[str]} buffStr [读取的文件字符串]
   * @param  {[function]} callback  [回调函数]
   * @return {[obj]}         [目录对象]
   */
  getMenu: function(buffStr, callback) {
    //分行存入数组
    var html = buffStr,
      regex = /(<h[1-6])[^>]*?>/ig;
    html = html.replace(regex, "$1>");
    var arr = html.split('\n');

    //console.log(arr);
    //before用来储存原始数组，创建空数组,用来储存目录对象,index 为目录层级
    var before = [],
      menu = [],
      index = 1;
    for (var key in arr) {
      var title = arr[key].match(/^(\<h[1-6]\>[\s\S][^<\/]*\<\/h[1-6]\>)/g);
      if (title != null) {
        before.push(title[0]);
      }
    }
    //console.log(before);
    for (var key in before) {
      //console.log(before[key])
      if (before[key].indexOf('h1') != -1) {
        var reId = before[key].replace('h1', 'h1 id="menu-' + key + '"');
        html = html.replace(before[key], reId);
        menu.push(before[key].match(
          /^\<h[1-6]\>([\s\S][^<\/]*)\<\/h[1-6]\>/)[1])
      } else if (before[key].indexOf('h2') != -1) {
        var reId = before[key].replace('h2', 'h2 id="menu-' + key + '"');
        html = html.replace(before[key], reId);
        menu.push(before[key].match(
          /^\<h[1-6]\>([\s\S][^<\/]*)\<\/h[1-6]\>/)[1])
      } else if (before[key].indexOf('h3') != -1) {
        var reId = before[key].replace('h3', 'h3 id="menu-' + key + '"');
        html = html.replace(before[key], reId);
        menu.push(before[key].match(
          /^\<h[1-6]\>([\s\S][^<\/]*)\<\/h[1-6]\>/)[1])
      } else if (before[key].indexOf('h4') != -1) {
        var reId = before[key].replace('h4', 'h4 id="menu-' + key + '"');
        html = html.replace(before[key], reId);
        menu.push(before[key].match(
          /^\<h[1-6]\>([\s\S][^<\/]*)\<\/h[1-6]\>/)[1])
      } else if (before[key].indexOf('h5') != -1) {
        var reId = before[key].replace('h5', 'h5 id="menu-' + key + '"');
        html = html.replace(before[key], reId);
        menu.push(before[key].match(
          /^\<h[1-6]\>([\s\S][^<\/]*)\<\/h[1-6]\>/)[1])
      } else if (before[key].indexOf('h6') != -1) {
        var reId = before[key].replace('h6', 'h6 id="menu-' + key + '"');
        html = html.replace(before[key], reId);
        menu.push(before[key].match(
          /^\<h[1-6]\>([\s\S][^<\/]*)\<\/h[1-6]\>/)[1])
      }
    }
    callback(html, menu);
  }
}
module.exports = markDown;
