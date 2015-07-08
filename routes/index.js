var express = require('express');
var router = express.Router();


var fs = require('fs');
var path = require('path');
var mdtools = require('../tools/markDown.js');
var markdown = require('marked');
var _ = require('underscore');
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
  //console.log(!/^\[[ x]\]\s/.test(text))
  //console.log($('<input type="checkbox" disabled/>'));
  console.log('/////////////listitem')
  if (!/^\[[ x]\]\s/.test(text)) {
    return markdown.Renderer.prototype.listitem(text);
  }
  // 任务列表
  var checkbox = $('<input type="checkbox" disabled/>');
  //console.log(checkbox[0])
  if (/^\[x\]\s/.test(text)) { // 完成的任务列表
    checkbox.attr('checked', true);
  }
  //console.log($(markdown.Renderer.prototype.listitem(text.substring(3))).addClass(
  //'task-list-item').prepend(checkbox)[0].outerHTML)
  return $(markdown.Renderer.prototype.listitem(text.substring(3))).addClass(
    'task-list-item').prepend(checkbox)[0].outerHTML;
}
renderer.codespan = function(text) { // inline code
  console.log('/////////////codespan')
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
  console.log('/////////////code')
  code = code.trim();
  var firstLine = code.split(/\n/)[0].trim();
  if (language === 'math') { // 数学公式
    console.log('/////////////code/////math')
    var tex = '';
    code.split(/\n\n/).forEach(function(line) { // 连续两个换行，则开始下一个公式
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
    firstLine.match(/^graph (?:TB|BT|RL|LR|TD);?$/)) { // mermaid
    console.log('/////////////code/////mermaid')
    console.log(firstLine);
    if (firstLine === 'sequenceDiagram') {
      code += '\n'; // 如果末尾没有空行，则语法错误
    }

    //console.log(mermaid.mermaidAPI.parse(code))
    if (mermaid.mermaidAPI.parse(code)) {
      return '<div class="mermaid" data-line="' + line_number + '">' + code +
        '</div>';
    } else {
      return '<pre data-line="' + line_number + '">' + mermaidError +
        '</pre>';
    }
  } else {
    console.log('/////////////code/////other')
    return markdown.Renderer.prototype.code.apply(this, arguments);
  }
};
renderer.html = function(html) {
  console.log('/////////////html')
  var result = markdown.Renderer.prototype.html.apply(this, arguments);
  var h = $(result.bold());
  return h.html();
};
renderer.paragraph = function(text) {
  console.log('/////////////paragraph')
  var result = markdown.Renderer.prototype.paragraph.apply(this, arguments);
  var h = $(result.bold());
  // h.find('script,iframe').remove();
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


var treeNode = {};
//目录遍历
function walk(path, treeNode) {
  treeNode.path = path;
  treeNode.subNodes = [];
  treeNode.files = [];
  treeNode.pathName = path.split('/')[path.split('/').length - 1];
  var dirList = fs.readdirSync(path);
  dirList.forEach(function(item) {
    if (fs.statSync(path + '/' + item).isDirectory()) {
      var subNode = {};
      treeNode.subNodes.push(subNode);
      walk(path + '/' + item, subNode);
    } else {
      if (item != '.DS_Store' && item != 'readme.md' && item.indexOf('.md') !=
        -1) {
        treeNode.files.push(item.split('.')[0]);
      }
    }
  });
}
walk(path.join(__dirname, '../doc'), treeNode);
/* GET home page. */
router.get('/', function(req, res, next) {
  var buffStr = fs.readFileSync(path.join(__dirname, '../doc/readme.md'),
    'utf8');
  var html = markdown(buffStr);
  console.log(html);
  mdtools.getMenu(html, function(html, menu) {
    res.render('index', {
      title: '首页',
      html: html,
      menu: menu,
      tree: treeNode,
      map: []
    });
  });
});
/* GET home page. */
router.get('/book', function(req, res, next) {
  var md = req.query.md;
  var buffStr = fs.readFileSync(path.join(__dirname, '../doc/' + md + '.md'),
    'utf8');
  console.log(buffStr)
  var html = markdown(buffStr);
  console.log(html);
  mdtools.getMenu(html, function(html, menu) {
    console.log(treeNode);
    //res.send('ok')
    res.render('index', {
      title: md.split('/')[md.split('/').length - 1],
      html: html,
      menu: menu,
      tree: treeNode,
      map: md.split('/')
    });
  });
});

module.exports = router;
