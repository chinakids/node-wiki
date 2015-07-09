var markdown = require('marked');
var mermaid = require('mermaid');
var katex = require('katex');
var domino = require('domino');
var Zepto = require('zepto-node');

var window = domino.createWindow();

var $ = Zepto(window);

//初始化 marked 参数
var renderer = new markdown.Renderer();
renderer.listitem = function(text) {
  //console.log(text);
  if (!/^\[[ x]\]\s/.test(text)) {
    return markdown.Renderer.prototype.listitem(text);
  }
  // 任务列表
  var checkbox = $('<input type="checkbox" disabled/>');
  if (/^\[x\]\s/.test(text)) { // 完成的任务列表
    checkbox.attr('checked', true);
  }
  return $(markdown.Renderer.prototype.listitem(text.substring(3))).addClass(
    'task-list-item').prepend(checkbox)[0].outerHTML;
}
renderer.codespan = function(text) { // inline code
  //console.log('/////////////codespan')
  if (/^\$.+\$$/.test(text)) { // inline math
    var raw = /^\$(.+)\$$/.exec(text)[1];
    var line = raw.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(
      /&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'"); // unescape html characters
    try {
      return katex.renderToString(line, {
        displayMode: false
      });
    } catch (err) {
      return '<code>' + err + '</code>';
    }
  }
  return markdown.Renderer.prototype.codespan.apply(this, arguments);
}
renderer.code = function(code, language, escaped, line_number) {
  //console.log('/////////////code')
  console.log(line_number)
  code = code.trim();
  var firstLine = code.split(/\n/)[0].trim();
  if (language === 'math') { // 数学公式
    var tex = '';
    code.split(/\n\n/).forEach(function(line) {
      line = line.trim();
      if (line.length > 0) {
        try {
          tex += katex.renderToString(line, {
            displayMode: true
          });
        } catch (err) {
          tex += '<pre>' + err + '</pre>';
        }
      }
    });
    return '<div data-line="' + line_number + '">' + tex + '</div>';
  } else if (firstLine === 'gantt' || firstLine === 'sequenceDiagram' ||
    firstLine.match(/^graph (?:TB|BT|RL|LR|TD);?$/)) {
    if (firstLine === 'sequenceDiagram') {
      code += '\n'; // 如果末尾没有空行，则语法错误
    }
    if (mermaid.mermaidAPI.parse(code)) {
      return '<div class="mermaid" data-line="' + line_number + '">' + code +
        '</div>';
    } else {
      return '<pre data-line="' + line_number + '">' + mermaidError +
        '</pre>';
    }
  } else {
    return markdown.Renderer.prototype.code.apply(this, arguments);
  }
};
renderer.html = function(html) {
  var result = markdown.Renderer.prototype.html.apply(this, arguments);
  var h = $(result.bold());
  return h.html();
};
renderer.paragraph = function(text) {
  var result = markdown.Renderer.prototype.paragraph.apply(this, arguments);
  var h = $(result.bold());
  return h.html();
};
markdown.setOptions({
  renderer: renderer,
  gfm: true,
  tables: true,
  breaks: false,
  pedantic: false,
  sanitize: false,
  smartLists: true,
  smartypants: true
});


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
  },
  /**
   * markdown 转 html
   * @param  {[type]}   buffStr  [传入的 markdown 文档]
   * @param  {Function} callback [description]
   */
  toHtml: function(buffStr, callback) {
    var html = markdown(buffStr);
    this.getMenu(html, callback)
  }
}
module.exports = markDown;
